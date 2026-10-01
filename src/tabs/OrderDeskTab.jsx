import React, { useState, useMemo } from 'react';
import { openWhatsAppReceipt } from '../utils/formatters';

export default function OrderDeskTab({
  orders,
  settings,
  onUpdateStatus,
  onInitiateCancel,
  onInitiateDelete
}) {
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (statusFilter !== 'ALL' && o.status !== statusFilter) return false;
      if (fulfillmentFilter !== 'ALL' && o.fulfillmentType !== fulfillmentFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = o.customerName?.toLowerCase().includes(q);
        const matchesPhone = o.customerPhone?.includes(q);
        const matchesId = o.id?.toLowerCase().includes(q);
        if (!matchesName && !matchesPhone && !matchesId) return false;
      }
      return true;
    });
  }, [orders, statusFilter, fulfillmentFilter, searchQuery]);

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="text"
            placeholder="Search customer, phone, order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 w-64 focus:outline-none focus:border-amber-500"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKED">Pre-Booked</option>
            <option value="IN_KITCHEN">In Kitchen</option>
            <option value="READY">Packed & Ready</option>
            <option value="OUT_FOR_DELIVERY">Out For Delivery</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
          <select
            value={fulfillmentFilter}
            onChange={(e) => setFulfillmentFilter(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
          >
            <option value="ALL">All Fulfillment</option>
            <option value="DELIVERY">Delivery</option>
            <option value="PICKUP">Store Pickup</option>
          </select>
        </div>

        <div className="text-xs text-slate-400">
          Showing <strong className="text-slate-200">{filteredOrders.length}</strong> active bookings
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredOrders.map((order) => {
          const isPackedOrBeyond = ['READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'].includes(order.status);
          const isCancellable = ['BOOKED', 'IN_KITCHEN'].includes(order.status);

          return (
            <div
              key={order.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between shadow-xl transition-all ${
                order.status === 'CANCELLED' ? 'border-rose-900/40 opacity-75' : 'border-slate-800 hover:border-amber-500/40'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-black text-amber-400">#{order.id}</span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          order.status === 'BOOKED'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : order.status === 'IN_KITCHEN'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : order.status === 'READY'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : order.status === 'OUT_FOR_DELIVERY'
                            ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                            : order.status === 'COMPLETED'
                            ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-slate-100 mt-1">{order.customerName}</h3>
                    <div className="text-xs text-sky-400 font-mono">📞 {order.customerPhone}</div>
                  </div>

                  <button
                    onClick={() => openWhatsAppReceipt(order, settings)}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-2 rounded-xl text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-600/30 transition-all active:scale-95"
                    title="Send WhatsApp Receipt"
                  >
                    💬 WhatsApp
                  </button>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 text-xs space-y-1 my-3">
                  <div className="text-slate-400 flex justify-between">
                    <span>Outlet:</span>
                    <span className="text-amber-400 font-semibold">{order.kitchenLocation}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Target Slot:</span>
                    <span className="text-slate-200 font-semibold">{order.targetDate} @ {order.targetTime}</span>
                  </div>
                  <div className="text-slate-400 flex justify-between">
                    <span>Fulfillment:</span>
                    <span className="text-slate-200 font-semibold uppercase">{order.fulfillmentType}</span>
                  </div>
                  {order.fulfillmentType === 'DELIVERY' && (
                    <div className="text-slate-400 truncate pt-1 border-t border-slate-800">
                      📍 {order.deliveryArea} {order.deliveryAddress && `- ${order.deliveryAddress}`}
                    </div>
                  )}
                </div>

                <div className="space-y-1 my-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Items:</div>
                  {(order.items || []).map((it, idx) => (
                    <div key={idx} className="flex justify-between text-xs text-slate-300">
                      <span>
                        {it.finalWeightKg ? `${it.finalWeightKg} kg` : `${it.quantity} portion`} {it.itemName}
                      </span>
                      <span className="font-mono text-slate-400">
                        ₹{it.pricePerUnit * (it.finalWeightKg || it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-800 pt-3 flex justify-between items-end text-xs">
                  <div>
                    <div className="text-slate-500">Total: ₹{order.totalAmount}</div>
                    <div className="text-emerald-400">Advance: ₹{order.advancePaid}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase">Balance Due</div>
                    <div className="text-base font-black font-mono text-amber-400">₹{order.balanceRemaining}</div>
                  </div>
                </div>

                {order.status === 'CANCELLED' && (
                  <div className="mt-3 bg-rose-950/30 border border-rose-800/40 p-2.5 rounded-lg text-[11px] text-rose-300 space-y-1">
                    <div className="font-bold">Cancellation Settlement:</div>
                    <div className="flex justify-between">
                      <span>Refund Returned: ₹{order.refundAmount || 0}</span>
                      <span className="text-amber-400 font-bold">Retained Fee: ₹{order.cancellationFee || 0}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-800 pt-3 mt-4 flex items-center justify-between gap-2">
                {isCancellable ? (
                  <button
                    onClick={() => onInitiateCancel(order)}
                    className="text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-all"
                  >
                    Cancel Order
                  </button>
                ) : (
                  <span className="text-xs text-slate-600 flex items-center gap-1">🔒 Locked</span>
                )}

                {!isPackedOrBeyond && (
                  <button
                    onClick={() => onInitiateDelete(order.id)}
                    className="text-xs text-slate-500 hover:text-rose-400 p-1.5 rounded transition-all"
                    title="Delete Order"
                  >
                    🗑️
                  </button>
                )}

                {order.status === 'BOOKED' && (
                  <button
                    onClick={() => onUpdateStatus(order.id, 'IN_KITCHEN')}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3 py-1.5 rounded-lg shadow transition-all ml-auto"
                  >
                    Send to Kitchen →
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}