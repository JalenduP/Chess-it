const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const WebSocket = require('ws');

module.exports = function (httpServer) {
  const STOCKFISH_PATH = process.env.STOCKFISH_PATH || path.join(__dirname, 'engine', 'stockfish');
  if (!fs.existsSync(STOCKFISH_PATH)) {
    console.warn('Stockfish binary not found at', STOCKFISH_PATH);
    return;
  }

  const wss = new WebSocket.Server({ server: httpServer, path: '/ws/analysis' });
  console.log('Stockfish WS listening at /ws/analysis');

  function createEngine() {
    const proc = spawn(STOCKFISH_PATH, [], { stdio: ['pipe', 'pipe', 'pipe'] });
    proc.stdin.setDefaultEncoding('utf-8');
    proc.stdout.setEncoding('utf-8');
    return proc;
  }

  function sendUciLine(proc, line) {
    try { proc.stdin.write(line + '\\n'); } catch (e) { console.error('engine write err', e.message); }
  }

  function parseInfo(line) {
    const out = {};
    const tokens = line.trim().split(/\s+/);
    for (let i = 0; i < tokens.length; i++) {
      const t = tokens[i];
      if (t === 'depth') out.depth = Number(tokens[++i]);
      else if (t === 'multipv') out.multipv = Number(tokens[++i]);
      else if (t === 'score') {
        const kind = tokens[++i];
        const val = Number(tokens[++i]);
        if (kind === 'cp') out.score = { type: 'cp', value: val };
        else if (kind === 'mate') out.score = { type: 'mate', value: val };
      } else if (t === 'nodes') out.nodes = Number(tokens[++i]);
      else if (t === 'nps') out.nps = Number(tokens[++i]);
      else if (t === 'pv') {
        out.pv = tokens.slice(i + 1).join(' ');
        break;
      }
    }
    return out;
  }

  wss.on('connection', function connection(ws, req) {
    console.log('Analysis client connected:', req.socket.remoteAddress);
    const engine = createEngine();

    engine.stdout.on('data', (raw) => {
      const lines = raw.split(/\r?\n/).filter(Boolean);
      for (const line of lines) {
        if (line.startsWith('info')) {
          const parsed = parseInfo(line);
          // store last score for batch analysis use
          try { engine._lastInfoScore = parsed.score || engine._lastInfoScore; } catch(e){}
          ws.send(JSON.stringify({ type: 'info', payload: parsed }));
        } else if (line.startsWith('bestmove')) {
          const parts = line.split(/\s+/);
          ws.send(JSON.stringify({ type: 'bestmove', payload: { bestmove: parts[1], ponder: parts[3] } }));
        } else {
          // forward for debugging if needed
          // ws.send(JSON.stringify({ type: 'log', payload: line }));
        }
      }
    });

    engine.stderr.on('data', (d) => console.error('engine err:', d.toString()));
    engine.on('exit', (code) => console.log('engine exit', code));

    // Initialize
    sendUciLine(engine, 'uci');
    sendUciLine(engine, 'isready');

    ws.on('message', function incoming(message) {
      try {
        const parsedMsg = JSON.parse(message);
        // handle batch game analysis command
        if (parsedMsg.action === 'analyze_game' && Array.isArray(parsedMsg.moves)) {
          // options: depth or movetime (ms)
          const moves = parsedMsg.moves;
          const depthOption = parsedMsg.depth || null;
          const movetimeOption = parsedMsg.movetime || null;

          (async function runGameAnalysis() {
            for (let i = 0; i < moves.length; ++i) {
              // set position up to move i (moves[0..i])
              const prefix = moves.slice(0, i + 1);
              sendUciLine(engine, `position startpos moves ${prefix.join(' ')}`);
              // prepare to receive score - captured from info events into engine._lastInfoScore
              engine._lastInfoScore = null;
              // send go command
              if (depthOption) sendUciLine(engine, `go depth ${depthOption}`);
              else if (movetimeOption) sendUciLine(engine, `go movetime ${movetimeOption}`);
              else sendUciLine(engine, `go depth 12`);

              // wait for bestmove (resolve on bestmove or timeout ~5s)
              await new Promise((resolve) => {
                let resolved = false;
                const onBest = (data) => {
                  try {
                    const line = data.toString();
                    if (line.startsWith('bestmove')) {
                      if (!resolved) { resolved = true; resolve(); }
                    }
                  } catch (e) {}
                };
                engine.stdout.on('data', onBest);
                // fallback timeout 5s
                setTimeout(()=>{ if(!resolved){ resolved=true; resolve(); } }, 5000);
              });

              // Extract score from engine._lastInfoScore if available
              let score = null;
              if (engine._lastInfoScore) {
                const s = engine._lastInfoScore;
                if (s.type === 'cp') score = s.value / 100.0;
                else if (s.type === 'mate') score = (s.value > 0 ? 999 : -999);
              }
              ws.send(JSON.stringify({ type: 'game_eval', moveIndex: i, score }));
            }
            ws.send(JSON.stringify({ type: 'game_eval_done' }));
          })();
          return;
        }
      } catch (e) {
        // continue to main parser below
      }

      try {
        const msg = JSON.parse(message);
        if (msg.action === 'position') {
          if (msg.fen) sendUciLine(engine, `position fen ${msg.fen}`);
          else if (msg.moves && msg.moves.length) sendUciLine(engine, `position startpos moves ${msg.moves.join(' ')}`);
        } else if (msg.action === 'go') {
          const goParts = ['go'];
          if (msg.depth) goParts.push('depth', String(msg.depth));
          if (msg.movetime) goParts.push('movetime', String(msg.movetime));
          sendUciLine(engine, goParts.join(' '));
        } else if (msg.action === 'stop') {
          sendUciLine(engine, 'stop');
        } else if (msg.action === 'uci_args') {
          for (const k of Object.keys(msg.args || {})) {
            sendUciLine(engine, `setoption name ${k} value ${msg.args[k]}`);
          }
          sendUciLine(engine, 'isready');
        } else if (msg.action === 'quit') {
          sendUciLine(engine, 'quit');
          try { engine.kill(); } catch (e) {}
        }
      } catch (e) {
        console.error('ws parse error', e);
      }
    });

    ws.on('close', () => {
      try { sendUciLine(engine, 'quit'); engine.kill(); } catch (e) {}
      console.log('Analysis client disconnected');
    });
  });
};
