import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, orderId, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-xl font-bold mx-auto">
          🗑️
        </div>
        <h3 className="text-base font-bold text-slate-100">Delete Order #{orderId}?</h3>
        <p className="text-xs text-slate-400">
          This permanently deletes the order and its items from PostgreSQL. This action cannot be undone.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <button onClick={onClose} className="px-4 py-2 text-xs font-semibold text-slate-400">
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm(orderId);
              onClose();
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-4 py-2 rounded-xl text-xs"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}