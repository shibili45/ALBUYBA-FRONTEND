export function get12HourTimestamp() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = now.getFullYear();
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  return `${day}-${month}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
}

export function formatItemPortion(item, qty) {
  const numericQty = parseFloat(qty) || 0;
  const unit = (item?.unit || 'KG').toUpperCase();
  if (unit === 'KG') {
    return `${numericQty.toFixed(3)} kg`;
  }
  return `${numericQty} ${item?.unit || 'Portion'}`;
}

export function openWhatsAppReceipt(order, settings) {
  const selectedOutlet =
    settings?.kitchenOutlets?.find((out) => out.name === order.kitchenLocation) ||
    settings?.kitchenOutlets?.[0] || {
      name: 'Kitchen Counter',
      address: 'Store Location',
      mapsUrl: 'https://maps.google.com'
    };

  const itemsSummary = (order.items || [])
    .map((it) => `• ${it.itemName}: ${it.finalWeightKg ? `${it.finalWeightKg} kg` : `${it.quantity} portion`}`)
    .join('\n');

  const msg = `*AL-MANDI PRE-BOOKING CONFIRMATION*\n` +
    `Order Ref: #${order.id}\n` +
    `Booked On: ${order.orderTakenAt || 'N/A'}\n` +
    `Customer: ${order.customerName}\n` +
    `Target Slot: ${order.targetDate} at ${order.targetTime}\n` +
    `Fulfillment: ${order.fulfillmentType}\n\n` +
    `*Order Details:*\n${itemsSummary}\n\n` +
    `Total Amount: ₹${order.totalAmount}\n` +
    `Advance Paid: ₹${order.advancePaid}\n` +
    `Balance Due: ₹${order.balanceRemaining}\n\n` +
    (order.fulfillmentType === 'PICKUP'
      ? `*Pickup Kitchen Outlet:*\n${selectedOutlet.name}\n${selectedOutlet.address}\nGoogle Maps: ${selectedOutlet.mapsUrl}\n\n`
      : `*Delivery Destination:*\n${order.deliveryArea} - ${order.deliveryAddress}\n\n`) +
    `Customer Care: ${settings.customerCareContact}\n` +
    `Delivery Helpline: ${settings.deliveryHelpline}\n\n` +
    `Thank you for choosing Al-Mandi! Fresh slow-cooked dum perfection guaranteed.`;

  const encoded = encodeURIComponent(msg);
  const cleanedPhone = (order.customerPhone || '').replace(/\D/g, '');
  const phoneWithCountry = cleanedPhone.length === 10 ? `91${cleanedPhone}` : cleanedPhone;

  window.open(`https://wa.me/${phoneWithCountry}?text=${encoded}`, '_blank');
}