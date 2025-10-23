// src/components/gamepage/ResignOverlay.jsx
import React, { useEffect, useRef } from 'react';

/**
 * ResignOverlay
 * - Props:
 *    open: boolean
 *    onConfirm: () => Promise|void
 *    onCancel: () => void
 *    processing: boolean
 *
 * Notes for backend devs:
 * - Frontend should call socket.emit('resign', { gameId }) inside onConfirm
 *   and wait for server ack or 'gameOver' broadcast. Use ACK to surface errors.
 */
export default function ResignOverlay({ open, onConfirm, onCancel, processing = false }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (open && cancelRef.current) cancelRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resign-overlay-title"
    >
      <div className="max-w-md w-full bg-gray-900 rounded-lg border border-gray-700 p-6 shadow-xl">
        <h2 id="resign-overlay-title" className="text-xl font-semibold text-white mb-3">
          Resign Game
        </h2>

        <p className="text-sm text-gray-300 mb-6">
          Are you sure you want to resign? This will end the game immediately and count as a loss.
        </p>

        <div className="flex gap-3 justify-end">
          <button
            ref={cancelRef}
            onClick={onCancel}
            className="px-4 py-2 rounded bg-gray-700 text-white hover:bg-gray-600"
            disabled={processing}
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded font-medium ${processing ? 'bg-red-500 text-black' : 'bg-red-600 text-white hover:bg-red-500'}`}
            disabled={processing}
          >
            {processing ? 'Resigning...' : 'Yes, Resign'}
          </button>
        </div>

        <p className="mt-4 text-xs text-gray-500">
          Note: In production this will call the server. (Leave this overlay open while waiting for server response.)
        </p>
      </div>
    </div>
  );
}
