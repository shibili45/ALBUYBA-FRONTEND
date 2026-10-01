import React, { useState, useEffect } from 'react';

export default function RecordPaymentModal({ isOpen, onClose, order, onConfirm }) {
  const [amountPaid, setAmountPaid] = useState('');
  const [discount, setDiscount] = useState('0');

  useEffect(() => {
    if (order) {
      setAmountPaid(order.balanceRemaining?.toString() || '0');
      setDiscount(order.discount?.toString() || '0');
    }
  }, [order]);

  if (!isOpen || !order) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      orderId: order.id,
      amountPaid: parseFloat(amountPaid) || 0,
      discount: parseFloat(discount) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
          Record Dispatch Settlement #{order.id}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Total Order Bill</label>
            <div className="text-base font-mono font-bold text-slate-200">₹{order.totalAmount}</div>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Amount Paid Now (₹)</label>
            <input
              type="number"
              value={amountPaid}
              onChange={(e) => setAmountPaid(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-amber-400 font-mono mt-1"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Discount Granted (₹)</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 font-mono mt-1"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl"
            >
              Save Settlement
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}