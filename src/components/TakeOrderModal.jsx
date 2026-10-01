import React, { useState, useMemo } from 'react';
import { get12HourTimestamp } from '../utils/formatters';

export default function TakeOrderModal({
  isOpen,
  onClose,
  isCallback,
  menuItems,
  kitchenOutlets,
  existingOrders,
  currentUser,
  onSave
}) {
  const [formData, setFormData] = useState({
    customerPhone: '',
    customerName: '',
    fulfillmentType: 'DELIVERY',
    kitchenLocation: kitchenOutlets[0]?.name || 'Main Kitchen - Indiranagar',
    deliveryArea: '',
    deliveryAddress: '',
    targetDate: new Date().toISOString().split('T')[0],
    targetTime: '13:00',
    orderTakenAt: get12HourTimestamp(),
    advancePaid: '',
    paymentMode: 'UPI (GPay / PhonePe)',
    specialInstructions: '',
    items: [{ menuItemId: menuItems[0]?.id || 'item-1', quantity: 1 }]
  });

  // Repeat Caller Lookup
  const callerHistory = useMemo(() => {
    if (!formData.customerPhone || formData.customerPhone.length < 5) return null;
    const matches = existingOrders.filter((o) => o.customerPhone?.includes(formData.customerPhone.trim()));
    if (matches.length === 0) return null;
    return {
      count: matches.length,
      last: matches[0]
    };
  }, [formData.customerPhone, existingOrders]);

  const calculatedTotal = useMemo(() => {
    return formData.items.reduce((sum, line) => {
      const item = menuItems.find((m) => m.id === line.menuItemId);
      if (!item) return sum;
      return sum + item.pricePerUnit * (parseFloat(line.quantity) || 0);
    }, 0);
  }, [formData.items, menuItems]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const advance = parseFloat(formData.advancePaid) || 0;
    const total = calculatedTotal;
    const balance = Math.max(0, total - advance);

    const payload = {
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      fulfillmentType: formData.fulfillmentType,
      kitchenLocation: formData.kitchenLocation,
      deliveryArea: formData.deliveryArea,
      deliveryAddress: formData.deliveryAddress,
      targetDate: formData.targetDate,
      targetTime: formData.targetTime,
      orderTakenAt: formData.orderTakenAt || get12HourTimestamp(),
      specialInstructions: formData.specialInstructions,
      totalAmount: total,
      advancePaid: advance,
      discount: 0,
      amountPaidAtDispatch: 0,
      balanceRemaining: balance,
      paymentMode: formData.paymentMode,
      paymentCollector: currentUser?.username || 'Order Call Desk',
      status: isCallback ? 'CALLBACK_REQUIRED' : 'BOOKED',
      isCallback: isCallback,
      items: formData.items.map((line) => {
        const itemDef = menuItems.find((m) => m.id === line.menuItemId);
        return {
          menuItemId: line.menuItemId,
          itemName: itemDef?.name || 'Dish',
          pricePerUnit: itemDef?.pricePerUnit || 0,
          quantity: parseFloat(line.quantity) || 1,
          finalWeightKg: itemDef?.unit === 'KG' ? parseFloat(line.quantity) || 1 : null
        };
      })
    };

    onSave(payload);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl p-6 my-8 space-y-5">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <h2 className="text-lg font-black text-amber-400">
            {isCallback ? 'Log Callback Lead' : 'Take Customer Pre-Booking'}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-100 text-xl font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Customer Phone</label>
              <input
                type="text"
                required
                placeholder="e.g. 9845199221"
                value={formData.customerPhone}
                onChange={(e) => {
                  const phone = e.target.value;
                  setFormData((prev) => ({
                    ...prev,
                    customerPhone: phone,
                    ...(callerHistory?.last ? { customerName: callerHistory.last.customerName } : {})
                  }));
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 font-mono focus:outline-none focus:border-amber-500"
              />
              {callerHistory && (
                <div className="mt-1 text-[11px] text-amber-400">
                  ⭐ Repeat Customer ({callerHistory.count} previous bookings)
                </div>
              )}
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Customer Name</label>
              <input
                type="text"
                required
                placeholder="Customer Name"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Fulfilling Kitchen Outlet</label>
              <select
                value={formData.kitchenLocation}
                onChange={(e) => setFormData({ ...formData, kitchenLocation: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
              >
                {kitchenOutlets.map((out) => (
                  <option key={out.id} value={out.name}>{out.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Booking Timestamp (12-Hour)</label>
              <input
                type="text"
                readOnly
                value={formData.orderTakenAt}
                className="w-full bg-slate-950/60 border border-slate-800 rounded-lg px-3 py-2 text-sm text-amber-400 mt-1 font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Fulfillment Type</label>
              <select
                value={formData.fulfillmentType}
                onChange={(e) => setFormData({ ...formData, fulfillmentType: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
              >
                <option value="DELIVERY">Delivery</option>
                <option value="PICKUP">Store Pickup</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Target Date</label>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-400 uppercase">Target Time Slot</label>
              <input
                type="time"
                required
                value={formData.targetTime}
                onChange={(e) => setFormData({ ...formData, targetTime: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {formData.fulfillmentType === 'DELIVERY' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Delivery Area</label>
                <input
                  type="text"
                  placeholder="e.g. Indiranagar, Cherpulassery"
                  value={formData.deliveryArea}
                  onChange={(e) => setFormData({ ...formData, deliveryArea: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase">Address / Maps Link</label>
                <input
                  type="text"
                  placeholder="Street address or Google Maps URL"
                  value={formData.deliveryAddress}
                  onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          {/* Dish Selection */}
          <div className="border border-slate-800 rounded-xl p-4 bg-slate-950/50 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Order Line Items</span>
              <button
                type="button"
                onClick={() =>
                  setFormData({
                    ...formData,
                    items: [...formData.items, { menuItemId: menuItems[0]?.id, quantity: 1 }]
                  })
                }
                className="text-xs text-amber-400 hover:text-amber-300 font-bold"
              >
                + Add Dish
              </button>
            </div>

            {formData.items.map((line, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <select
                  value={line.menuItemId}
                  onChange={(e) => {
                    const next = [...formData.items];
                    next[idx].menuItemId = e.target.value;
                    setFormData({ ...formData, items: next });
                  }}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200"
                >
                  {menuItems.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} (₹{m.pricePerUnit} / {m.unit})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  placeholder="Qty"
                  value={line.quantity}
                  onChange={(e) => {
                    const next = [...formData.items];
                    next[idx].quantity = e.target.value;
                    setFormData({ ...formData, items: next });
                  }}
                  className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 font-mono"
                />

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      const next = formData.items.filter((_, i) => i !== idx);
                      setFormData({ ...formData, items: next });
                    }}
                    className="text-rose-400 hover:text-rose-300 text-sm font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}

            <div className="text-right text-xs text-slate-400 pt-2 border-t border-slate-800">
              Order Total: <strong className="text-amber-400 font-mono text-sm">₹{calculatedTotal}</strong>
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase">Advance Deposit (₹)</label>
            <input
              type="number"
              placeholder="0"
              value={formData.advancePaid}
              onChange={(e) => setFormData({ ...formData, advancePaid: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-200 mt-1 font-mono focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-2 rounded-lg text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20"
            >
              Save Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}