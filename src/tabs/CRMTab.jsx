import React, { useMemo } from 'react';

export default function CRMTab({ orders }) {
  const customerList = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      const phone = o.customerPhone?.trim();
      if (!phone) return;
      if (!map[phone]) {
        map[phone] = {
          phone,
          name: o.customerName,
          totalOrders: 0,
          cancelledOrders: 0,
          totalSpent: 0
        };
      }
      map[phone].totalOrders += 1;
      if (o.status === 'CANCELLED') {
        map[phone].cancelledOrders += 1;
      } else {
        map[phone].totalSpent += parseFloat(o.totalAmount) || 0;
      }
    });
    return Object.values(map);
  }, [orders]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {customerList.map((c) => (
          <div key={c.phone} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-2 shadow-lg">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-100">{c.name}</h4>
                <div className="text-xs text-sky-400 font-mono">📞 {c.phone}</div>
              </div>
              <span className="text-[11px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                {c.totalOrders} {c.totalOrders === 1 ? 'Order' : 'Orders'}
              </span>
            </div>

            <div className="text-xs text-slate-400 flex justify-between pt-2 border-t border-slate-800">
              <span>Lifetime Value: <strong className="text-emerald-400 font-mono">₹{c.totalSpent}</strong></span>
              {c.cancelledOrders > 0 && (
                <span className="text-rose-400 font-medium">({c.cancelledOrders} Cancelled)</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}