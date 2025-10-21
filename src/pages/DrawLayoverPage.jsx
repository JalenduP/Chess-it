import React, { useEffect, useState } from 'react';

/**
 * DrawLayoverPage
 *
 * Props:
 *  - incomingDraw: null | { by: string, expiresAt: number }   // expiresAt = timestamp (ms)
 *  - onRespond: (accept: boolean) => void                     // callback when user accepts/declines
 *  - onClose?: () => void                                     // optional: asked to close overlay after response
 *
 * Behavior:
 *  - shows a full-screen overlay when incomingDraw is provided.
 *  - shows a countdown derived from expiresAt (fallback 30s).
 *  - auto-declines (calls onRespond(false)) when timer reaches 0.
 *  - accessible (role="dialog", aria-live updates countdown).
 *
 * IMPORTANT:
 *  - This component is intentionally offline-first. Replace the onRespond handler
 *    with a socket emit in Phase 2. Example (to add later):
 *      // TODO (Phase 2): socket.emit('respondDraw', { gameId, accept: true })
 */
export default function DrawLayoverPage({ incomingDraw, onRespond, onClose }) {
  const defaultSeconds = 30;

  const computeInitial = () => {
    if (!incomingDraw) return defaultSeconds;
    if (!incomingDraw.expiresAt) return defaultSeconds;
    const diff = Math.max(0, Math.round((incomingDraw.expiresAt - Date.now()) / 1000));
    return diff > 0 ? diff : 0;
  };

  const [secondsLeft, setSecondsLeft] = useState(computeInitial);
  const [processing, setProcessing] = useState(false);
  const [expired, setExpired] = useState(false);

  // reset when incomingDraw changes
  useEffect(() => {
    setSecondsLeft(computeInitial());
    setExpired(false);
    setProcessing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingDraw?.expiresAt, incomingDraw?.by]);

  // countdown
  useEffect(() => {
    if (!incomingDraw) return;
    if (secondsLeft <= 0) {
      setExpired(true);
      // Auto-decline once timer hits zero
      if (!processing) {
        setProcessing(true);
        // slight delay so UI updates before callback
        setTimeout(() => {
          onRespond && onRespond(false);
          setProcessing(false);
          if (onClose) onClose();
        }, 200);
      }
      return;
    }

    const id = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingDraw, secondsLeft]);

  if (!incomingDraw) return null;

  const handleAccept = () => {
    if (processing) return;
    setProcessing(true);

    // TODO (Phase 2): socket.emit('respondDraw', { gameId, accept: true })
    // For now, call provided callback
    Promise.resolve()
      .then(() => onRespond && onRespond(true))
      .finally(() => {
        setProcessing(false);
        if (onClose) onClose();
      });
  };

  const handleDecline = () => {
    if (processing) return;
    setProcessing(true);

    // TODO (Phase 2): socket.emit('respondDraw', { gameId, accept: false })
    Promise.resolve()
      .then(() => onRespond && onRespond(false))
      .finally(() => {
        setProcessing(false);
        if (onClose) onClose();
      });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="draw-offer-title"
    >
      <div className="max-w-lg w-full bg-gray-900 rounded-xl border border-gray-700 p-6">
        <h2 id="draw-offer-title" className="text-xl font-bold text-white mb-2">
          Draw Offer
        </h2>

        <p className="text-sm text-gray-300 mb-4">
          {incomingDraw.by ? (
            <>
              <span className="font-medium text-gray-100">{incomingDraw.by}</span> has offered a draw.
            </>
          ) : (
            'Opponent has offered a draw.'
          )}
        </p>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-xs text-gray-400">Time left to accept</div>
            <div
              className="text-2xl font-mono font-bold text-yellow-400"
              aria-live="polite"
            >
              {secondsLeft}s
            </div>
          </div>

          <div className="text-right text-sm text-gray-400">
            <div className="mb-1">Auto-decline on timeout</div>
            {expired && <div className="text-red-400">Expired</div>}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleAccept}
            disabled={processing || expired}
            className={`flex-1 py-3 rounded-lg font-medium ${
              processing
                ? 'bg-yellow-400 text-black opacity-80'
                : 'bg-yellow-500 text-white hover:bg-yellow-600'
            }`}
          >
            {processing ? 'Processing...' : 'Accept'}
          </button>

          <button
            onClick={handleDecline}
            disabled={processing}
            className="flex-1 py-3 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
          >
            Decline
          </button>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          <button
            onClick={() => {
              // small escape: decline locally without calling backend
              if (processing) return;
              setExpired(true);
              onRespond && onRespond(false);
              if (onClose) onClose();
            }}
            className="underline"
            aria-label="Dismiss draw offer"
          >
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
