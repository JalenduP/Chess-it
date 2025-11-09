import React, { useEffect, useRef, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import {Chess} from 'chess.js';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalysisBoard({ wsUrl = (window.location.protocol === 'https:' ? 'wss:' : 'ws:') + '//' + (process.env.REACT_APP_API_HOST || window.location.hostname) + ':' + (process.env.REACT_APP_API_PORT || window.location.port || 8080) + '/ws/analysis' }) {
  const [game] = useState(() => new Chess());
  const [fen, setFen] = useState(game.fen());
  const [pv, setPv] = useState([]);
  const [evals, setEvals] = useState([]);
  const [depth, setDepth] = useState(12);
  const wsRef = useRef(null);

  // replay state
  const [movesList, setMovesList] = useState([]); // uci moves
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [selectedMoveIndex, setSelectedMoveIndex] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;
    ws.onopen = () => {
      console.log('analysis ws open');
    };
    ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data);
        if (msg.type === 'info') {
          if (msg.payload && msg.payload.pv) {
            setPv(prev => [{ pv: msg.payload.pv, depth: msg.payload.depth, score: msg.payload.score, nodes: msg.payload.nodes }, ...prev].slice(0, 8));
            const s = msg.payload.score;
            let numeric = null;
            if (s) {
              if (s.type === 'cp') numeric = s.value / 100.0;
              else if (s.type === 'mate') numeric = (s.value > 0 ? 999 : -999);
            }
            setEvals(prev => [{ time: Date.now(), score: numeric }, ...prev].slice(0, 50));
          }
        } else if (msg.type === 'bestmove') {
          // handle bestmove if needed
        } else if (msg.type === 'game_eval') {
          // incremental evaluation for a move
          const { moveIndex, score } = msg;
          setProgress(prev => ({ done: prev.done + 1, total: prev.total }));
          setMovesList(prev => {
            const copy = prev.slice();
            // ensure length
            while (copy.length <= moveIndex) copy.push(null);
            copy[moveIndex] = copy[moveIndex] || {}; // placeholder
            return copy;
          });
          setEvals(prev => {
            const copy = prev.slice();
            copy[moveIndex] = { moveIndex, score };
            return copy;
          });
        } else if (msg.type === 'game_eval_done') {
          setIsAnalyzing(false);
        }
      } catch (e) { console.error(e); }
    };
    ws.onclose = () => console.log('analysis ws closed');
    return () => { try { ws.close(); } catch (e) {} };
  }, [wsUrl]);

  function sendPosition() {
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) return;
    ws.send(JSON.stringify({ action: 'position', fen }));
  }

  function startAnalysis() {
    sendPosition();
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'go', depth: Number(depth) }));
  }

  function stopAnalysis() {
    const ws = wsRef.current;
    if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({ action: 'stop' }));
  }

  function onDrop(sourceSquare, targetSquare) {
    const move = game.move({ from: sourceSquare, to: targetSquare, promotion: 'q' });
    if (move) {
      setFen(game.fen());
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ action: 'position', fen: game.fen() }));
        ws.send(JSON.stringify({ action: 'go', depth: Number(depth) }));
      }
    }
    return true;
  }

  // PGN handling
  function importPgnText(pgn) {
    try {
      const g = new Chess();
      const ok = g.load_pgn(pgn);
      if (!ok) {
        alert('Invalid PGN');
        return;
      }
      const hist = g.history({ verbose: true });
      const uciMoves = hist.map(m => m.from + m.to + (m.promotion || ''));
      setMovesList(uciMoves);
      // set board to startpos
      const board = new Chess();
      setFen(board.fen());
      setSelectedMoveIndex(null);
      // also populate a simple evals array placeholder
      setEvals(Array(uciMoves.length).fill(null));
      alert(`Loaded PGN with ${uciMoves.length} moves.`);
    } catch (e) {
      console.error(e);
      alert('Failed to parse PGN');
    }
  }

  function handlePGNFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => importPgnText(reader.result);
    reader.readAsText(file);
  }

  // Analyze full game: send analyze_game to backend
  function analyzeFullGame() {
    if (!movesList || movesList.length === 0) {
      alert('No moves loaded. Import a PGN first.');
      return;
    }
    const ws = wsRef.current;
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert('Analysis websocket not connected.');
      return;
    }
    setIsAnalyzing(true);
    setProgress({ done: 0, total: movesList.length });
    setEvals(Array(movesList.length).fill(null));
    ws.send(JSON.stringify({ action: 'analyze_game', moves: movesList, depth: Number(depth) }));
  }

  // Jump to move index on board
  function gotoMove(index) {
    if (index == null) return;
    const board = new Chess();
    for (let i = 0; i <= index; ++i) {
      const m = movesList[i];
      if (!m) break;
      board.move({ from: m.slice(0,2), to: m.slice(2,4), promotion: m.length>4 ? m[4] : 'q' });
    }
    setFen(board.fen());
    setSelectedMoveIndex(index);
  }

  return (
    <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="col-span-1 md:col-span-2">
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="flex gap-4 items-center mb-3">
            <span>FEN:</span>
            <input className="flex-1 border rounded px-2 py-1" value={fen} onChange={(e)=>setFen(e.target.value)} />
            <button className="px-3 py-1 rounded bg-slate-200" onClick={sendPosition}>Set</button>
            <button className="px-3 py-1 rounded bg-green-200" onClick={startAnalysis}>Start</button>
            <button className="px-3 py-1 rounded bg-red-200" onClick={stopAnalysis}>Stop</button>
            <input type="number" className="w-20 border rounded px-2 py-1" value={depth} onChange={e=>setDepth(e.target.value)} />
          </div>

          <div className="flex gap-4">
            <div>
              <Chessboard position={fen} onPieceDrop={(from, to) => { onDrop(from, to); return true; }} boardWidth={520} />
            </div>
            <div className="flex-1">
              <div className="mb-2 font-semibold">Principal Variations</div>
              <div className="space-y-2 max-h-96 overflow-auto">
                {pv.map((p, idx) => (
                  <div key={idx} className="p-2 border rounded">
                    <div>Depth: {p.depth}  Nodes: {p.nodes}</div>
                    <div className="font-mono">PV: {p.pv}</div>
                    <div>Score: {p.score ? (p.score.type==='cp' ? (p.score.value/100).toFixed(2) + ' (cp)' : `Mate ${p.score.value}`) : '–'}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 border rounded">
            <div className="mb-2 font-semibold">PGN / Game Replay</div>
            <div className="flex gap-2 items-center mb-2">
              <input type="file" accept=".pgn" onChange={handlePGNFile} />
              <button className="px-3 py-1 rounded bg-blue-200" onClick={() => {
                const pgn = prompt('Paste PGN here');
                if (pgn) importPgnText(pgn);
              }}>Import PGN (paste)</button>
              <button className="px-3 py-1 rounded bg-indigo-200" onClick={analyzeFullGame} disabled={isAnalyzing}>{isAnalyzing ? 'Analyzing...' : 'Replay & Analyze'}</button>
              <div className="ml-4 text-sm">{progress.done}/{progress.total} moves done</div>
            </div>
            <div className="text-sm">Click a point on the graph to jump to that move after analysis completes.</div>
          </div>
        </div>
      </div>

      <div className="col-span-1">
        <div className="bg-white rounded-2xl p-4 shadow">
          <div className="font-semibold mb-2">Eval Graph (move index)</div>
          <div style={{ height: 240 }}>
            <ResponsiveContainer>
              <LineChart data={(Array.isArray(evals) ? evals.map((e, idx) => ({ move: idx+1, score: e ? e.score : null })) : [])}>
                <XAxis dataKey="move" />
                <YAxis />
                <Tooltip labelFormatter={(v)=>`Move ${v}`} />
                <Line type="monotone" dataKey="score" strokeWidth={2} dot={{ r: 3 }} onClick={(d) => gotoMove(d.payload.move - 1)} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4">
            <div className="font-semibold">Controls</div>
            <div className="mt-2 text-sm">
              <div>Depth input controls engine search depth per move during replay. Use moderate values to avoid CPU spikes. For faster results, lower depth or set movetime.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
