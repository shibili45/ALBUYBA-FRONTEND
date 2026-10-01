import React from 'react';
import { Calendar, Search, Copy, Phone, MapPin, ExternalLink, Clock } from 'lucide-react';
import { formatKg } from '../utils/formatters';

export default function OrdersTab({
  orders,
  dateFilter,
  setDateFilter,
  searchFilter,
  setSearchFilter,
  statusFilter,
  setStatusFilter,
  fulfillFilter,
  setFulfillFilter,
  onCopyWhatsApp,
  onEditOrder,
  onUpdateStatus
}) {
  const filtered = orders
    .filter(o => !o.isCallback)
    .filter(o => !dateFilter || o.targetDate === dateFilter)
    .filter(o => {
      const s = searchFilter.toLowerCase();
      return o.customerName.toLowerCase().includes(s) ||
        o.customerPhone.includes(s) ||
        (o.deliveryArea && o.deliveryArea.toLowerCase().includes(s));
    })
    .filter(o => statusFilter === 'ALL' || o.status === statusFilter)
    .filter(o => fulfillFilter === 'ALL' || o.fulfillmentType === fulfillFilter);

  return (
    <section className="space-y-5">
      <div className="bg-slate-900 border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 bg-slate-800 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs">
            <Calendar className="w-4 h-4 text-amber-400" />
            <label className="text-neutral-400 font-semibold">Date:</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-white font-bold focus:outline-none"
            />
          </div>
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search name, phone, or neighborhood..."
              className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="BOOKED">Pre-Booked</option>
            <option value="IN_KITCHEN">In Kitchen</option>
            <option value="READY">Ready / Packed</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="COMPLETED">Completed</option>
          </select>
          <select
            value={fulfillFilter}
            onChange={(e) => setFulfillFilter(e.target.value)}
            className="bg-slate-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
          >
            <option value="ALL">All Modes</option>
            <option value="DELIVERY">Delivery Only</option>
            <option value="PICKUP">Pickup Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((order) => (
          <div key={order.id} className="bg-slate-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3 transition">
            <div className="border-b border-neutral-800 pb-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-black text-amber-400">#{order.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {order.status.replace(/_/g, ' ')}
                  </span>
                </div>
                <button
                  onClick={() => onCopyWhatsApp(order)}
                  className="px-2 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  <span>WhatsApp</span>
                </button>
              </div>

              <div className="mt-2 flex items-baseline justify-between">
                <h3 className="font-bold text-white text-base">{order.customerName}</h3>
                <a href={`tel:${order.customerPhone}`} className="text-xs text-amber-400 hover:underline font-mono flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.customerPhone}
                </a>
              </div>

              <div className="mt-2">
                {order.fulfillmentType === 'DELIVERY' ? (
                  <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/40 px-2.5 py-1.5 rounded-xl flex items-center justify-between">
                    <span className="text-xs font-black text-amber-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                      <span>DELIVERY: <span className="text-white uppercase">{order.deliveryArea || 'City Area'}</span></span>
                    </span>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${order.deliveryArea || ''} ${order.deliveryAddress || ''}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] text-amber-400 hover:underline font-bold flex items-center gap-0.5"
                    >
                      Map <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                ) : (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-300">
                    🛍️ STORE PICKUP COUNTER
                  </div>
                )}
              </div>
            </div>

            <div className="bg-slate-800 p-2.5 rounded-xl text-xs flex justify-between items-center text-neutral-300">
              <span className="text-neutral-400 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Slot Time:
              </span>
              <span className="font-bold text-white">{order.targetDate} @ {order.targetTime}</span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="text-[10px] uppercase font-bold text-neutral-400">Items (Weight in KG):</div>
              {order.items.map((i, idx) => (
                <div key={idx} className="flex justify-between items-center text-neutral-200">
                  <span className="flex items-center gap-1.5">
                    <span className="font-bold text-amber-400 font-mono">{formatKg(i.actualKg || i.bookedKg)}</span>
                    <span>{i.name}</span>
                    {i.actualKg && <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1 rounded font-bold">Cut</span>}
                  </span>
                  <span className="font-bold font-mono">₹{i.subtotal}</span>
                </div>
              ))}
              {order.specialInstructions && (
                <p className="text-[11px] text-amber-200/80 italic bg-slate-800 p-2 rounded-lg border border-neutral-800">
                  "{order.specialInstructions}"
                </p>
              )}
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-neutral-800 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-neutral-400">Total:</span>
                <div className="font-black text-white">₹{order.totalAmount}</div>
              </div>
              <div className="text-center">
                <span className="text-[10px] text-emerald-400">Advance:</span>
                <div className="font-bold text-emerald-400">₹{order.advancePaid || 0}</div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-rose-400">Balance:</span>
                <div className="font-black text-rose-400">₹{order.balanceRemaining || 0}</div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
              <button
                onClick={() => onEditOrder(order)}
                className="flex-1 py-1.5 bg-slate-800 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-lg text-xs"
              >
                Edit
              </button>
              {order.status === 'BOOKED' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'IN_KITCHEN')}
                  className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Send to Kitchen
                </button>
              )}
              {order.status === 'IN_KITCHEN' && (
                <button
                  onClick={() => onUpdateStatus(order.id, 'READY')}
                  className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                >
                  Mark Packed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
