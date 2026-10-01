import React, { useState, useMemo } from 'react';

export default function KitchenKDSTab({ orders, menuItems, onMarkPacked }) {
  const [kdsDate, setKdsDate] = useState(() => new Date().toISOString().split('T')[0]);

  // Production Targets for All Dishes
  const targets = useMemo(() => {
    const dayOrders = orders.filter(
      (o) => o.targetDate === kdsDate && o.status !== 'CANCELLED' && o.status !== 'CALLBACK_REQUIRED'
    );
    const summary = {};

    dayOrders.forEach((o) => {
      (o.items || []).forEach((line) => {
        const itemDef = menuItems.find((m) => m.id === line.menuItemId);
        const name = line.itemName || itemDef?.name || 'Dish';
        const unit = itemDef?.unit || 'Portion';
        const key = `${name} (${unit})`;

        if (!summary[key]) {
          summary[key] = { count: 0, weightKg: 0, unit };
        }
        if (unit.toUpperCase() === 'KG') {
          summary[key].weightKg += parseFloat(line.finalWeightKg || line.quantity || 0);
        } else {
          summary[key].count += parseFloat(line.quantity || 0);
        }
      });
    });

    return summary;
  }, [orders, kdsDate, menuItems]);

  const activeKitchenQueue = orders.filter((o) => ['BOOKED', 'IN_KITCHEN'].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
            🔥 Production Targets ({kdsDate})
          </h2>
          <input
            type="date"
            value={kdsDate}
            onChange={(e) => setKdsDate(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1 text-xs text-slate-200"
          />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {Object.keys(targets).length === 0 ? (
            <div className="col-span-full text-xs text-slate-500 italic">No bookings scheduled for this date.</div>
          ) : (
            Object.entries(targets).map(([dishName, data]) => (
              <div key={dishName} className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-center">
                <div className="text-[11px] text-slate-400 truncate">{dishName}</div>
                <div className="text-lg font-black text-amber-400 font-mono mt-0.5">
                  {data.unit.toUpperCase() === 'KG' ? `${data.weightKg.toFixed(3)} kg` : `${data.count} units`}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeKitchenQueue.map((order) => (
          <div key={order.id} className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm font-black text-amber-400">#{order.id}</div>
                <h4 className="font-bold text-slate-100 text-base">{order.customerName}</h4>
              </div>
              <span className="text-xs bg-amber-500/20 text-amber-400 font-bold px-2 py-0.5 rounded-full border border-amber-500/30">
                Slot: {order.targetTime}
              </span>
            </div>

            <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <div className="text-[11px] font-bold text-slate-400 uppercase">Preparation Items:</div>
              {(order.items || []).map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-200">
                  <span>{it.itemName}</span>
                  <span className="font-bold text-amber-400">
                    {it.finalWeightKg ? `${it.finalWeightKg} kg` : `${it.quantity} portion`}
                  </span>
                </div>
              ))}
            </div>

            {order.specialInstructions && (
              <div className="text-xs text-amber-300 italic bg-amber-950/20 p-2 rounded-lg border border-amber-800/30">
                "{order.specialInstructions}"
              </div>
            )}

            <button
              onClick={() => onMarkPacked(order.id)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
            >
              ✓ Mark Packed & Ready (Dispatches)
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}