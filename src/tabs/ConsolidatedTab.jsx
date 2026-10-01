import React, { useMemo } from 'react';

export default function ConsolidatedTab({ orders }) {
  const metrics = useMemo(() => {
    const active = orders.filter((o) => o.status !== 'CANCELLED' && o.status !== 'CALLBACK_REQUIRED');
    const cancelled = orders.filter((o) => o.status === 'CANCELLED');

    const totalSales = active.reduce((sum, o) => sum + (parseFloat(o.totalAmount) || 0), 0);
    const totalAdvance = active.reduce((sum, o) => sum + (parseFloat(o.advancePaid) || 0), 0);
    const totalDiscounts = active.reduce((sum, o) => sum + (parseFloat(o.discount) || 0), 0);

    return {
      totalBookings: orders.length,
      activeSales: totalSales,
      advanceCollected: totalAdvance,
      discountsGiven: totalDiscounts,
      cancelledCount: cancelled.length
    };
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Total Bookings</div>
          <div className="text-xl font-black text-slate-100 font-mono mt-1">{metrics.totalBookings}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Active Sales Booked</div>
          <div className="text-xl font-black text-emerald-400 font-mono mt-1">₹{metrics.activeSales}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Advance Collected</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">₹{metrics.advanceCollected}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Total Discounts</div>
          <div className="text-xl font-black text-purple-400 font-mono mt-1">₹{metrics.discountsGiven}</div>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl">
          <div className="text-xs text-slate-400">Cancelled (Excluded)</div>
          <div className="text-xl font-black text-rose-400 font-mono mt-1">{metrics.cancelledCount}</div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-3.5">Ref</th>
                <th className="p-3.5">Date & Time</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Outlet</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Bill</th>
                <th className="p-3.5 text-right">Advance</th>
                <th className="p-3.5 text-right">Discount</th>
                <th className="p-3.5 text-right">Balance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-800/30">
                  <td className="p-3.5 font-bold text-amber-400">#{o.id}</td>
                  <td className="p-3.5 text-slate-400">{o.targetDate} {o.targetTime}</td>
                  <td className="p-3.5 font-sans font-medium text-slate-200">{o.customerName}</td>
                  <td className="p-3.5 font-sans text-slate-400">{o.kitchenLocation}</td>
                  <td className="p-3.5 font-sans">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      o.status === 'COMPLETED' ? 'bg-teal-500/20 text-teal-400' :
                      o.status === 'CANCELLED' ? 'bg-rose-500/20 text-rose-400' : 'bg-slate-800 text-slate-300'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right text-slate-200">₹{o.totalAmount}</td>
                  <td className="p-3.5 text-right text-emerald-400">₹{o.advancePaid}</td>
                  <td className="p-3.5 text-right text-slate-500">₹{o.discount || 0}</td>
                  <td className="p-3.5 text-right font-black text-amber-400">₹{o.balanceRemaining}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}