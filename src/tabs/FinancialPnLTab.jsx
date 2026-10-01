import React, { useMemo } from 'react';

export default function FinancialPnLTab({ orders, expenses }) {
  const pnl = useMemo(() => {
    const valid = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'CALLBACK_REQUIRED');
    const cancelled = orders.filter((o) => o.status === 'CANCELLED');

    const totalAdvances = valid.reduce((sum, o) => sum + (parseFloat(o.advancePaid) || 0), 0);
    const totalDispatch = valid.reduce((sum, o) => sum + (parseFloat(o.amountPaidAtDispatch) || 0), 0);
    const totalDiscounts = valid.reduce((sum, o) => sum + (parseFloat(o.discount) || 0), 0);
    const totalRetainedFees = cancelled.reduce((sum, o) => sum + (parseFloat(o.cancellationFee) || 0), 0);

    const totalExpenses = expenses.reduce((sum, e) => sum + (parseFloat(e.amount) || 0), 0);
    const grossReceipts = totalAdvances + totalDispatch + totalRetainedFees;
    const netProfit = grossReceipts - totalExpenses;

    return {
      totalAdvances,
      totalDispatch,
      totalDiscounts,
      totalRetainedFees,
      totalExpenses,
      grossReceipts,
      netProfit
    };
  }, [orders, expenses]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Gross Operating Receipts</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-2">
            ₹{pnl.grossReceipts.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Order Advances:</span>
              <span className="font-mono text-slate-200">₹{pnl.totalAdvances}</span>
            </div>
            <div className="flex justify-between">
              <span>Dispatch Collections:</span>
              <span className="font-mono text-slate-200">₹{pnl.totalDispatch}</span>
            </div>
            <div className="flex justify-between text-amber-400">
              <span>Retained Cancellation Fees:</span>
              <span className="font-mono font-bold">+₹{pnl.totalRetainedFees}</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <div className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Expenses & Utilities</div>
          <div className="text-2xl font-black text-rose-400 font-mono mt-2">
            ₹{pnl.totalExpenses.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Shop Utilities & Overheads:</span>
              <span className="font-mono text-slate-200">
                ₹{expenses.filter((e) => e.category === 'SHOP').reduce((s, e) => s + parseFloat(e.amount), 0)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Staff Wages:</span>
              <span className="font-mono text-slate-200">
                ₹{expenses.filter((e) => e.category === 'WAGE').reduce((s, e) => s + parseFloat(e.amount), 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/40 p-5 rounded-2xl shadow-xl bg-gradient-to-br from-slate-900 to-amber-950/20">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider">Net Operating Profit</div>
          <div className="text-3xl font-black text-amber-400 font-mono mt-2">
            ₹{pnl.netProfit.toLocaleString()}
          </div>
          <div className="mt-3 text-xs text-slate-400">
            Calculated on actual collections + retained cancellation charges minus recorded overhead expenses.
          </div>
        </div>
      </div>
    </div>
  );
}