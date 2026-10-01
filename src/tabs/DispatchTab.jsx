import React from 'react';

export default function DispatchTab({ orders, onOpenPaymentModal, onUpdateStatus }) {
  const dispatchQueue = orders.filter((o) => ['READY', 'OUT_FOR_DELIVERY'].includes(o.status));

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dispatchQueue.map((order) => (
          <div key={order.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-xl">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-sm font-black text-amber-400">#{order.id}</div>
                <h4 className="font-bold text-slate-100 text-base">{order.customerName}</h4>
                <div className="text-xs text-sky-400 font-mono">📞 {order.customerPhone}</div>
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                {order.status === 'READY' ? 'Packed' : 'Out for Delivery'}
              </span>
            </div>

            <div className="text-xs bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="text-slate-400">Fulfillment: <strong className="text-slate-200">{order.fulfillmentType}</strong></div>
              {order.fulfillmentType === 'DELIVERY' ? (
                <div className="text-slate-300">📍 {order.deliveryArea} {order.deliveryAddress}</div>
              ) : (
                <div className="text-slate-300">🏪 Pickup Outlet: {order.kitchenLocation}</div>
              )}
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
              <div>
                <div className="text-slate-500 text-[10px] uppercase">Balance Due</div>
                <div className="font-mono font-black text-lg text-amber-400">₹{order.balanceRemaining}</div>
              </div>
              <button
                onClick={() => onOpenPaymentModal(order)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs transition-all shadow"
              >
                Record Payment
              </button>
            </div>

            <div className="flex gap-2">
              {order.status === 'READY' && order.fulfillmentType === 'DELIVERY' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'OUT_FOR_DELIVERY')}
                  className="flex-1 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-xl text-xs transition-all"
                >
                  Dispatch Delivery 🚚
                </button>
              )}
              <button
                onClick={() => onUpdateStatus(order.id, 'COMPLETED')}
                className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs transition-all"
              >
                Mark Completed ✓
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}