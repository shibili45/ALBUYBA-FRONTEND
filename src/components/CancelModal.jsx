import React, { useState } from 'react';

export default function CancelModal({ isOpen, onClose, order, onConfirm }) {
  const [refundAmount, setRefundAmount] = useState('0');
  const [reason, setReason] = useState('');

  if (!isOpen || !order) return null;

  const advance = parseFloat(order.advancePaid) || 0;
  const refund = Math.min(advance, Math.max(0, parseFloat(refundAmount) || 0));
  const retainedCharge = Math.max(0, advance - refund);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      orderId: order.id,
      refundAmount: refund,
      cancellationFee: retainedCharge,
      cancellationReason: reason || 'Customer requested pre-booking cancellation'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-lg font-bold text-rose-400 flex items-center gap-2">
          Cancel Booking #{order.id}
        </h3>
        <p className="text-xs text-slate-400">
          Customer deposited <strong className="text-emerald-400">₹{order.advancePaid}</strong> advance. Settle any refund or retained retention charges:
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Refund Amount Returned to Customer (₹)</label>
              <input
                type="number"
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 mt-1 font-mono text-sm"
              />
            </div>

            <div className="flex justify-between items-center text-slate-400 pt-2 border-t border-slate-800">
              <span>Retained Cancellation Fee (Store Profit):</span>
              <span className="font-mono font-bold text-amber-400 text-sm">
                ₹{retainedCharge}
              </span>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Reason for Cancellation</label>
            <input
              type="text"
              placeholder="e.g. Guest change of plans, venue delayed"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 mt-1"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400"
            >
              Go Back
            </button>
            <button
              type="submit"
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-rose-600/20"
            >
              Confirm Cancellation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}