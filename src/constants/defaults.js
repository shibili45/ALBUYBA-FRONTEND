export const TODAY_STR = new Date().toISOString().split('T')[0];

export const DEFAULT_USERS = [
  { id: 'u1', username: 'superadmin', password: '123', name: 'Master Admin', role: 'superadmin' },
  { id: 'u2', username: 'admin', password: '123', name: 'Operations Lead', role: 'admin' },
  { id: 'u3', username: 'orders', password: '123', name: 'Zaid (Call Desk)', role: 'orders' },
  { id: 'u4', username: 'kitchen', password: '123', name: 'Ustad Bilal (Kitchen)', role: 'kitchen' },
  { id: 'u5', username: 'delivery', password: '123', name: 'Rider Team', role: 'delivery' }
];

export const DEFAULT_MENU = [
  { id: 'item_mutton', name: 'Mutton Mandi', rate: 1800, unit: 'KG', category: 'Mandi', isMutton: true, isChicken: false, active: true, note: 'Includes 1.000 kg meat + 1.000 kg rice (Serves 4-5)' },
  { id: 'item_chicken', name: 'Chicken Mandi', rate: 700, unit: 'KG', category: 'Mandi', isMutton: false, isChicken: true, active: true, note: 'Includes 1 full chicken + 1.000 kg rice (Serves 4-5)' },
  { id: 'item_rice', name: 'Mandi Rice Only', rate: 200, unit: 'KG', category: 'Rice', isMutton: false, isChicken: false, active: true, note: 'Smoked authentic long-grain mandi rice (Serves 5-6)' },
  { id: 'item_madfoon', name: 'Chicken Madfoon', rate: 500, unit: 'Half', category: 'Madfoon', isMutton: false, isChicken: true, active: true, note: 'Half chicken slow foil-roasted with mandi spices' }
];

export const DEFAULT_SETTINGS = {
  accountName: 'ALBUYBA AUTHENTIC MANDI',
  paymentPhone: '+91 98450 88990',
  upiId: 'mandiorders@okaxis',
  pickupAddress: 'Shop #12, Grand Sultan Complex, Commercial Street, Bengaluru',
  pickupMapLink: 'https://maps.google.com/?q=Commercial+Street+Bengaluru'
};

export const DEFAULT_ORDERS = [
  {
    id: 'ORD-101',
    customerName: 'Tariq Mansoor',
    customerPhone: '9845199221',
    fulfillmentType: 'DELIVERY',
    deliveryArea: 'Indiranagar (100ft Road)',
    deliveryAddress: 'Flat 302, Palm Heights, Near Toit, Indiranagar',
    targetDate: TODAY_STR,
    targetTime: '13:30',
    items: [
      { itemId: 'item_mutton', name: 'Mutton Mandi', bookedKg: 1.000, rate: 1800, subtotal: 1800, actualKg: 1.180, isMutton: true }
    ],
    specialInstructions: 'Crispy skin, mild spice, extra tomato dagus chutney',
    totalAmount: 2124,
    advancePaid: 1000,
    discount: 0,
    amountPaidAtDispatch: 1124,
    balanceRemaining: 0,
    paymentMode: 'UPI (GPay/PhonePe)',
    paymentCollector: 'Imran (Delivery Rider)',
    status: 'READY',
    isCallback: false,
    createdAt: TODAY_STR
  },
  {
    id: 'ORD-102',
    customerName: 'Ayesha Siddiqua',
    customerPhone: '9740011223',
    fulfillmentType: 'PICKUP',
    deliveryArea: 'Store Pickup Counter',
    deliveryAddress: 'Customer Self Pickup at Commercial Street',
    targetDate: TODAY_STR,
    targetTime: '19:45',
    items: [
      { itemId: 'item_chicken', name: 'Chicken Mandi', bookedKg: 2.000, rate: 700, subtotal: 1400, actualKg: null, isChicken: true },
      { itemId: 'item_madfoon', name: 'Chicken Madfoon', bookedKg: 1.000, rate: 500, subtotal: 500, actualKg: null, isChicken: true }
    ],
    specialInstructions: 'Pack piping hot right before customer arrives',
    totalAmount: 1900,
    advancePaid: 1000,
    discount: 100,
    amountPaidAtDispatch: 0,
    balanceRemaining: 800,
    paymentMode: 'Cash at Store',
    paymentCollector: 'Counter Order Desk',
    status: 'IN_KITCHEN',
    isCallback: false,
    createdAt: TODAY_STR
  }
];

export const DEFAULT_EXPENSES = [
  { id: 'exp-1', type: 'PURCHASE', name: 'Fresh Raw Mutton (Halal Baby Goat)', qty: '12.500 kg', amount: 8125, date: TODAY_STR, notes: 'Paid GPay to Al-Barakah Butcher' },
  { id: 'exp-2', type: 'PURCHASE', name: 'Royal Basmati Rice (25kg Bag)', qty: '1 Bag', amount: 2450, date: TODAY_STR, notes: 'Wholesale grain store' },
  { id: 'exp-3', type: 'SALARY', name: 'Chef Bilal', role: 'Head Mandi Ustad', amount: 1200, date: TODAY_STR, notes: 'Daily shift wage (Cash)' }
];
