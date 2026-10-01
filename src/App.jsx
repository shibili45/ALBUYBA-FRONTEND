import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Utensils, Phone, PhoneCall, PhoneForwarded, Flame, Truck, Calendar,
  Search, Plus, PlusCircle, Users, CheckCircle, Clock, AlertTriangle,
  MapPin, ExternalLink, FileText, Wallet, DollarSign, TrendingUp, Settings,
  LogOut, Copy, Printer, Download, Scale, Receipt, Shield, ChevronDown,
  X, Check, Lock, User, RefreshCw, Sparkles, Navigation, Edit3, Trash2,
  Ban, Building, Zap, Droplets, Image, Share2
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const TODAY_STR = new Date().toISOString().split('T')[0];

const formatTime12Hour = (dateObj = new Date()) => {
  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  const hoursStr = hours < 10 ? '0' + hours : hours;
  return `${hoursStr}:${minutesStr} ${ampm}`;
};

const formatFullDate12Hour = (dateObj = new Date()) => {
  const yyyy = dateObj.getFullYear();
  const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
  const dd = String(dateObj.getDate()).padStart(2, '0');
  return `${dd}-${mm}-${yyyy} ${formatTime12Hour(dateObj)}`;
};

const DEFAULT_KITCHEN_LOCATIONS = [
  {
    id: 'loc_comm',
    name: 'Commercial Street Central Kitchen',
    address: 'Shop #12, Grand Sultan Complex, Commercial Street, Bengaluru',
    mapLink: 'https://maps.google.com/?q=Commercial+Street+Bengaluru'
  },
  {
    id: 'loc_indira',
    name: 'Indiranagar Cloud Kitchen',
    address: '100ft Road, Near Toit, Indiranagar, Bengaluru',
    mapLink: 'https://maps.google.com/?q=Indiranagar+100ft+Road+Bengaluru'
  }
];

const DEFAULT_USERS = [
  { id: 'u1', username: 'superadmin', password: '123', name: 'Master Admin', role: 'superadmin' },
  { id: 'u2', username: 'admin', password: '123', name: 'Operations Lead', role: 'admin' },
  { id: 'u3', username: 'orders', password: '123', name: 'Zaid (Call Desk)', role: 'orders' },
  { id: 'u4', username: 'kitchen', password: '123', name: 'Ustad Bilal (Kitchen)', role: 'kitchen' },
  { id: 'u5', username: 'delivery', password: '123', name: 'Rider Team', role: 'delivery' }
];

const DEFAULT_MENU = [
  { id: 'item_mutton', name: 'Mutton Mandi', rate: 1800, unit: 'KG', category: 'Mandi', isMutton: true, isChicken: false, active: true, note: 'Includes 1.000 kg meat + 1.000 kg rice (Serves 4-5)' },
  { id: 'item_chicken', name: 'Chicken Mandi', rate: 700, unit: 'Full', category: 'Mandi', isMutton: false, isChicken: true, active: true, note: 'Includes 1 full chicken + 1.000 kg rice (Serves 4-5)' },
  { id: 'item_rice', name: 'Mandi Rice Only', rate: 200, unit: 'KG', category: 'Rice', isMutton: false, isChicken: false, active: true, note: 'Smoked authentic long-grain mandi rice (Serves 5-6)' },
  { id: 'item_madfoon', name: 'Chicken Madfoon', rate: 500, unit: 'Half', category: 'Madfoon', isMutton: false, isChicken: true, active: true, note: 'Half chicken slow foil-roasted with mandi spices' }
];

const DEFAULT_SETTINGS = {
  accountName: 'ALBUYBA AUTHENTIC MANDI',
  paymentPhone: '+91 98450 88990',
  upiId: 'mandiorders@okaxis',
  customerCarePhone: '+91 98450 11223',
  deliveryTeamPhone: '+91 98450 44556',
  pickupAddress: 'Shop #12, Grand Sultan Complex, Commercial Street, Bengaluru',
  pickupMapLink: 'https://maps.google.com/?q=Commercial+Street+Bengaluru',
  kitchenLocations: DEFAULT_KITCHEN_LOCATIONS
};

const DEFAULT_ORDERS = [
  {
    id: 'ORD-101',
    customerName: 'Tariq Mansoor',
    customerPhone: '9845199221',
    fulfillmentType: 'DELIVERY',
    kitchenLocation: 'Commercial Street Central Kitchen',
    deliveryArea: 'Indiranagar (100ft Road)',
    deliveryAddress: 'Flat 302, Palm Heights, Near Toit, Indiranagar',
    targetDate: TODAY_STR,
    targetTime: '13:30',
    orderTakenAt: formatFullDate12Hour(),
    items: [
      { itemId: 'item_mutton', name: 'Mutton Mandi', bookedKg: 1.000, rate: 1800, subtotal: 1800, actualKg: 1.180, isMutton: true, unit: 'KG' }
    ],
    specialInstructions: 'Crispy skin, mild spice, extra tomato dagus chutney',
    totalAmount: 2124,
    advancePaid: 1000,
    discount: 0,
    amountPaidAtDispatch: 1124,
    balanceRemaining: 0,
    refundAmount: 0,
    cancellationFee: 0,
    cancellationReason: '',
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
    kitchenLocation: 'Commercial Street Central Kitchen',
    deliveryArea: 'Store Pickup Counter',
    deliveryAddress: 'Customer Self Pickup at Commercial Street',
    targetDate: TODAY_STR,
    targetTime: '19:45',
    orderTakenAt: formatFullDate12Hour(),
    items: [
      { itemId: 'item_chicken', name: 'Chicken Mandi', bookedKg: 2, rate: 700, subtotal: 1400, actualKg: null, isChicken: true, unit: 'Full' },
      { itemId: 'item_madfoon', name: 'Chicken Madfoon', bookedKg: 1, rate: 500, subtotal: 500, actualKg: null, isChicken: true, unit: 'Half' }
    ],
    specialInstructions: 'Pack piping hot right before customer arrives',
    totalAmount: 1900,
    advancePaid: 1000,
    discount: 100,
    amountPaidAtDispatch: 0,
    balanceRemaining: 800,
    refundAmount: 0,
    cancellationFee: 0,
    cancellationReason: '',
    paymentMode: 'Cash at Store',
    paymentCollector: 'Counter Order Desk',
    status: 'IN_KITCHEN',
    isCallback: false,
    createdAt: TODAY_STR
  }
];

const DEFAULT_EXPENSES = [
  { id: 'exp-1', type: 'PURCHASE', name: 'Fresh Raw Mutton (Halal Baby Goat)', qty: '12.500 kg', amount: 8125, date: TODAY_STR, notes: 'Paid GPay to Al-Barakah Butcher' },
  { id: 'exp-2', type: 'PURCHASE', name: 'Royal Basmati Rice (25kg Bag)', qty: '1 Bag', amount: 2450, date: TODAY_STR, notes: 'Wholesale grain store' },
  { id: 'exp-3', type: 'SALARY', name: 'Chef Bilal', role: 'Head Mandi Ustad', amount: 1200, date: TODAY_STR, notes: 'Daily shift wage (Cash)' },
  { id: 'exp-4', type: 'SHOP', name: 'Commercial Electricity Bill (BESCOM)', qty: 'Monthly', amount: 3450, date: TODAY_STR, notes: 'Online NetBanking' },
  { id: 'exp-5', type: 'SHOP', name: 'Potable Water Tanker (1000L)', qty: '1 Tanker', amount: 750, date: TODAY_STR, notes: 'Cash paid to driver' }
];

const formatKg = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.000 kg';
  return `${parseFloat(val).toFixed(3)} kg`;
};

// Universal portion formatter: checks if item is KG or Full/Half/Portion
const formatPortionDisplay = (itemOrOrderItem, qty) => {
  const isMutton = itemOrOrderItem.isMutton;
  const unit = itemOrOrderItem.unit || (isMutton ? 'KG' : 'Portion');
  if (unit === 'KG' || isMutton) {
    return formatKg(qty);
  }
  const cleanQty = parseFloat(qty);
  return `${cleanQty} ${unit}${cleanQty > 1 && !['KG', 'Half'].includes(unit) ? 's' : ''}`;
};

const formatCurrency = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

const sanitizePhone = (phoneStr) => {
  if (!phoneStr) return '';
  return phoneStr.toString().replace(/\D/g, '').slice(-10);
};

const ROLE_TABS = {
  superadmin: ['orders', 'callbacks', 'customers', 'kitchen', 'dispatch', 'consolidated', 'menu', 'expenses', 'insights', 'users'],
  admin: ['orders', 'callbacks', 'customers', 'kitchen', 'dispatch', 'consolidated', 'menu', 'expenses', 'insights'],
  orders: ['orders', 'callbacks', 'customers', 'consolidated'],
  kitchen: ['kitchen', 'dispatch'],
  delivery: ['dispatch']
};

const TAB_META = {
  orders: { label: 'Order Desk', icon: PhoneCall },
  callbacks: { label: 'Callbacks', icon: PhoneForwarded },
  customers: { label: 'CRM & Callers', icon: Users },
  kitchen: { label: 'Kitchen KDS', icon: Flame },
  dispatch: { label: 'Dispatch & Delivery', icon: Truck },
  consolidated: { label: 'Consolidated', icon: Calendar },
  menu: { label: 'Menu Catalog', icon: Utensils },
  expenses: { label: 'Expenses & Wages', icon: Wallet },
  insights: { label: 'Financial P&L', icon: TrendingUp },
  users: { label: 'Staff Accounts', icon: Shield }
};

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = sessionStorage.getItem('mandi_active_user');
    return saved ? JSON.parse(saved) : DEFAULT_USERS[0];
  });
  const [authToken, setAuthToken] = useState(() => {
    return sessionStorage.getItem('mandi_auth_token') || '';
  });
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [users, setUsers] = useState(() => JSON.parse(localStorage.getItem('mandi_users')) || DEFAULT_USERS);
  const [menuItems, setMenuItems] = useState(() => JSON.parse(localStorage.getItem('mandi_menu')) || DEFAULT_MENU);
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('mandi_settings');
    if (!saved) return DEFAULT_SETTINGS;
    try {
      const parsed = JSON.parse(saved);
      return {
        ...DEFAULT_SETTINGS,
        ...parsed,
        kitchenLocations: parsed.kitchenLocations || DEFAULT_KITCHEN_LOCATIONS
      };
    } catch {
      return DEFAULT_SETTINGS;
    }
  });
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem('mandi_orders')) || DEFAULT_ORDERS);
  const [expenses, setExpenses] = useState(() => JSON.parse(localStorage.getItem('mandi_expenses')) || DEFAULT_EXPENSES);

  const [activeTab, setActiveTab] = useState('orders');
  const [toastMessage, setToastMessage] = useState(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  // Authenticated fetch helper
  const authFetch = useCallback((url, options = {}) => {
    const headers = {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    };
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
    return fetch(url, { ...options, headers });
  }, [authToken]);

  // Filters
  const [ordersDate, setOrdersDate] = useState(TODAY_STR);
  const [ordersSearch, setOrdersSearch] = useState('');
  const [ordersStatus, setOrdersStatus] = useState('ALL');
  const [ordersFulfill, setOrdersFulfill] = useState('ALL');

  const [callbacksDate, setCallbacksDate] = useState(TODAY_STR);
  const [kitchenDate, setKitchenDate] = useState(TODAY_STR);
  const [dispatchDate, setDispatchDate] = useState(TODAY_STR);
  const [expensesDate, setExpensesDate] = useState(TODAY_STR);

  const [rangeFromDate, setRangeFromDate] = useState(TODAY_STR);
  const [rangeToDate, setRangeToDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });

  const [insightsFromDate, setInsightsFromDate] = useState(TODAY_STR);
  const [insightsToDate, setInsightsToDate] = useState(TODAY_STR);

  const [crmSearch, setCrmSearch] = useState('');
  const [crmFilter, setCrmFilter] = useState('ALL');

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [isCallbackMode, setIsCallbackMode] = useState(false);

  // Cancellation & Settlement Modal
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancelRefund, setCancelRefund] = useState('');
  const [cancelFee, setCancelFee] = useState('');
  const [cancelReason, setCancelReason] = useState('');

  const [orderToDelete, setOrderToDelete] = useState(null);

  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);

  const [isWeightModalOpen, setIsWeightModalOpen] = useState(false);
  const [weightOrder, setWeightOrder] = useState(null);
  const [weightInput, setWeightInput] = useState('');
  const [recalcBill, setRecalcBill] = useState(true);

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [auditOrder, setAuditOrder] = useState(null);
  const [auditDiscount, setAuditDiscount] = useState('');
  const [auditPaidNow, setAuditPaidNow] = useState('');
  const [auditMethod, setAuditMethod] = useState('Cash');
  const [auditCollector, setAuditCollector] = useState('');
  const [auditStatus, setAuditStatus] = useState('READY');

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedCustomerPhone, setSelectedCustomerPhone] = useState(null);

  const showToast = useCallback((msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }, []);

  const fetchRemoteData = useCallback(async () => {
    try {
      const [menuRes, ordersRes, expRes, setRes] = await Promise.all([
        authFetch(`${API_BASE_URL}/menu`),
        authFetch(`${API_BASE_URL}/orders`),
        authFetch(`${API_BASE_URL}/expenses`),
        authFetch(`${API_BASE_URL}/settings`)
      ]);

      if (menuRes.ok && ordersRes.ok) {
        const m = await menuRes.json();
        const o = await ordersRes.json();
        const e = expRes.ok ? await expRes.json() : [];
        const s = setRes.ok ? await setRes.json() : {};

        setMenuItems(m);
        setOrders(o);
        if (e.length) setExpenses(e);
        if (Object.keys(s).length) {
          let parsedLocations = DEFAULT_KITCHEN_LOCATIONS;
          if (s.kitchenLocations) {
            try {
              parsedLocations = typeof s.kitchenLocations === 'string' ? JSON.parse(s.kitchenLocations) : s.kitchenLocations;
            } catch {}
          }
          setSettings(prev => ({
            ...prev,
            ...s,
            kitchenLocations: parsedLocations
          }));
        }
        setIsBackendConnected(true);
      }
    } catch {
      setIsBackendConnected(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchRemoteData();
  }, [fetchRemoteData]);

  useEffect(() => {
    localStorage.setItem('mandi_users', JSON.stringify(users));
    localStorage.setItem('mandi_menu', JSON.stringify(menuItems));
    localStorage.setItem('mandi_settings', JSON.stringify(settings));
    localStorage.setItem('mandi_orders', JSON.stringify(orders));
    localStorage.setItem('mandi_expenses', JSON.stringify(expenses));
  }, [users, menuItems, settings, orders, expenses]);

  // CRM Profiles with accurate status visibility
  const customerProfiles = useMemo(() => {
    const map = new Map();
    orders.forEach(order => {
      const clean = sanitizePhone(order.customerPhone);
      if (!clean) return;
      if (!map.has(clean)) {
        map.set(clean, {
          phone: clean,
          displayPhone: order.customerPhone,
          name: order.customerName,
          orders: [],
          totalSpend: 0,
          cancelledCount: 0,
          areas: new Set(),
          lastOrder: null
        });
      }
      const prof = map.get(clean);
      prof.orders.push(order);
      if (order.status === 'CANCELLED') {
        prof.cancelledCount += 1;
      } else if (!order.isCallback) {
        prof.totalSpend += (order.totalAmount || 0);
      }
      if (order.deliveryArea) prof.areas.add(order.deliveryArea);
      if (!prof.lastOrder || order.targetDate >= prof.lastOrder.targetDate) {
        prof.lastOrder = order;
        prof.name = order.customerName;
      }
    });
    return Array.from(map.values());
  }, [orders]);

  const generateWhatsAppMessage = (order) => {
    const itemsList = order.items.map(i => {
      const portionText = formatPortionDisplay(i, i.actualKg || i.bookedKg);
      return `• *${i.name}* [${portionText}] - ₹${i.subtotal}`;
    }).join('\n');

    const matchedKitchen = (settings.kitchenLocations || []).find(k => k.name === order.kitchenLocation) 
      || (settings.kitchenLocations && settings.kitchenLocations[0])
      || { address: settings.pickupAddress, mapLink: settings.pickupMapLink, name: 'Main Kitchen' };

    const isDelivery = order.fulfillmentType === 'DELIVERY';
    const fulfillmentText = isDelivery
      ? `🛵 *DELIVERY PLACE:* ${order.deliveryArea || 'City Area'}\n📍 *Address:* ${order.deliveryAddress || 'Will share location pin'}`
      : `🛍️ *TAKEAWAY STORE PICKUP:* *${matchedKitchen.name}*\n📍 *Address:* ${matchedKitchen.address}\n🗺️ *Maps Link:* ${matchedKitchen.mapLink}`;

    const orderTimeDisplay = order.orderTakenAt || formatFullDate12Hour();

    return `👑 *ALBUYBA AUTHENTIC MANDI PRE-ORDER CONFIRMATION* 👑
━━━━━━━━━━━━━━━━━━━━
Order Number: *#${order.id}*
👤 *Customer:* ${order.customerName}
📞 *Phone:* ${order.customerPhone}
🕒 *Order Booked At:* ${orderTimeDisplay}
📅 *Scheduled Slot:* ${order.targetDate} at ${order.targetTime}
🏪 *Preparing Outlet:* ${order.kitchenLocation || matchedKitchen.name}

${fulfillmentText}

🍗 *ORDER PORTIONS:*
${itemsList}

💰 *PAYMENT BREAKDOWN:*
• Total Amount: *₹${order.totalAmount}*
${order.discount ? `• Concession Discount: *-₹${order.discount}*\n` : ''}• Advance Token Paid: *₹${order.advancePaid || 0}*
• Remaining Balance Due: *₹${order.balanceRemaining}*

🏦 *PAYMENT / UPI DETAILS:*
• Payee Name: *${settings.accountName}*
• UPI / GPay Number: *${settings.paymentPhone}*
• UPI VPA: *${settings.upiId}*

☎️ *CONTACT & SUPPORT HELPLINE:*
• Customer Care Helpline: *${settings.customerCarePhone || '+91 98450 11223'}*
• Delivery Rider Support: *${settings.deliveryTeamPhone || '+91 98450 44556'}*

📝 *Cooking Instructions:* ${order.specialInstructions || 'Authentic traditional dum preparation'}
━━━━━━━━━━━━━━━━━━━━
_Thank you for ordering with ALBUYBA AUTHENTIC MANDI! Authentic taste, smoked to perfection._`;
  };

  const copyWhatsApp = (order) => {
    const text = generateWhatsAppMessage(order);
    navigator.clipboard.writeText(text);
    showToast(`WhatsApp receipt for #${order.id} copied!`);
  };

  const renderStatusBadge = (status) => {
    switch (status) {
      case 'BOOKED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-sky-500/20 text-sky-300 border border-sky-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span> Pre-Booked
          </span>
        );
      case 'IN_KITCHEN':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span> In Kitchen
          </span>
        );
      case 'READY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <CheckCircle className="w-3 h-3 text-emerald-400" /> Packed & Ready
          </span>
        );
      case 'OUT_FOR_DELIVERY':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/40 flex items-center gap-1">
            <Truck className="w-3 h-3 text-purple-400" /> Out For Delivery
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-teal-500/20 text-teal-300 border border-teal-500/40 flex items-center gap-1">
            <Check className="w-3 h-3 text-teal-400" /> Completed
          </span>
        );
      case 'CANCELLED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <Ban className="w-3 h-3 text-rose-400" /> Cancelled
          </span>
        );
      case 'CALLBACK_REQUIRED':
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500/20 text-orange-300 border border-orange-500/40 flex items-center gap-1">
            <PhoneForwarded className="w-3 h-3 text-orange-400" /> Callback Lead
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-neutral-300 border border-neutral-700">
            {status}
          </span>
        );
    }
  };

  const handleDeleteOrderConfirm = async () => {
    if (!orderToDelete) return;
    const targetId = orderToDelete.id;
    try {
      await authFetch(`${API_BASE_URL}/orders/${targetId}`, { method: 'DELETE' });
    } catch {}
    setOrders(prev => prev.filter(o => o.id !== targetId));
    setOrderToDelete(null);
    showToast(`Order #${targetId} deleted successfully!`);
  };

  // Open Cancel & Settle Modal
  const initiateCancelOrder = (order) => {
    setOrderToCancel(order);
    const advance = order.advancePaid || 0;
    setCancelRefund(advance.toString());
    setCancelFee('0');
    setCancelReason('Customer requested cancellation');
  };

  const handleCancelOrderSubmit = async (e) => {
    e.preventDefault();
    if (!orderToCancel) return;
    const targetId = orderToCancel.id;
    const refund = parseFloat(cancelRefund) || 0;
    const fee = parseFloat(cancelFee) || 0;

    try {
      await authFetch(`${API_BASE_URL}/orders/${targetId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({
          refundAmount: refund,
          cancellationFee: fee,
          cancellationReason: cancelReason.trim()
        })
      });
    } catch {}

    setOrders(prev => prev.map(o => o.id === targetId ? {
      ...o,
      status: 'CANCELLED',
      balanceRemaining: 0,
      refundAmount: refund,
      cancellationFee: fee,
      cancellationReason: cancelReason.trim()
    } : o));

    setOrderToCancel(null);
    showToast(`Order #${targetId} cancelled. Retained fee: ₹${fee}, Refunded: ₹${refund}`);
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: loginUsername, password: loginPassword })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentUser(data.user);
        setAuthToken(data.token);
        sessionStorage.setItem('mandi_active_user', JSON.stringify(data.user));
        sessionStorage.setItem('mandi_auth_token', data.token);
        showToast(`Welcome back, ${data.user.name}!`);
        return;
      } else {
        const err = await res.json();
        showToast(err.detail || 'Invalid username or password.');
        return;
      }
    } catch {}

    const matched = users.find(u => u.username.toLowerCase() === loginUsername.trim().toLowerCase() && u.password === loginPassword.trim());
    if (matched) {
      setCurrentUser(matched);
      sessionStorage.setItem('mandi_active_user', JSON.stringify(matched));
      showToast(`Welcome back, ${matched.name}!`);
    } else {
      showToast('Invalid credentials. Check username or password.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('mandi_active_user');
    sessionStorage.removeItem('mandi_auth_token');
    setCurrentUser(null);
    setAuthToken('');
  };

  const permittedTabs = currentUser ? (ROLE_TABS[currentUser.role] || ['orders']) : [];

  return (
    <div className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 antialiased">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-amber-500/50 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle className="w-5 h-5 text-amber-400" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Login Screen */}
      {!currentUser && (
        <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="text-center mb-6">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 mb-3 shadow-lg shadow-amber-500/20">
                <Flame className="w-8 h-8 stroke-[2.5]" />
              </div>
              <h1 className="text-2xl font-black tracking-wider text-amber-400 font-serif">ALBUYBA AUTHENTIC MANDI </h1>
              <p className="text-xs text-neutral-400 mt-1">Pre-Booking Operations & KDS Desk</p>
            </div>
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    placeholder="Enter username"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-800 border border-neutral-700 rounded-xl text-sm focus:outline-none focus:border-amber-500"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3" />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl shadow-lg transition"
              >
                Sign In to OpsDesk
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Main Top Header */}
      <header className="bg-slate-900 border-b border-neutral-800 sticky top-0 z-40 backdrop-blur shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20">
              <Utensils className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg font-black tracking-wider text-amber-400 font-serif">ALBUYBA AUTHENTIC MANDI</span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">OPSDESK PRO</span>
                {isBackendConnected && (
                  <span className="text-[9px] uppercase font-bold tracking-wider bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/40">API LIVE</span>
                )}
              </div>
              <p className="text-[11px] text-neutral-400">Authentic Mutton & Chicken Pre-Booking Operations</p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2">
            {currentUser?.role !== 'delivery' && currentUser?.role !== 'kitchen' && (
              <>
                <button
                  onClick={() => { setEditingOrder(null); setIsCallbackMode(false); setIsOrderModalOpen(true); }}
                  className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 rounded-xl shadow-lg flex items-center gap-1.5 transition"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>+ Take Order</span>
                </button>
                <button
                  onClick={() => { setEditingOrder(null); setIsCallbackMode(true); setIsOrderModalOpen(true); }}
                  className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 rounded-xl flex items-center gap-1.5"
                >
                  <PhoneForwarded className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Callback Lead</span>
                </button>
              </>
            )}
            {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
              <>
                <button
                  onClick={() => { setEditingMenuItem(null); setIsMenuModalOpen(true); }}
                  className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">+ Add Menu Item</span>
                </button>
                <button
                  onClick={() => setIsSettingsModalOpen(true)}
                  className="p-2 text-neutral-400 hover:text-amber-400 bg-slate-800 rounded-xl border border-neutral-700"
                  title="Payment & Kitchen Location Settings"
                >
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-neutral-800">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-white">{currentUser?.name}</div>
                <div className="text-[10px] text-amber-400 font-semibold capitalize">{currentUser?.role}</div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 bg-slate-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-xl border border-neutral-700"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Ribbon */}
        <nav className="bg-slate-900/90 border-t border-neutral-800 px-4 sm:px-6 overflow-x-auto">
          <div className="max-w-7xl mx-auto flex items-center space-x-1 py-1.5 text-xs">
            {permittedTabs.map((key) => {
              const meta = TAB_META[key];
              const Icon = meta.icon;
              const isActive = activeTab === key;
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'text-neutral-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{meta.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">

        {/* TAB 1: ORDER DESK */}
        {activeTab === 'orders' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-lg">
              <div className="flex flex-wrap items-center gap-3 flex-1">
                <div className="flex items-center gap-1.5 bg-slate-800 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <label className="text-neutral-400 font-semibold">Date:</label>
                  <input
                    type="date"
                    value={ordersDate}
                    onChange={(e) => setOrdersDate(e.target.value)}
                    className="bg-transparent text-white font-bold focus:outline-none"
                  />
                </div>
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={ordersSearch}
                    onChange={(e) => setOrdersSearch(e.target.value)}
                    placeholder="Search name, phone, or neighborhood..."
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-800 border border-neutral-700 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={ordersStatus}
                  onChange={(e) => setOrdersStatus(e.target.value)}
                  className="bg-slate-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="BOOKED">Pre-Booked</option>
                  <option value="IN_KITCHEN">In Kitchen</option>
                  <option value="READY">Ready / Packed</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
                <select
                  value={ordersFulfill}
                  onChange={(e) => setOrdersFulfill(e.target.value)}
                  className="bg-slate-800 border border-neutral-700 rounded-xl px-2.5 py-1.5 text-xs text-neutral-300 focus:outline-none"
                >
                  <option value="ALL">All Modes</option>
                  <option value="DELIVERY">Delivery Only</option>
                  <option value="PICKUP">Pickup Only</option>
                </select>
              </div>
            </div>

            {/* Orders Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders
                .filter(o => !o.isCallback)
                .filter(o => !ordersDate || o.targetDate === ordersDate)
                .filter(o => {
                  const s = ordersSearch.toLowerCase();
                  return o.customerName.toLowerCase().includes(s) ||
                    o.customerPhone.includes(s) ||
                    (o.deliveryArea && o.deliveryArea.toLowerCase().includes(s));
                })
                .filter(o => ordersStatus === 'ALL' || o.status === ordersStatus)
                .filter(o => ordersFulfill === 'ALL' || o.fulfillmentType === ordersFulfill)
                .map((order) => {
                  const isPackedOrBeyond = ['READY', 'OUT_FOR_DELIVERY', 'COMPLETED', 'CANCELLED'].includes(order.status);
                  const isCanDelete = ['BOOKED', 'IN_KITCHEN'].includes(order.status);
                  const isCanCancel = ['BOOKED', 'IN_KITCHEN'].includes(order.status);

                  return (
                  <div key={order.id} className="bg-slate-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col justify-between space-y-3 transition">
                    <div className="border-b border-neutral-800 pb-2.5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-amber-400 font-mono">#{order.id}</span>
                          {renderStatusBadge(order.status)}
                        </div>
                        <button
                          onClick={() => copyWhatsApp(order)}
                          className="px-2.5 py-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg text-[11px] font-bold flex items-center gap-1"
                        >
                          <Copy className="w-3 h-3" />
                          <span>WhatsApp</span>
                        </button>
                      </div>

                      <div className="mt-2 flex items-baseline justify-between">
                        <div>
                          <h3 className="font-bold text-white text-base">{order.customerName}</h3>
                          {order.orderTakenAt && (
                            <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-amber-400" /> Booked: {order.orderTakenAt}
                            </div>
                          )}
                        </div>
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
                          <div className="bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-xl text-xs font-bold text-emerald-300 flex justify-between items-center">
                            <span>🛍️ PICKUP: {order.kitchenLocation || 'Main Kitchen'}</span>
                            <span className="text-[10px] text-emerald-400">Takeaway</span>
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

                    {/* Portions with correct units */}
                    <div className="space-y-1 text-xs">
                      <div className="text-[10px] uppercase font-bold text-neutral-400">Items Booked:</div>
                      {order.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between items-center text-neutral-200">
                          <span className="flex items-center gap-1.5">
                            <span className="font-bold text-amber-400 font-mono">
                              {formatPortionDisplay(i, i.actualKg || i.bookedKg)}
                            </span>
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

                    {/* Financial Summary */}
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

                    {/* Cancellation details banner if cancelled */}
                    {order.status === 'CANCELLED' && (
                      <div className="bg-rose-950/40 border border-rose-500/40 p-2 rounded-xl text-xs space-y-0.5">
                        <div className="text-rose-400 font-bold flex justify-between">
                          <span>Advance: ₹{order.advancePaid || 0}</span>
                          <span>Refunded: ₹{order.refundAmount || 0}</span>
                        </div>
                        <div className="text-emerald-400 font-black flex justify-between text-[11px]">
                          <span>Retained Fee (Profit):</span>
                          <span>+₹{order.cancellationFee || 0}</span>
                        </div>
                        {order.cancellationReason && (
                          <div className="text-[10px] text-neutral-400 truncate">Reason: {order.cancellationReason}</div>
                        )}
                      </div>
                    )}

                    {/* Card Bottom Actions */}
                    <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center gap-2">
                      {isPackedOrBeyond ? (
                        <div
                          title="Order is packed, finalized, or cancelled. Editing and cancellation are locked."
                          className="flex-1 py-1.5 px-3 bg-slate-800/60 border border-neutral-700/50 text-neutral-500 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 cursor-not-allowed select-none"
                        >
                          <Lock className="w-3.5 h-3.5 text-neutral-500" />
                          <span>Locked</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => { setEditingOrder(order); setIsCallbackMode(false); setIsOrderModalOpen(true); }}
                          className="flex-1 py-1.5 bg-slate-800 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-lg text-xs transition"
                        >
                          Edit
                        </button>
                      )}

                      {order.status === 'BOOKED' && (
                        <button
                          onClick={async () => {
                            try {
                              await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=IN_KITCHEN`, { method: 'PATCH' });
                            } catch {}
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'IN_KITCHEN' } : o));
                            showToast(`Order #${order.id} sent to Kitchen`);
                          }}
                          className="flex-1 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Send to Kitchen
                        </button>
                      )}

                      {order.status === 'IN_KITCHEN' && (
                        <button
                          onClick={async () => {
                            try {
                              await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=READY`, { method: 'PATCH' });
                            } catch {}
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'READY' } : o));
                            showToast(`Order #${order.id} marked as Packed & Ready`);
                          }}
                          className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs"
                        >
                          Mark Packed
                        </button>
                      )}

                      {isCanCancel && (
                        <button
                          onClick={() => initiateCancelOrder(order)}
                          title="Cancel order and settle advance refund/charges"
                          className="py-1.5 px-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg text-xs font-bold transition flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}

                      {isCanDelete && (
                        <button
                          onClick={() => setOrderToDelete(order)}
                          title="Delete Order (Available before Packed & Ready)"
                          className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-lg border border-neutral-700 transition"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* TAB 2: CALLBACK PIPELINE */}
        {activeTab === 'callbacks' && (
          <section className="space-y-5">
            <div className="bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-700/30 p-5 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Callback & Inquiry Pipeline</span>
                </div>
                <h2 className="text-xl font-black text-white mt-1">Pending Customer Callbacks</h2>
                <p className="text-xs text-neutral-400 mt-0.5">Call back interested customers, finalize quantities, and confirm into active kitchen queue.</p>
              </div>
              <button
                onClick={() => { setEditingOrder(null); setIsCallbackMode(true); setIsOrderModalOpen(true); }}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <Plus className="w-4 h-4" /> Add Callback Lead
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {orders.filter(o => o.isCallback).map(lead => (
                <div key={lead.id} className="bg-slate-900 border border-amber-500/40 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <span className="text-xs font-black text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">CALLBACK REQUIRED</span>
                      <span className="text-xs text-neutral-400 font-mono">{lead.targetDate}</span>
                    </div>
                    <h3 className="font-bold text-white text-base mt-2">{lead.customerName}</h3>
                    <div className="flex items-center gap-2 mt-2">
                      <a href={`tel:${lead.customerPhone}`} className="px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-lg text-xs font-bold flex items-center gap-1">
                        <Phone className="w-3 h-3" /> Call {lead.customerPhone}
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-neutral-300">
                      <span className="text-neutral-400">Tentative Area:</span> <strong className="text-amber-300">{lead.deliveryArea || 'Not specified'}</strong>
                    </div>
                    <div className="mt-3 bg-slate-800 p-2 rounded-xl text-xs space-y-1">
                      {lead.items.map((i, idx) => (
                        <div key={idx} className="flex justify-between text-neutral-200">
                          <span>{formatPortionDisplay(i, i.bookedKg)} {i.name}</span>
                          <span className="font-mono text-neutral-400">~₹{i.subtotal}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-neutral-800 flex items-center gap-2">
                    <button
                      onClick={() => { setEditingOrder(lead); setIsCallbackMode(true); setIsOrderModalOpen(true); }}
                      className="flex-1 py-1.5 bg-slate-800 hover:bg-neutral-800 text-neutral-300 font-semibold rounded-lg text-xs"
                    >
                      Edit Lead
                    </button>
                    <button
                      onClick={async () => {
                        try {
                          await authFetch(`${API_BASE_URL}/orders/${lead.id}/status?status=BOOKED`, { method: 'PATCH' });
                        } catch {}
                        setOrders(orders.map(o => o.id === lead.id ? { ...o, isCallback: false, status: 'BOOKED' } : o));
                        showToast(`Lead #${lead.id} confirmed into active orders!`);
                      }}
                      className="flex-1 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs flex items-center justify-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Confirm Order
                    </button>
                    <button
                      onClick={() => setOrderToDelete(lead)}
                      title="Delete Callback Lead"
                      className="p-1.5 bg-slate-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-lg border border-neutral-700 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: CRM CALLER INTELLIGENCE (With Clear Status Display) */}
        {activeTab === 'customers' && (
          <section className="space-y-5">
            <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-300">Repeat Caller Intelligence</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Customer History & Loyalty Directory</h2>
                <p className="text-xs text-neutral-400">Track caller preferences, past orders, and status records (including cancellations and refunds).</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-700 text-center">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Patrons</span>
                  <div className="text-base font-black text-amber-400">{customerProfiles.length}</div>
                </div>
                <div className="bg-slate-800 px-3 py-1.5 rounded-xl border border-neutral-700 text-center">
                  <span className="text-[10px] text-neutral-400 font-bold uppercase">Repeat Rate</span>
                  <div className="text-base font-black text-emerald-400">
                    {customerProfiles.length > 0
                      ? `${Math.round((customerProfiles.filter(p => p.orders.length > 1).length / customerProfiles.length) * 100)}%`
                      : '0%'}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-900 border border-neutral-800 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="relative flex-1 min-w-[240px]">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  placeholder="Search caller phone number, name, or area..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <select
                value={crmFilter}
                onChange={(e) => setCrmFilter(e.target.value)}
                className="bg-slate-800 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-neutral-300 focus:outline-none"
              >
                <option value="ALL">All Loyalty Tiers</option>
                <option value="VIP">👑 VIP Champions (5+ orders)</option>
                <option value="REGULAR">⭐ Regular Patrons (2-4 orders)</option>
                <option value="NEW">🌱 First-Time Callers (1 order)</option>
                <option value="CANCELLED">⚠️ With Cancelled Orders</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {customerProfiles
                .filter(p => {
                  const s = crmSearch.toLowerCase();
                  return p.name.toLowerCase().includes(s) || p.phone.includes(s) || Array.from(p.areas).some(a => a.toLowerCase().includes(s));
                })
                .filter(p => {
                  if (crmFilter === 'VIP') return p.orders.length >= 5;
                  if (crmFilter === 'REGULAR') return p.orders.length >= 2 && p.orders.length < 5;
                  if (crmFilter === 'NEW') return p.orders.length === 1;
                  if (crmFilter === 'CANCELLED') return p.cancelledCount > 0;
                  return true;
                })
                .map(prof => (
                  <div key={prof.phone} className="bg-slate-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
                    <div>
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-bold text-white text-base">{prof.name}</h3>
                          <a href={`tel:${prof.phone}`} className="text-xs text-amber-400 font-mono flex items-center gap-1 mt-0.5">
                            <Phone className="w-3 h-3" /> +91 {prof.phone}
                          </a>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                          prof.orders.length >= 5 ? 'bg-amber-400 text-slate-950' : (prof.orders.length >= 2 ? 'bg-amber-500/20 text-amber-300' : 'bg-slate-800 text-neutral-400')
                        }`}>
                          {prof.orders.length >= 5 ? '👑 VIP Champion' : (prof.orders.length >= 2 ? '⭐ Regular' : '🌱 First-Timer')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 bg-slate-800 p-2.5 rounded-xl border border-neutral-800 text-xs mt-3">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Total Bookings</span>
                          <div className="font-black text-white mt-0.5">
                            {prof.orders.length} Order{prof.orders.length > 1 ? 's' : ''}
                            {prof.cancelledCount > 0 && (
                              <span className="text-rose-400 text-[10px] ml-1">({prof.cancelledCount} Cancelled)</span>
                            )}
                          </div>
                        </div>
                        <div>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase">Lifetime Spend</span>
                          <div className="font-black text-amber-400 mt-0.5">₹{prof.totalSpend.toLocaleString('en-IN')}</div>
                        </div>
                      </div>

                      <div className="mt-3 text-[11px] text-neutral-300 space-y-1">
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          <span className="truncate">Fav Areas: <strong className="text-neutral-200">{Array.from(prof.areas).join(', ') || 'Pickup'}</strong></span>
                        </div>
                        <div className="flex items-center gap-1.5 text-neutral-400">
                          <Clock className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Last Order: <strong className="text-neutral-200">{prof.lastOrder ? prof.lastOrder.targetDate : '-'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-neutral-800 flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCustomerPhone(prof.phone)}
                        className="flex-1 py-1.5 bg-slate-800 hover:bg-neutral-800 text-amber-400 border border-neutral-700 rounded-xl text-xs font-bold"
                      >
                        View Timeline ({prof.orders.length})
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* TAB 4: KITCHEN KDS (Accurate Units for All Dishes) */}
        {activeTab === 'kitchen' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl space-y-4 shadow-lg">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></span>
                    <span className="text-xs font-bold uppercase tracking-wider text-orange-400">Kitchen Display System (KDS)</span>
                  </div>
                  <h2 className="text-xl font-bold text-white mt-1">Authentic Dum Preparation & Butcher Weight</h2>
                  <p className="text-xs text-neutral-400">Targets dynamically show in exact dish units (KG, Full, Half, Portions).</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-800 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <label className="text-neutral-400 font-semibold">Kitchen Day:</label>
                  <input
                    type="date"
                    value={kitchenDate}
                    onChange={(e) => setKitchenDate(e.target.value)}
                    className="bg-transparent text-white font-bold focus:outline-none"
                  />
                </div>
              </div>

              {/* Targets for all menu items with correct units */}
              <div className="pt-2 border-t border-neutral-800">
                <div className="text-[11px] uppercase font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Preparation Targets for {kitchenDate} (All Menu Dishes)</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 overflow-x-auto pb-1">
                  {menuItems.map(item => {
                    const activeOrders = orders.filter(o => 
                      !o.isCallback && 
                      o.targetDate === kitchenDate && 
                      ['BOOKED', 'IN_KITCHEN', 'READY'].includes(o.status)
                    );

                    let totalPortions = 0;
                    activeOrders.forEach(o => {
                      o.items.forEach(oi => {
                        if (oi.itemId === item.id || oi.name.toLowerCase() === item.name.toLowerCase()) {
                          totalPortions += (oi.actualKg || oi.bookedKg || 0);
                        }
                      });
                    });

                    return (
                      <div key={item.id} className="bg-slate-800/90 border border-neutral-700/80 rounded-xl p-2.5">
                        <div className="text-[10px] text-neutral-400 truncate font-semibold">{item.name}</div>
                        <div className="text-sm font-black text-white mt-0.5">
                          {formatPortionDisplay(item, totalPortions)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders
                .filter(o => !o.isCallback && o.targetDate === kitchenDate && (o.status === 'BOOKED' || o.status === 'IN_KITCHEN'))
                .map(order => {
                  const muttonItem = order.items.find(i => i.isMutton);
                  return (
                    <div key={order.id} className="bg-slate-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl space-y-4 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                          <div>
                            <span className="text-base font-black text-amber-400">#{order.id}</span>
                            <div className="text-xs font-bold text-white mt-0.5">{order.customerName}</div>
                            {order.kitchenLocation && (
                              <div className="text-[10px] text-neutral-400 flex items-center gap-1 mt-0.5">
                                <Building className="w-3 h-3 text-amber-400" /> {order.kitchenLocation}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-orange-500/20 text-orange-400">
                              {order.status.replace(/_/g, ' ')}
                            </span>
                            <div className="text-xs font-black text-amber-300 mt-1">{order.targetTime}</div>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2">
                          <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">Portions to Prepare:</div>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="bg-slate-800 p-2.5 rounded-xl border border-neutral-700/60 flex items-center justify-between">
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 bg-amber-500 text-slate-950 rounded text-xs font-black">
                                    {formatPortionDisplay(item, item.actualKg || item.bookedKg)}
                                  </span>
                                  <span>{item.name}</span>
                                </div>
                                {item.isMutton && (
                                  <div className="text-[11px] text-amber-300 mt-1 flex items-center gap-1">
                                    <Scale className="w-3 h-3" />
                                    Butcher Cut: <strong className="text-white">{item.actualKg ? formatKg(item.actualKg) : `Target ${formatKg(item.bookedKg)}`}</strong>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>

                        {order.specialInstructions && (
                          <div className="mt-3 bg-amber-500/10 border-l-4 border-amber-500 p-2.5 rounded-r-xl">
                            <div className="text-[10px] uppercase font-bold text-amber-400">Chef Instructions:</div>
                            <p className="text-xs text-amber-100 mt-0.5">{order.specialInstructions}</p>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-neutral-800 space-y-2">
                        {muttonItem && (
                          <button
                            onClick={() => {
                              setWeightOrder(order);
                              setWeightInput(muttonItem.actualKg ? muttonItem.actualKg.toString() : muttonItem.bookedKg.toString());
                              setIsWeightModalOpen(true);
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-neutral-800 border border-amber-500/40 rounded-xl text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5"
                          >
                            <Scale className="w-3.5 h-3.5 text-amber-400" />
                            <span>{muttonItem.actualKg ? `Adjust Weight (${formatKg(muttonItem.actualKg)})` : 'Input Butcher Weight in KG'}</span>
                          </button>
                        )}
                        <div className="flex items-center gap-2">
                          {order.status === 'BOOKED' && (
                            <button
                              onClick={async () => {
                                try {
                                  await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=IN_KITCHEN`, { method: 'PATCH' });
                                } catch {}
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'IN_KITCHEN' } : o));
                                showToast(`Order #${order.id} cooking started`);
                              }}
                              className="flex-1 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
                            >
                              Start Cooking
                            </button>
                          )}
                          {order.status === 'IN_KITCHEN' && (
                            <button
                              onClick={async () => {
                                try {
                                  await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=READY`, { method: 'PATCH' });
                                } catch {}
                                setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'READY' } : o));
                                showToast(`Order #${order.id} marked as packed & ready`);
                              }}
                              className="flex-1 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs"
                            >
                              Mark Packed & Ready
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          </section>
        )}

        {/* TAB 5: DISPATCH & PAYMENT AUDITING */}
        {activeTab === 'dispatch' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">Dispatch & Delivery Desk</span>
                </div>
                <h2 className="text-xl font-bold text-white mt-1">Delivery Routing & Payment Reconciliation</h2>
                <p className="text-xs text-neutral-400">Track delivery neighborhoods, 1-click maps navigation, and exact payment collector logging.</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 bg-slate-800 border border-neutral-700 px-3 py-1.5 rounded-xl text-xs">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  <label className="text-neutral-400 font-semibold">Date:</label>
                  <input
                    type="date"
                    value={dispatchDate}
                    onChange={(e) => setDispatchDate(e.target.value)}
                    className="bg-transparent text-white font-bold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {orders
                .filter(o => !o.isCallback && o.targetDate === dispatchDate && (o.status === 'READY' || o.status === 'OUT_FOR_DELIVERY' || o.status === 'COMPLETED'))
                .map(order => (
                  <div key={order.id} className="bg-slate-900 border border-neutral-800 rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
                        <div>
                          <span className="text-base font-black text-amber-400 font-mono">#{order.id}</span>
                          <div className="text-xs font-bold text-white mt-0.5">{order.customerName}</div>
                        </div>
                        <div className="text-right">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400">
                            {order.status.replace(/_/g, ' ')}
                          </span>
                          <div className="text-xs font-bold text-neutral-400 mt-1">{order.targetTime}</div>
                        </div>
                      </div>

                      <div className="mt-3">
                        {order.fulfillmentType === 'DELIVERY' ? (
                          <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-2 border-amber-500/40 p-2.5 rounded-xl shadow-inner">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                                <Navigation className="w-3 h-3" /> DELIVERY DESTINATION:
                              </span>
                              <a
                                href={`https://maps.google.com/?q=${encodeURIComponent(`${order.deliveryArea || ''} ${order.deliveryAddress || ''}`)}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-amber-500 text-slate-950 text-[10px] font-black rounded flex items-center gap-0.5 shadow"
                              >
                                Maps <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </div>
                            <div className="text-sm font-black text-white uppercase tracking-wide">{order.deliveryArea || 'Area Pending'}</div>
                            <p className="text-[11px] text-neutral-300 mt-0.5 line-clamp-1">{order.deliveryAddress || 'No detailed address provided'}</p>
                          </div>
                        ) : (
                          <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-xs flex justify-between items-center">
                            <div>
                              <span className="font-bold text-emerald-300">🛍️ Pickup: {order.kitchenLocation || 'Main Kitchen'}</span>
                            </div>
                            <button
                              onClick={() => {
                                const kitchen = (settings.kitchenLocations || []).find(k => k.name === order.kitchenLocation) || settings.kitchenLocations?.[0];
                                if (kitchen?.mapLink) window.open(kitchen.mapLink, '_blank');
                              }}
                              className="text-[10px] text-emerald-400 underline font-bold"
                            >
                              Kitchen Map
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="mt-3 bg-slate-950 p-3 rounded-xl border border-neutral-800 space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Total Order Bill:</span>
                          <span className="font-bold text-white">₹{order.totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Discount:</span>
                          <span className="font-bold text-indigo-400">-₹{order.discount || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-neutral-400">Advance Paid:</span>
                          <span className="font-bold text-emerald-400">₹{order.advancePaid || 0}</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-neutral-800 font-black">
                          <span className={order.balanceRemaining > 0 ? 'text-rose-400' : 'text-emerald-400'}>Balance to Collect:</span>
                          <span className={order.balanceRemaining > 0 ? 'text-rose-400' : 'text-emerald-400'}>₹{order.balanceRemaining}</span>
                        </div>
                        <div className="text-[10px] text-neutral-400 pt-1 border-t border-neutral-800/60 flex justify-between">
                          <span>Collector: <strong className="text-neutral-200">{order.paymentCollector || 'Not recorded'}</strong></span>
                          <span>Method: <strong className="text-neutral-200">{order.paymentMode || 'Cash'}</strong></span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-neutral-800 space-y-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setAuditOrder(order);
                            setAuditDiscount(order.discount ? order.discount.toString() : '0');
                            // Auto-populate balance amount directly in Amount Paid Now
                            setAuditPaidNow(order.balanceRemaining ? order.balanceRemaining.toString() : '0');
                            setAuditMethod(order.paymentMode || 'Cash');
                            setAuditCollector(order.paymentCollector || currentUser?.name || '');
                            setAuditStatus(order.status);
                            setIsAuditModalOpen(true);
                          }}
                          className="flex-1 py-2 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow"
                        >
                          <Receipt className="w-3.5 h-3.5" />
                          <span>Record Payment & Audit</span>
                        </button>
                        <button onClick={() => copyWhatsApp(order)} className="p-2 bg-slate-800 hover:bg-neutral-800 text-emerald-400 border border-neutral-700 rounded-xl">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      {order.status === 'READY' && (
                        <button
                          onClick={async () => {
                            try {
                              await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=OUT_FOR_DELIVERY`, { method: 'PATCH' });
                            } catch {}
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'OUT_FOR_DELIVERY' } : o));
                            showToast(`Order #${order.id} is Out for Delivery!`);
                          }}
                          className="w-full py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl text-xs"
                        >
                          Send Out with Rider
                        </button>
                      )}
                      {order.status === 'OUT_FOR_DELIVERY' && (
                        <button
                          onClick={async () => {
                            try {
                              await authFetch(`${API_BASE_URL}/orders/${order.id}/status?status=COMPLETED`, { method: 'PATCH' });
                            } catch {}
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: 'COMPLETED', balanceRemaining: 0 } : o));
                            showToast(`Order #${order.id} delivered and completed!`);
                          }}
                          className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-xl text-xs"
                        >
                          Confirm Handover & Completed
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* TAB 6: CONSOLIDATED ORDERS (With Advance Paid and Discounts) */}
        {activeTab === 'consolidated' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Consolidated Orders & Meat Demand Forecast</h2>
                <p className="text-xs text-neutral-400">Filter by custom Date Range. Advance deposits and concessions are explicitly tallied.</p>
              </div>

              <div className="bg-slate-800 p-3 rounded-xl border border-neutral-700 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-neutral-400 font-semibold">From:</span>
                    <input
                      type="date"
                      value={rangeFromDate}
                      onChange={(e) => setRangeFromDate(e.target.value)}
                      className="bg-slate-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-white font-bold text-xs"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="text-neutral-400 font-semibold">To:</span>
                    <input
                      type="date"
                      value={rangeToDate}
                      onChange={(e) => setRangeToDate(e.target.value)}
                      className="bg-slate-900 border border-neutral-700 rounded-lg px-2.5 py-1 text-white font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {(() => {
                const inRange = orders.filter(o => !o.isCallback && o.targetDate >= rangeFromDate && o.targetDate <= rangeToDate);
                const activeInDemand = inRange.filter(o => o.status !== 'CANCELLED');
                const cancelledInDemand = inRange.filter(o => o.status === 'CANCELLED');

                const totalMutton = activeInDemand.reduce((acc, o) => {
                  const m = o.items.find(i => i.isMutton);
                  return acc + (m ? (m.actualKg || m.bookedKg) : 0);
                }, 0);

                const totalChicken = activeInDemand.reduce((acc, o) => {
                  const c = o.items.filter(i => i.isChicken);
                  return acc + c.reduce((sum, item) => sum + (item.bookedKg || 1), 0);
                }, 0);

                const activeSales = activeInDemand.reduce((sum, o) => sum + (o.totalAmount - (o.discount || 0)), 0);
                const activeAdvances = activeInDemand.reduce((sum, o) => sum + (o.advancePaid || 0), 0);
                const totalDiscounts = activeInDemand.reduce((sum, o) => sum + (o.discount || 0), 0);

                return (
                  <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                    <div className="bg-slate-800 p-3 rounded-xl border border-neutral-700">
                      <span className="text-[10px] uppercase font-bold text-neutral-400">Active Bookings</span>
                      <div className="text-lg font-black text-white mt-0.5">{activeInDemand.length}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-amber-500/30">
                      <span className="text-[10px] uppercase font-bold text-amber-400">Mutton (KG)</span>
                      <div className="text-lg font-black text-amber-400 mt-0.5">{formatKg(totalMutton)}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-orange-500/30">
                      <span className="text-[10px] uppercase font-bold text-orange-400">Chicken Units</span>
                      <div className="text-lg font-black text-orange-400 mt-0.5">{totalChicken}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-emerald-500/30">
                      <span className="text-[10px] uppercase font-bold text-emerald-400">Advance Paid</span>
                      <div className="text-lg font-black text-emerald-400 mt-0.5">{formatCurrency(activeAdvances)}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-indigo-500/30">
                      <span className="text-[10px] uppercase font-bold text-indigo-400">Discounts Given</span>
                      <div className="text-lg font-black text-indigo-400 mt-0.5">{formatCurrency(totalDiscounts)}</div>
                    </div>
                    <div className="bg-slate-800 p-3 rounded-xl border border-rose-500/30">
                      <span className="text-[10px] uppercase font-bold text-rose-400">Cancelled Orders</span>
                      <div className="text-lg font-black text-rose-400 mt-0.5">{cancelledInDemand.length}</div>
                    </div>
                  </div>
                );
              })()}
            </div>

            <div className="bg-slate-900 rounded-2xl border border-neutral-800 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-slate-800 text-neutral-400 uppercase font-semibold border-b border-neutral-800">
                    <tr>
                      <th className="px-3.5 py-3">Order & Date</th>
                      <th className="px-3.5 py-3">Customer & Phone</th>
                      <th className="px-3.5 py-3">Kitchen & Area</th>
                      <th className="px-3.5 py-3">Portions</th>
                      <th className="px-3.5 py-3">Total Bill</th>
                      <th className="px-3.5 py-3 text-emerald-400">Advance</th>
                      <th className="px-3.5 py-3 text-indigo-400">Discount</th>
                      <th className="px-3.5 py-3 text-rose-400">Balance</th>
                      <th className="px-3.5 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {orders
                      .filter(o => !o.isCallback && o.targetDate >= rangeFromDate && o.targetDate <= rangeToDate)
                      .map(order => (
                        <tr key={order.id} className={`hover:bg-slate-800/40 ${order.status === 'CANCELLED' ? 'opacity-60 line-through' : ''}`}>
                          <td className="px-3.5 py-3 font-bold text-amber-400 font-mono">
                            #{order.id}
                            <div className="text-[10px] text-neutral-400">{order.targetDate}</div>
                          </td>
                          <td className="px-3.5 py-3">
                            <div className="font-bold text-white">{order.customerName}</div>
                            <div className="text-[10px] text-neutral-400 font-mono">{order.customerPhone}</div>
                          </td>
                          <td className="px-3.5 py-3">
                            <div className="font-semibold text-white">{order.targetTime}</div>
                            <div className="text-[10px] uppercase text-amber-300">{order.deliveryArea || order.fulfillmentType}</div>
                            {order.kitchenLocation && <div className="text-[9px] text-neutral-400">{order.kitchenLocation}</div>}
                          </td>
                          <td className="px-3.5 py-3">
                            {order.items.map(i => `${formatPortionDisplay(i, i.actualKg || i.bookedKg)} ${i.name}`).join(', ')}
                          </td>
                          <td className="px-3.5 py-3 font-bold text-white">₹{order.totalAmount}</td>
                          <td className="px-3.5 py-3 font-bold text-emerald-400">₹{order.advancePaid || 0}</td>
                          <td className="px-3.5 py-3 font-bold text-indigo-400">₹{order.discount || 0}</td>
                          <td className="px-3.5 py-3 font-bold text-rose-400">₹{order.balanceRemaining}</td>
                          <td className="px-3.5 py-3">
                            {renderStatusBadge(order.status)}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        )}

        {/* TAB 7: MENU CATALOG */}
        {activeTab === 'menu' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-xl">
              <div>
                <h2 className="text-xl font-bold text-white">Menu Catalog & Dish Rates</h2>
                <p className="text-xs text-neutral-400">Configure dishes, per-KG rates, or portion units (Full, Half, Piece).</p>
              </div>
              <button
                onClick={() => { setEditingMenuItem(null); setIsMenuModalOpen(true); }}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg"
              >
                <PlusCircle className="w-4 h-4" /> Add New Dish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-slate-900 border border-neutral-800 hover:border-amber-500/50 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-800 border border-neutral-700 text-amber-400">{item.category || 'Mandi'}</span>
                        <h3 className="font-bold text-white text-base mt-1.5">{item.name}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-black text-amber-400">₹{item.rate}</div>
                        <div className="text-[10px] text-neutral-400 font-semibold">per {item.unit}</div>
                      </div>
                    </div>
                    <p className="text-xs text-neutral-400 mt-2 bg-slate-800 p-2.5 rounded-xl border border-neutral-800">
                      {item.note || 'Authentic traditional recipe'}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-[11px]">
                      {item.isMutton && <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold">Mutton (Adjustable KG)</span>}
                      {item.isChicken && <span className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 font-bold">Chicken Dish ({item.unit})</span>}
                    </div>
                  </div>
                  <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                    <button
                      onClick={async () => {
                        const updated = !item.active;
                        try {
                          await authFetch(`${API_BASE_URL}/menu/${item.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ ...item, active: updated })
                          });
                        } catch {}
                        setMenuItems(menuItems.map(i => i.id === item.id ? { ...i, active: updated } : i));
                        showToast(`Updated availability for ${item.name}`);
                      }}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-neutral-700 text-neutral-300"
                    >
                      {item.active ? 'Disable' : 'Enable'}
                    </button>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => { setEditingMenuItem(item); setIsMenuModalOpen(true); }}
                        className="p-1.5 bg-slate-800 text-amber-400 border border-neutral-700 rounded-lg"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={async () => {
                          try {
                            await authFetch(`${API_BASE_URL}/menu/${item.id}`, { method: 'DELETE' });
                          } catch {}
                          setMenuItems(menuItems.filter(i => i.id !== item.id));
                          showToast(`Removed ${item.name} from menu`);
                        }}
                        className="p-1.5 bg-slate-800 text-neutral-400 hover:text-rose-400 border border-neutral-700 rounded-lg"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 8: EXPENSES, WAGES & SHOP UTILITIES */}
        {activeTab === 'expenses' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4 shadow-lg">
              <div>
                <h2 className="text-xl font-bold text-white">Kitchen Purchases, Staff Wages & Shop Expenses</h2>
                <p className="text-xs text-neutral-400">Record daily carcass purchases, staff wages, and recurring shop utilities (water, electricity, gas, rent).</p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={expensesDate}
                  onChange={(e) => setExpensesDate(e.target.value)}
                  className="bg-slate-800 border border-neutral-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <button
                  onClick={() => setIsExpenseModalOpen(true)}
                  className="px-3.5 py-1.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow"
                >
                  <PlusCircle className="w-3.5 h-3.5" /> Record Expense
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* 1. Raw Purchases */}
              <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Utensils className="w-4 h-4 text-amber-400" /> Raw Meat & Rice Purchases
                  </h3>
                  <span className="text-xs font-black text-amber-400">
                    {formatCurrency(expenses.filter(e => e.type === 'PURCHASE' && (!expensesDate || e.date === expensesDate)).reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'PURCHASE' && (!expensesDate || e.date === expensesDate)).map(exp => (
                    <div key={exp.id} className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{exp.name}</div>
                        <div className="text-[10px] text-neutral-400">{exp.qty || ''} • {exp.notes || exp.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-amber-400">₹{exp.amount}</span>
                        <button
                          onClick={async () => {
                            try {
                              await authFetch(`${API_BASE_URL}/expenses/${exp.id}`, { method: 'DELETE' });
                            } catch {}
                            setExpenses(expenses.filter(e => e.id !== exp.id));
                          }}
                          className="text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. Employee Wages */}
              <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-indigo-400" /> Employee Shift Wages
                  </h3>
                  <span className="text-xs font-black text-indigo-400">
                    {formatCurrency(expenses.filter(e => e.type === 'SALARY' && (!expensesDate || e.date === expensesDate)).reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'SALARY' && (!expensesDate || e.date === expensesDate)).map(exp => (
                    <div key={exp.id} className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{exp.name}</div>
                        <div className="text-[10px] text-neutral-400">{exp.role || 'Staff'} • {exp.notes || exp.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-indigo-400">₹{exp.amount}</span>
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`${API_BASE_URL}/expenses/${exp.id}`, { method: 'DELETE' });
                            } catch {}
                            setExpenses(expenses.filter(e => e.id !== exp.id));
                          }}
                          className="text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. Shop Utilities */}
              <div className="bg-slate-900 border border-neutral-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <h3 className="font-bold text-white text-sm flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-emerald-400" /> Shop Overheads & Utilities
                  </h3>
                  <span className="text-xs font-black text-emerald-400">
                    {formatCurrency(expenses.filter(e => e.type === 'SHOP' && (!expensesDate || e.date === expensesDate)).reduce((sum, e) => sum + e.amount, 0))}
                  </span>
                </div>
                <div className="space-y-2">
                  {expenses.filter(e => e.type === 'SHOP' && (!expensesDate || e.date === expensesDate)).map(exp => (
                    <div key={exp.id} className="bg-slate-800 p-2.5 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-white">{exp.name}</div>
                        <div className="text-[10px] text-neutral-400">{exp.notes || exp.date}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-emerald-400">₹{exp.amount}</span>
                        <button
                          onClick={async () => {
                            try {
                              await fetch(`${API_BASE_URL}/expenses/${exp.id}`, { method: 'DELETE' });
                            } catch {}
                            setExpenses(expenses.filter(e => e.id !== exp.id));
                          }}
                          className="text-neutral-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* TAB 9: FINANCIAL P&L INSIGHTS (With Discounts & Retained Cancellation Fees) */}
        {activeTab === 'insights' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl space-y-4 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-white">Financial Insights & Profit/Loss Overview</h2>
                  <p className="text-xs text-neutral-400">Reconciles active sales, collections, discounts, retained cancellation income, and net margins.</p>
                </div>
                <div className="flex items-center gap-2 bg-slate-800 p-2 rounded-xl text-xs">
                  <span>From:</span>
                  <input type="date" value={insightsFromDate} onChange={(e) => setInsightsFromDate(e.target.value)} className="bg-slate-900 border border-neutral-700 rounded px-2 py-1 text-white" />
                  <span>To:</span>
                  <input type="date" value={insightsToDate} onChange={(e) => setInsightsToDate(e.target.value)} className="bg-slate-900 border border-neutral-700 rounded px-2 py-1 text-white" />
                </div>
              </div>

              {(() => {
                const inRange = orders.filter(o => !o.isCallback && o.targetDate >= insightsFromDate && o.targetDate <= insightsToDate);
                const activeOrders = inRange.filter(o => o.status !== 'CANCELLED');
                const cancelledOrders = inRange.filter(o => o.status === 'CANCELLED');
                const filteredExp = expenses.filter(e => e.date >= insightsFromDate && e.date <= insightsToDate);

                const totalSales = activeOrders.reduce((sum, o) => sum + o.totalAmount, 0);
                const totalCollected = activeOrders.reduce((sum, o) => sum + (o.advancePaid || 0) + (o.amountPaidAtDispatch || 0), 0);
                const totalPending = activeOrders.reduce((sum, o) => sum + o.balanceRemaining, 0);
                const totalDiscounts = activeOrders.reduce((sum, o) => sum + (o.discount || 0), 0);
                
                // Cancellation revenue retained as store charge
                const totalCancellationChargesRetained = cancelledOrders.reduce((sum, o) => sum + (o.cancellationFee || 0), 0);
                const totalRefundsIssued = cancelledOrders.reduce((sum, o) => sum + (o.refundAmount || 0), 0);
                
                const purchasesTotal = filteredExp.filter(e => e.type === 'PURCHASE').reduce((sum, e) => sum + e.amount, 0);
                const wagesTotal = filteredExp.filter(e => e.type === 'SALARY').reduce((sum, e) => sum + e.amount, 0);
                const shopTotal = filteredExp.filter(e => e.type === 'SHOP').reduce((sum, e) => sum + e.amount, 0);
                const totalExpenses = purchasesTotal + wagesTotal + shopTotal;

                // Profit includes actual order collections PLUS retained cancellation charges minus total expenses
                const netProfit = (totalCollected + totalCancellationChargesRetained) - totalExpenses;

                return (
                  <>
                    <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-neutral-700">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Active Booked Sales</span>
                        <div className="text-lg font-black text-amber-400 mt-0.5">{formatCurrency(totalSales)}</div>
                      </div>
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-emerald-500/30">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Order Collections</span>
                        <div className="text-lg font-black text-emerald-400 mt-0.5">{formatCurrency(totalCollected)}</div>
                      </div>
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-indigo-500/30">
                        <span className="text-[10px] uppercase font-bold text-indigo-400">Discounts Granted</span>
                        <div className="text-lg font-black text-indigo-400 mt-0.5">{formatCurrency(totalDiscounts)}</div>
                      </div>
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-rose-500/30">
                        <span className="text-[10px] uppercase font-bold text-rose-400">Pending Receivables</span>
                        <div className="text-lg font-black text-rose-400 mt-0.5">{formatCurrency(totalPending)}</div>
                      </div>
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-emerald-500/40">
                        <span className="text-[10px] uppercase font-bold text-emerald-400">Retained Cancel Fees</span>
                        <div className="text-lg font-black text-emerald-300 mt-0.5">+{formatCurrency(totalCancellationChargesRetained)}</div>
                      </div>
                      <div className="bg-slate-800 p-3.5 rounded-xl border border-neutral-700">
                        <span className="text-[10px] uppercase font-bold text-neutral-400">Total Expenses</span>
                        <div className="text-lg font-black text-white mt-0.5">{formatCurrency(totalExpenses)}</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs bg-slate-800/80 p-3 rounded-xl border border-neutral-700">
                      <div>Raw Meat & Rice: <strong className="text-amber-400">{formatCurrency(purchasesTotal)}</strong></div>
                      <div>Staff Wages: <strong className="text-indigo-400">{formatCurrency(wagesTotal)}</strong></div>
                      <div>Shop & Utilities: <strong className="text-emerald-400">{formatCurrency(shopTotal)}</strong></div>
                      <div className="text-rose-400">Customer Refunds: <strong>{formatCurrency(totalRefundsIssued)}</strong> ({cancelledOrders.length} Cancelled)</div>
                    </div>

                    <div className="bg-gradient-to-tr from-amber-600/20 via-slate-800 to-slate-800 p-4 rounded-xl border border-amber-500/50 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <span className="text-[11px] uppercase font-black text-amber-300">ESTIMATED NET OPERATING PROFIT</span>
                        <div className={`text-2xl font-black mt-1 ${netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {formatCurrency(netProfit)}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400 text-right">
                        (Order Collections + Retained Cancellation Fees) - (Purchases, Wages & Overheads)
                      </p>
                    </div>
                  </>
                );
              })()}
            </div>
          </section>
        )}

        {/* TAB 10: USER ACCOUNTS */}
        {activeTab === 'users' && currentUser?.role === 'superadmin' && (
          <section className="space-y-5">
            <div className="bg-slate-900 border border-neutral-800 p-5 rounded-2xl flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white">Staff Accounts & Roles</h2>
                <p className="text-xs text-neutral-400">Manage user accounts for Order Call Desk, Kitchen, and Delivery.</p>
              </div>
              <button onClick={() => setIsUserModalOpen(true)} className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add User
              </button>
            </div>
            <div className="bg-slate-900 rounded-2xl border border-neutral-800 overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-800 text-neutral-400 uppercase font-semibold">
                  <tr>
                    <th className="px-4 py-3">Full Name</th>
                    <th className="px-4 py-3">Username</th>
                    <th className="px-4 py-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800">
                  {users.map(u => (
                    <tr key={u.id} className="hover:bg-slate-800/40">
                      <td className="px-4 py-3 font-bold text-white">{u.name}</td>
                      <td className="px-4 py-3 font-mono text-amber-400">{u.username}</td>
                      <td className="px-4 py-3 uppercase text-[10px] font-bold text-emerald-400">{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

      </main>

      {/* Order Entry / Edit Modal */}
      {isOrderModalOpen && (
        <OrderFormModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          initialOrder={editingOrder}
          isCallbackMode={isCallbackMode}
          menuItems={menuItems}
          existingOrders={orders}
          kitchenLocations={settings.kitchenLocations || DEFAULT_KITCHEN_LOCATIONS}
          onSave={async (newOrderData) => {
            try {
              if (editingOrder) {
                const res = await authFetch(`${API_BASE_URL}/orders/${editingOrder.id}`, {
                  method: 'PUT',
                  body: JSON.stringify(newOrderData)
                });
                if (res.ok) {
                  const saved = await res.json();
                  setOrders(orders.map(o => o.id === editingOrder.id ? saved : o));
                  showToast(`Order #${editingOrder.id} updated!`);
                  setIsOrderModalOpen(false);
                  return;
                }
              } else {
                const res = await authFetch(`${API_BASE_URL}/orders`, {
                  method: 'POST',
                  body: JSON.stringify(newOrderData)
                });
                if (res.ok) {
                  const saved = await res.json();
                  setOrders([saved, ...orders]);
                  showToast(newOrderData.isCallback ? 'Callback lead recorded!' : 'Order booked successfully!');
                  setIsOrderModalOpen(false);
                  return;
                }
              }
            } catch {}

            // Offline fallback
            if (editingOrder) {
              setOrders(orders.map(o => o.id === editingOrder.id ? { ...o, ...newOrderData } : o));
              showToast(`Order #${editingOrder.id} updated!`);
            } else {
              const newId = newOrderData.isCallback ? `CB-${orders.length + 101}` : `ORD-${orders.length + 101}`;
              setOrders([{ id: newId, createdAt: TODAY_STR, ...newOrderData }, ...orders]);
              showToast(newOrderData.isCallback ? 'Callback lead recorded!' : 'Order booked successfully!');
            }
            setIsOrderModalOpen(false);
          }}
        />
      )}

      {/* Cancel & Settle Advance Modal */}
      {orderToCancel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-rose-400">
                <Ban className="w-5 h-5" />
                <h3 className="font-bold text-white text-base">Cancel Order & Settle Advance Token</h3>
              </div>
              <button onClick={() => setOrderToCancel(null)}><X className="w-4 h-4 text-neutral-400" /></button>
            </div>

            <form onSubmit={handleCancelOrderSubmit} className="space-y-3.5 text-xs">
              <div className="bg-slate-800 p-3 rounded-xl border border-neutral-700/80 space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-neutral-400">Order ID & Customer:</span>
                  <span className="font-bold text-white">#{orderToCancel.id} • {orderToCancel.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-400">Total Order Bill:</span>
                  <span className="font-bold text-white">₹{orderToCancel.totalAmount}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-neutral-700 font-bold">
                  <span className="text-emerald-400">Customer Advance Paid:</span>
                  <span className="text-emerald-400 font-mono text-sm">₹{orderToCancel.advancePaid || 0}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">Amount Refunded to Customer (₹)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cancelRefund}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCancelRefund(val);
                      const adv = orderToCancel.advancePaid || 0;
                      const ref = parseFloat(val) || 0;
                      // Auto-calculate retained charge
                      setCancelFee(Math.max(0, adv - ref).toString());
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
                <div>
                  <label className="block text-neutral-300 font-semibold mb-1">
                    Store Retention / Kitchen Charge (₹)
                    <span className="text-emerald-400 block text-[10px] font-normal">Added directly to store profit</span>
                  </label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={cancelFee}
                    onChange={(e) => {
                      const val = e.target.value;
                      setCancelFee(val);
                      const adv = orderToCancel.advancePaid || 0;
                      const fee = parseFloat(val) || 0;
                      // Auto-calculate refund
                      setCancelRefund(Math.max(0, adv - fee).toString());
                    }}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-slate-800 border border-emerald-500 rounded-xl text-emerald-300 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-semibold mb-1">Reason / Notes for Cancellation</label>
                <input
                  type="text"
                  required
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  placeholder="e.g. Customer cancelled last minute, retained ₹1000 for preparation charge"
                  className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white"
                />
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-[11px] text-emerald-300 flex items-center justify-between">
                <span>Profit impact from this cancellation:</span>
                <span className="font-black text-sm">+{formatCurrency(parseFloat(cancelFee) || 0)}</span>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
                <button type="button" onClick={() => setOrderToCancel(null)} className="px-3 py-1.5 text-neutral-400">
                  Keep Order
                </button>
                <button type="submit" className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl shadow-lg">
                  Confirm Cancellation & Settlement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Meat Cut Weight Modal */}
      {isWeightModalOpen && weightOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400">
                <Scale className="w-5 h-5" />
                <h3 className="font-bold text-white text-sm">Adjust Mutton Butcher Cut Weight (KG)</h3>
              </div>
              <button onClick={() => setIsWeightModalOpen(false)}><X className="w-4 h-4 text-neutral-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <p className="text-neutral-400">Enter exact carcass weight strictly in <strong>KG</strong> (e.g. 1.150 kg).</p>
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Actual Weight (KG)</label>
                <input
                  type="text"
                  inputMode="decimal"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-amber-500 rounded-xl text-base font-black text-white focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={recalcBill}
                  onChange={(e) => setRecalcBill(e.target.checked)}
                  className="w-4 h-4 accent-amber-500"
                />
                <span>Automatically recalculate total bill at ₹1,800 / KG rate</span>
              </label>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button onClick={() => setIsWeightModalOpen(false)} className="px-3 py-1.5 text-neutral-400">Cancel</button>
              <button
                onClick={async () => {
                  const kg = parseFloat(weightInput);
                  if (isNaN(kg) || kg <= 0) return;
                  try {
                    const res = await authFetch(`${API_BASE_URL}/orders/${weightOrder.id}/weight`, {
                      method: 'PATCH',
                      body: JSON.stringify({ actualKg: kg, recalculateBill: recalcBill })
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setOrders(orders.map(o => o.id === weightOrder.id ? updated : o));
                      setIsWeightModalOpen(false);
                      showToast(`Updated mutton weight for #${weightOrder.id} to ${formatKg(kg)}!`);
                      return;
                    }
                  } catch {}

                  setOrders(orders.map(o => {
                    if (o.id !== weightOrder.id) return o;
                    const items = o.items.map(item => {
                      if (!item.isMutton) return item;
                      const subtotal = recalcBill ? Math.round(kg * item.rate) : item.subtotal;
                      return { ...item, actualKg: kg, subtotal };
                    });
                    const totalAmount = items.reduce((acc, curr) => acc + curr.subtotal, 0);
                    const balanceRemaining = Math.max(0, totalAmount - (o.advancePaid || 0) - (o.discount || 0));
                    return { ...o, items, totalAmount, balanceRemaining };
                  }));
                  setIsWeightModalOpen(false);
                  showToast(`Updated mutton weight for #${weightOrder.id} to ${formatKg(kg)}!`);
                }}
                className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs"
              >
                Save Weight & Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dispatch Payment Audit Modal */}
      {isAuditModalOpen && auditOrder && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/40 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-bold text-white text-base">Payment Audit & Collection (#{auditOrder.id})</h3>
              <button onClick={() => setIsAuditModalOpen(false)}><X className="w-4 h-4 text-neutral-400" /></button>
            </div>
            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Total Bill</label>
                  <input type="text" readOnly value={`₹${auditOrder.totalAmount}`} className="w-full px-3 py-1.5 bg-slate-950 border border-neutral-800 rounded-lg text-white font-bold" />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1">Discount (₹)</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={auditDiscount}
                    onChange={(e) => {
                      const val = e.target.value;
                      setAuditDiscount(val);
                      const disc = parseFloat(val) || 0;
                      const net = Math.max(0, auditOrder.totalAmount - disc);
                      const bal = Math.max(0, net - (auditOrder.advancePaid || 0));
                      setAuditPaidNow(bal.toString());
                    }}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-neutral-700 rounded-lg text-indigo-400 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-400 mb-1">Advance Paid</label>
                  <input type="text" readOnly value={`₹${auditOrder.advancePaid || 0}`} className="w-full px-3 py-1.5 bg-slate-950 border border-neutral-800 rounded-lg text-emerald-400 font-bold" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-neutral-400">Amount Paid Now (₹)</label>
                    <button
                      type="button"
                      onClick={() => {
                        const disc = parseFloat(auditDiscount) || 0;
                        const net = Math.max(0, auditOrder.totalAmount - disc);
                        const bal = Math.max(0, net - (auditOrder.advancePaid || 0));
                        setAuditPaidNow(bal.toString());
                      }}
                      className="text-[10px] text-amber-400 hover:underline font-bold"
                    >
                      Auto-Fill Balance
                    </button>
                  </div>
                  <input
                    type="text"
                    inputMode="decimal"
                    value={auditPaidNow}
                    onChange={(e) => setAuditPaidNow(e.target.value)}
                    placeholder="0"
                    className="w-full px-3 py-1.5 bg-slate-800 border border-emerald-500 rounded-lg text-emerald-300 font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-neutral-400 mb-1">Collector Staff Name</label>
                <input
                  type="text"
                  required
                  value={auditCollector}
                  onChange={(e) => setAuditCollector(e.target.value)}
                  placeholder="e.g. Imran (Rider), Cashier"
                  className="w-full px-3 py-1.5 bg-slate-800 border border-neutral-700 rounded-lg text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
              <button onClick={() => setIsAuditModalOpen(false)} className="px-3 py-1.5 text-neutral-400">Cancel</button>
              <button
                onClick={async () => {
                  const discountVal = parseFloat(auditDiscount) || 0;
                  const paidNowVal = parseFloat(auditPaidNow) || 0;
                  try {
                    const res = await authFetch(`${API_BASE_URL}/orders/${auditOrder.id}/audit`, {
                      method: 'PATCH',
                      body: JSON.stringify({
                        discount: discountVal,
                        amountPaidNow: paidNowVal,
                        paymentMethod: auditMethod,
                        collectorName: auditCollector,
                        status: auditStatus
                      })
                    });
                    if (res.ok) {
                      const updated = await res.json();
                      setOrders(orders.map(o => o.id === auditOrder.id ? updated : o));
                      setIsAuditModalOpen(false);
                      showToast(`Payment audit recorded for #${auditOrder.id}!`);
                      return;
                    }
                  } catch {}

                  setOrders(orders.map(o => {
                    if (o.id !== auditOrder.id) return o;
                    const net = Math.max(0, o.totalAmount - discountVal);
                    const balanceRemaining = Math.max(0, net - (o.advancePaid || 0) - paidNowVal);
                    return {
                      ...o,
                      discount: discountVal,
                      amountPaidAtDispatch: paidNowVal,
                      paymentMode: auditMethod,
                      paymentCollector: auditCollector,
                      balanceRemaining,
                      status: auditStatus
                    };
                  }));
                  setIsAuditModalOpen(false);
                  showToast(`Payment audit recorded for #${auditOrder.id}!`);
                }}
                className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-lg"
              >
                Save Payment & Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu Item Modal */}
      {isMenuModalOpen && (
        <MenuItemModal
          isOpen={isMenuModalOpen}
          initialItem={editingMenuItem}
          onClose={() => setIsMenuModalOpen(false)}
          onSave={async (itemData) => {
            try {
              if (editingMenuItem) {
                await authFetch(`${API_BASE_URL}/menu/${editingMenuItem.id}`, {
                  method: 'PUT',
                  body: JSON.stringify(itemData)
                });
                setMenuItems(menuItems.map(i => i.id === editingMenuItem.id ? { ...i, ...itemData } : i));
                showToast(`Dish '${itemData.name}' updated!`);
              } else {
                const res = await authFetch(`${API_BASE_URL}/menu`, {
                  method: 'POST',
                  body: JSON.stringify(itemData)
                });
                const data = await res.json();
                setMenuItems([...menuItems, { id: data.id || `item_${Date.now()}`, ...itemData }]);
                showToast(`Dish '${itemData.name}' added to menu!`);
              }
            } catch {
              if (editingMenuItem) {
                setMenuItems(menuItems.map(i => i.id === editingMenuItem.id ? { ...i, ...itemData } : i));
              } else {
                setMenuItems([...menuItems, { id: `item_${Date.now()}`, ...itemData }]);
              }
            }
            setIsMenuModalOpen(false);
          }}
        />
      )}

      {/* Expense Modal */}
      {isExpenseModalOpen && (
        <ExpenseModal
          isOpen={isExpenseModalOpen}
          onClose={() => setIsExpenseModalOpen(false)}
          onSave={async (newExp) => {
            try {
              const res = await authFetch(`${API_BASE_URL}/expenses`, {
                method: 'POST',
                body: JSON.stringify(newExp)
              });
              const data = await res.json();
              setExpenses([{ id: data.id || `exp-${Date.now()}`, ...newExp }, ...expenses]);
            } catch {
              setExpenses([{ id: `exp-${Date.now()}`, ...newExp }, ...expenses]);
            }
            setIsExpenseModalOpen(false);
            showToast('Expense recorded successfully!');
          }}
        />
      )}

      {/* Settings Modal */}
      {isSettingsModalOpen && (
        <SettingsModal
          isOpen={isSettingsModalOpen}
          settings={settings}
          onClose={() => setIsSettingsModalOpen(false)}
          onSave={async (newSet) => {
            try {
              await authFetch(`${API_BASE_URL}/settings`, {
                method: 'POST',
                body: JSON.stringify({
                  ...newSet,
                  kitchenLocations: JSON.stringify(newSet.kitchenLocations)
                })
              });
            } catch {}
            setSettings(newSet);
            setIsSettingsModalOpen(false);
            showToast('Payment, helplines & kitchen outlets saved!');
          }}
        />
      )}

      {/* Staff Accounts Modal */}
      {isUserModalOpen && (
        <UserModal
          isOpen={isUserModalOpen}
          onClose={() => setIsUserModalOpen(false)}
          onSave={async (userData) => {
            try {
              const res = await authFetch(`${API_BASE_URL}/users`, {
                method: 'POST',
                body: JSON.stringify(userData)
              });
              if (res.ok) {
                const created = await res.json();
                setUsers([...users, created]);
                showToast(`Staff account ${created.username} created!`);
                setIsUserModalOpen(false);
                return;
              }
            } catch {}
            setUsers([...users, { id: `u_${Date.now()}`, ...userData }]);
            showToast(`Staff account ${userData.username} created!`);
            setIsUserModalOpen(false);
          }}
        />
      )}

      {/* Customer Timeline Modal */}
      {selectedCustomerPhone && (
        <CustomerTimelineModal
          phone={selectedCustomerPhone}
          orders={orders}
          onClose={() => setSelectedCustomerPhone(null)}
        />
      )}

      {/* Delete Order Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/50 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2.5 text-rose-400">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-bold text-white text-base">Permanently Delete Order</h3>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Are you sure you want to permanently delete order <strong className="text-amber-400 font-mono">#{orderToDelete.id}</strong> ({orderToDelete.customerName})? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-3.5 py-1.5 text-neutral-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteOrderConfirm}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrderFormModal({ isOpen, onClose, initialOrder, isCallbackMode, menuItems, existingOrders, kitchenLocations, onSave }) {
  const [isCallback, setIsCallback] = useState(isCallbackMode || (initialOrder ? initialOrder.isCallback : false));
  const [custPhone, setCustPhone] = useState(initialOrder ? initialOrder.customerPhone : '');
  const [custName, setCustName] = useState(initialOrder ? initialOrder.customerName : '');
  const [fulfillment, setFulfillment] = useState(initialOrder ? initialOrder.fulfillmentType : 'DELIVERY');
  
  const defaultLoc = kitchenLocations?.[0]?.name || 'Commercial Street Central Kitchen';
  const [kitchenLocation, setKitchenLocation] = useState(initialOrder ? (initialOrder.kitchenLocation || defaultLoc) : defaultLoc);
  
  const [orderTakenAt, setOrderTakenAt] = useState(initialOrder ? (initialOrder.orderTakenAt || formatFullDate12Hour()) : formatFullDate12Hour());
  const [targetDate, setTargetDate] = useState(initialOrder ? initialOrder.targetDate : TODAY_STR);
  const [targetTime, setTargetTime] = useState(initialOrder ? initialOrder.targetTime : '19:30');
  const [area, setArea] = useState(initialOrder ? initialOrder.deliveryArea : '');
  const [address, setAddress] = useState(initialOrder ? initialOrder.deliveryAddress : '');
  const [instructions, setInstructions] = useState(initialOrder ? initialOrder.specialInstructions : '');
  
  // Clean string-based state so "0" is completely backspace-able
  const [advancePaid, setAdvancePaid] = useState(() => {
    if (initialOrder && initialOrder.advancePaid) return initialOrder.advancePaid.toString();
    return '';
  });
  const [advanceMode, setAdvanceMode] = useState(initialOrder ? (initialOrder.paymentMode || 'UPI (GPay / PhonePe)') : 'UPI (GPay / PhonePe)');

  const [itemQuantities, setItemQuantities] = useState(() => {
    const q = {};
    menuItems.forEach(i => { q[i.id] = 0; });
    if (initialOrder && initialOrder.items) {
      initialOrder.items.forEach(i => { q[i.itemId] = i.bookedKg; });
    }
    return q;
  });

  const selectedKitchenData = useMemo(() => {
    return (kitchenLocations || []).find(k => k.name === kitchenLocation) || kitchenLocations?.[0];
  }, [kitchenLocations, kitchenLocation]);

  const cleanPhone = sanitizePhone(custPhone);
  const pastOrders = useMemo(() => {
    if (cleanPhone.length < 8) return [];
    return existingOrders.filter(o => sanitizePhone(o.customerPhone) === cleanPhone);
  }, [cleanPhone, existingOrders]);

  const autofillRepeat = () => {
    if (pastOrders.length === 0) return;
    const last = pastOrders[0];
    setCustName(last.customerName);
    setFulfillment(last.fulfillmentType || 'DELIVERY');
    if (last.kitchenLocation) setKitchenLocation(last.kitchenLocation);
    setArea(last.deliveryArea || '');
    setAddress(last.deliveryAddress || '');
    if (last.specialInstructions) setInstructions(last.specialInstructions);
  };

  const cloneLastOrder = () => {
    if (pastOrders.length === 0) return;
    const last = pastOrders[0];
    const newQ = {};
    menuItems.forEach(i => { newQ[i.id] = 0; });
    last.items.forEach(i => { newQ[i.itemId] = i.bookedKg || 1; });
    setItemQuantities(newQ);
  };

  const totalAmount = useMemo(() => {
    return menuItems.reduce((acc, item) => {
      const q = itemQuantities[item.id] || 0;
      return acc + (q * item.rate);
    }, 0);
  }, [menuItems, itemQuantities]);

  const numericAdvance = parseFloat(advancePaid) || 0;
  const balanceRemaining = Math.max(0, totalAmount - numericAdvance);

  const handleSubmit = (e) => {
    e.preventDefault();
    const orderedItems = [];
    menuItems.forEach(item => {
      const q = itemQuantities[item.id] || 0;
      if (q > 0) {
        orderedItems.push({
          itemId: item.id,
          name: item.name,
          unit: item.unit,
          bookedKg: q,
          rate: item.rate,
          subtotal: Math.round(q * item.rate),
          isMutton: item.isMutton,
          isChicken: item.isChicken,
          actualKg: initialOrder ? initialOrder.items.find(i => i.itemId === item.id)?.actualKg : null
        });
      }
    });

    if (orderedItems.length === 0) return;

    onSave({
      customerName: custName.trim(),
      customerPhone: custPhone.trim(),
      fulfillmentType: fulfillment,
      kitchenLocation,
      deliveryArea: area.trim(),
      deliveryAddress: fulfillment === 'PICKUP' ? (selectedKitchenData?.address || 'Pickup Outlet') : (address.trim() || 'Address Pending'),
      targetDate,
      targetTime,
      orderTakenAt,
      items: orderedItems,
      specialInstructions: instructions.trim(),
      totalAmount,
      advancePaid: numericAdvance,
      discount: initialOrder?.discount || 0,
      amountPaidAtDispatch: initialOrder?.amountPaidAtDispatch || 0,
      balanceRemaining,
      refundAmount: initialOrder?.refundAmount || 0,
      cancellationFee: initialOrder?.cancellationFee || 0,
      cancellationReason: initialOrder?.cancellationReason || '',
      paymentMode: advanceMode,
      paymentCollector: 'Order Call Desk',
      status: isCallback ? 'CALLBACK_REQUIRED' : (initialOrder?.status || 'BOOKED'),
      isCallback
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-500/40 rounded-2xl w-full max-w-3xl shadow-2xl my-auto max-h-[94vh] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3.5 flex items-center justify-between text-slate-950">
          <div className="flex items-center space-x-2">
            <PhoneCall className="w-5 h-5" />
            <div>
              <h3 className="font-black text-base">{initialOrder ? `Edit #${initialOrder.id}` : (isCallback ? 'Record Callback Lead' : 'Take Caller Pre-Booking Order')}</h3>
              <p className="text-[11px] font-medium text-slate-950/80">Input phone, outlet, 12-hr booking timestamp, and portions</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full bg-white/20 hover:bg-white/40"><X className="w-4 h-4" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="bg-slate-800 p-3 rounded-xl border border-amber-500/30 flex items-center justify-between">
            <div>
              <div className="font-bold text-white flex items-center gap-1.5">
                <PhoneForwarded className="w-4 h-4 text-amber-400" />
                <span>Mark as Callback Lead (Tentative Inquiry)</span>
              </div>
              <p className="text-[10px] text-neutral-400">Routes to Callbacks pipeline for quote negotiation and confirmation</p>
            </div>
            <input type="checkbox" checked={isCallback} onChange={(e) => setIsCallback(e.target.checked)} className="w-4 h-4 accent-amber-500" />
          </div>

          {/* 12-Hour Order Taken Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-800/80 p-3 rounded-xl border border-neutral-700/60">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Order Taken Date & Time (12-Hour Format) *
              </label>
              <input
                type="text"
                required
                value={orderTakenAt}
                onChange={(e) => setOrderTakenAt(e.target.value)}
                placeholder="DD-MM-YYYY 08:30 PM"
                className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-300 mb-1 flex items-center gap-1">
                <Building className="w-3.5 h-3.5 text-amber-400" /> Kitchen / Outlet Location *
              </label>
              <select
                value={kitchenLocation}
                onChange={(e) => setKitchenLocation(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-xl text-white font-semibold"
              >
                {(kitchenLocations || []).map(loc => (
                  <option key={loc.id || loc.name} value={loc.name}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Customer Phone Number *</label>
              <input
                type="tel"
                required
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                placeholder="e.g. 9845199221"
                className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white font-mono"
              />
            </div>
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Customer Name *</label>
              <input
                type="text"
                required
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                placeholder="e.g. Mohammed Tariq"
                className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white"
              />
            </div>
          </div>

          {pastOrders.length > 0 && (
            <div className="bg-slate-800 border border-amber-500/50 p-3 rounded-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-amber-400 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> REPEAT CALLER DETECTED ({pastOrders.length} Past Orders)
                </span>
                <span className="text-neutral-300 text-[11px]">Last: {pastOrders[0].targetDate} ({pastOrders[0].items.map(i => i.name).join(', ')})</span>
              </div>
              <div className="flex items-center gap-1.5">
                <button type="button" onClick={autofillRepeat} className="px-2.5 py-1 bg-amber-500 text-slate-950 font-bold rounded-lg text-[11px]">
                  Autofill Details
                </button>
                <button type="button" onClick={cloneLastOrder} className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px]">
                  Clone Portions
                </button>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Fulfillment Mode</label>
              <select value={fulfillment} onChange={(e) => setFulfillment(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white">
                <option value="DELIVERY">Delivery to Location</option>
                <option value="PICKUP">Store Takeaway Pickup</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Target Date *</label>
              <input type="date" required value={targetDate} onChange={(e) => setTargetDate(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
            </div>
            <div>
              <label className="block font-semibold text-neutral-300 mb-1">Target Time Slot *</label>
              <input type="time" required value={targetTime} onChange={(e) => setTargetTime(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
            </div>
          </div>

          {fulfillment === 'DELIVERY' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-amber-300 mb-1">Delivery Neighborhood / Area *</label>
                <input
                  type="text"
                  required
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="e.g. Indiranagar, HSR Layout, Frazer Town"
                  className="w-full px-3 py-2 bg-slate-800 border border-amber-500/50 rounded-xl text-white font-bold"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Street Address / Landmark</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Flat #, Building, or 'Will send pin'"
                  className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white"
                />
              </div>
            </div>
          ) : (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-xl space-y-1">
              <div className="font-bold text-emerald-300 text-xs">🛍️ Customer Pickup Point: {selectedKitchenData?.name}</div>
              <div className="text-neutral-300 text-[11px]">{selectedKitchenData?.address}</div>
              {selectedKitchenData?.mapLink && (
                <a href={selectedKitchenData.mapLink} target="_blank" rel="noreferrer" className="text-amber-400 hover:underline text-[11px] font-bold flex items-center gap-1">
                  View Pickup Map Pin <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          )}

          <div className="border-t border-b border-neutral-800 py-3 space-y-2">
            <div className="font-bold text-amber-400 uppercase text-[10px] tracking-wider">Mandi Portions Selection:</div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {menuItems.filter(i => i.active !== false).map(item => (
                <div key={item.id} className="bg-slate-800 p-2.5 rounded-xl border border-neutral-700 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">{item.name} <span className="text-amber-400 font-bold">₹{item.rate}/{item.unit}</span></div>
                    <div className="text-[10px] text-neutral-400">{item.note}</div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setItemQuantities({ ...itemQuantities, [item.id]: Math.max(0, (itemQuantities[item.id] || 0) - (item.unit === 'KG' ? 0.5 : 1)) })}
                      className="w-7 h-7 bg-slate-900 border border-neutral-700 rounded font-black text-neutral-300"
                    >
                      -
                    </button>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={itemQuantities[item.id] || 0}
                      onChange={(e) => setItemQuantities({ ...itemQuantities, [item.id]: parseFloat(e.target.value) || 0 })}
                      className="w-16 text-center py-1 bg-slate-900 border border-neutral-700 rounded text-amber-400 font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <button
                      type="button"
                      onClick={() => setItemQuantities({ ...itemQuantities, [item.id]: (itemQuantities[item.id] || 0) + (item.unit === 'KG' ? 0.5 : 1) })}
                      className="w-7 h-7 bg-slate-900 border border-neutral-700 rounded font-black text-neutral-300"
                    >
                      +
                    </button>
                    <span className="text-[10px] text-neutral-400 font-bold w-7 text-center">{item.unit}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Cooking Instructions / Notes</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Mild spice, crispy mutton skin, extra tomato dagus chutney"
              className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white"
            />
          </div>

          <div className="bg-slate-800 p-3 rounded-xl border border-neutral-700 space-y-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Advance Deposit (₹)</label>
                {/* Clean input with NO up/down arrows and fully removable value */}
                <input
                  type="text"
                  inputMode="decimal"
                  value={advancePaid}
                  onChange={(e) => setAdvancePaid(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-1.5 bg-slate-900 border border-neutral-700 rounded-lg text-emerald-400 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Advance Mode</label>
                <select value={advanceMode} onChange={(e) => setAdvanceMode(e.target.value)} className="w-full px-3 py-1.5 bg-slate-900 border border-neutral-700 rounded-lg text-white">
                  <option value="UPI (GPay / PhonePe)">UPI (GPay / PhonePe)</option>
                  <option value="Cash at Store">Cash at Store</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Pending Token">No Advance (Pending)</option>
                </select>
              </div>
            </div>
            <div className="flex justify-between pt-2 border-t border-neutral-800 font-black">
              <span>Total Bill: <span className="text-white">₹{totalAmount}</span></span>
              <span>Balance: <span className="text-rose-400">₹{balanceRemaining}</span></span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-4 py-2 text-neutral-400">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold rounded-xl shadow-lg">
              {initialOrder ? 'Update Order' : (isCallback ? 'Save Callback Lead' : 'Book Order')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function MenuItemModal({ isOpen, initialItem, onClose, onSave }) {
  const [name, setName] = useState(initialItem ? initialItem.name : '');
  const [rate, setRate] = useState(initialItem ? initialItem.rate.toString() : '1800');
  const [unit, setUnit] = useState(initialItem ? initialItem.unit : 'KG');
  const [category, setCategory] = useState(initialItem ? initialItem.category : 'Mandi');
  const [isMutton, setIsMutton] = useState(initialItem ? initialItem.isMutton : false);
  const [note, setNote] = useState(initialItem ? initialItem.note : '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name: name.trim(),
      rate: parseFloat(rate) || 0,
      unit,
      category,
      isMutton,
      isChicken: name.toLowerCase().includes('chicken') || category.toLowerCase().includes('chicken'),
      note: note.trim(),
      active: true
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-lg p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-white text-base">{initialItem ? `Edit ${initialItem.name}` : 'Add Dish to Menu'}</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-neutral-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Dish Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Chicken Mandi (Full)" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Price Rate (₹) *</label>
              <input
                type="text"
                required
                inputMode="decimal"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-amber-400 font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Unit *</label>
              <select value={unit} onChange={(e) => setUnit(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white">
                <option value="KG">per KG (Meat + Rice)</option>
                <option value="Full">per Full (Whole bird/large)</option>
                <option value="Half">per Half</option>
                <option value="Portion">per Portion</option>
                <option value="Piece">per Piece</option>
              </select>
            </div>
          </div>
          <div className="flex items-center justify-between bg-slate-800 p-2.5 rounded-xl border border-neutral-700">
            <div>
              <div className="font-bold text-white">Is Mutton Meat?</div>
              <div className="text-[10px] text-neutral-400">Allows butcher cut weight adjustments in Kitchen KDS</div>
            </div>
            <input type="checkbox" checked={isMutton} onChange={(e) => setIsMutton(e.target.checked)} className="w-4 h-4 accent-amber-500" />
          </div>
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Servings / Description Note</label>
            <input type="text" value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Includes 1 full chicken + 1kg rice (Serves 4-5)" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-neutral-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Dish</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ExpenseModal({ isOpen, onClose, onSave }) {
  const [type, setType] = useState('PURCHASE');
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(TODAY_STR);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      type,
      name: name.trim(),
      qty: type === 'PURCHASE' ? qty.trim() : '',
      role: type === 'SALARY' ? 'Staff' : '',
      amount: parseFloat(amount) || 0,
      date,
      notes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-neutral-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-white text-sm">Record Expense / Wage / Overhead</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-neutral-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Expense Type</label>
            <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white">
              <option value="PURCHASE">Kitchen Purchase (Meat, rice, spices, gas cylinder)</option>
              <option value="SALARY">Employee Salary / Daily Wage</option>
              <option value="SHOP">Shop Overhead (Electricity bill, water tanker, rent, maintenance)</option>
            </select>
          </div>
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">
              {type === 'PURCHASE' ? 'Item Purchased *' : (type === 'SALARY' ? 'Employee Name *' : 'Shop Utility / Expense Item *')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === 'SHOP' ? 'e.g. BESCOM Electricity Bill, Water Tanker 1000L' : (type === 'SALARY' ? 'e.g. Chef Bilal' : 'e.g. Raw Halal Baby Goat Carcass')}
              className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white"
            />
          </div>
          {type === 'PURCHASE' && (
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Quantity (KG / Units)</label>
              <input type="text" value={qty} onChange={(e) => setQty(e.target.value)} placeholder="e.g. 15.500 kg" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Amount (₹) *</label>
              <input
                type="text"
                required
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white font-bold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div>
              <label className="block text-neutral-300 font-semibold mb-1">Date *</label>
              <input type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
            </div>
          </div>
          <div>
            <label className="block text-neutral-300 font-semibold mb-1">Notes / Payment Mode</label>
            <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. Paid online, voucher #412" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-xl text-white" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-neutral-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Save Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function SettingsModal({ isOpen, settings, onClose, onSave }) {
  const [accountName, setAccountName] = useState(settings.accountName);
  const [paymentPhone, setPaymentPhone] = useState(settings.paymentPhone);
  const [upiId, setUpiId] = useState(settings.upiId);
  const [customerCarePhone, setCustomerCarePhone] = useState(settings.customerCarePhone || '+91 98450 11223');
  const [deliveryTeamPhone, setDeliveryTeamPhone] = useState(settings.deliveryTeamPhone || '+91 98450 44556');
  const [kitchenLocations, setKitchenLocations] = useState(settings.kitchenLocations || DEFAULT_KITCHEN_LOCATIONS);

  // New location inputs
  const [newLocName, setNewLocName] = useState('');
  const [newLocAddress, setNewLocAddress] = useState('');
  const [newLocMapLink, setNewLocMapLink] = useState('');

  const handleAddLocation = () => {
    if (!newLocName.trim() || !newLocAddress.trim()) return;
    const newLoc = {
      id: `loc_${Date.now()}`,
      name: newLocName.trim(),
      address: newLocAddress.trim(),
      mapLink: newLocMapLink.trim() || 'https://maps.google.com/'
    };
    setKitchenLocations([...kitchenLocations, newLoc]);
    setNewLocName('');
    setNewLocAddress('');
    setNewLocMapLink('');
  };

  const handleRemoveLocation = (id) => {
    setKitchenLocations(kitchenLocations.filter(k => k.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      accountName,
      paymentPhone,
      upiId,
      customerCarePhone,
      deliveryTeamPhone,
      kitchenLocations,
      pickupAddress: kitchenLocations[0]?.address || settings.pickupAddress,
      pickupMapLink: kitchenLocations[0]?.mapLink || settings.pickupMapLink
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-neutral-700 rounded-2xl w-full max-w-2xl p-5 space-y-4 shadow-2xl max-h-[92vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-white text-base">Payment, Helplines & Kitchen Locations</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-neutral-400" /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs overflow-y-auto flex-1 pr-1">
          {/* Customer Care & Delivery Phone Numbers */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-neutral-700 space-y-3">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">Customer Support & Delivery Helpline (Sent via WhatsApp)</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1">Customer Care Contact Number</label>
                <input
                  type="text"
                  required
                  value={customerCarePhone}
                  onChange={(e) => setCustomerCarePhone(e.target.value)}
                  placeholder="+91 98450 11223"
                  className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">Delivery Team Contact Number</label>
                <input
                  type="text"
                  required
                  value={deliveryTeamPhone}
                  onChange={(e) => setDeliveryTeamPhone(e.target.value)}
                  placeholder="+91 98450 44556"
                  className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Payment Account & UPI */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-neutral-700 space-y-3">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">UPI & Bank Details</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-neutral-300 mb-1">Payee Name</label>
                <input type="text" value={accountName} onChange={(e) => setAccountName(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">UPI Phone Number</label>
                <input type="text" value={paymentPhone} onChange={(e) => setPaymentPhone(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-lg text-white" />
              </div>
              <div>
                <label className="block text-neutral-300 mb-1">UPI ID / VPA</label>
                <input type="text" value={upiId} onChange={(e) => setUpiId(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-neutral-700 rounded-lg text-white" />
              </div>
            </div>
          </div>

          {/* Kitchen / Outlets Locations Manager */}
          <div className="bg-slate-800/80 p-3 rounded-xl border border-neutral-700 space-y-3">
            <span className="font-bold text-amber-400 uppercase text-[10px] tracking-wider block">Kitchen Outlets & Pickup Hubs</span>
            <div className="space-y-2">
              {kitchenLocations.map(loc => (
                <div key={loc.id} className="bg-slate-900 p-2.5 rounded-xl border border-neutral-700 flex items-center justify-between">
                  <div className="flex-1 pr-2">
                    <div className="font-bold text-white text-xs">{loc.name}</div>
                    <div className="text-[10px] text-neutral-400 truncate">{loc.address}</div>
                    <a href={loc.mapLink} target="_blank" rel="noreferrer" className="text-[10px] text-amber-400 hover:underline">
                      Google Maps Link
                    </a>
                  </div>
                  {kitchenLocations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveLocation(loc.id)}
                      className="text-neutral-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add New Outlet form */}
            <div className="pt-2 border-t border-neutral-700/60 space-y-2">
              <span className="text-[11px] font-bold text-neutral-300">+ Add New Kitchen Location</span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  type="text"
                  placeholder="Outlet Name (e.g. HSR Sector 2)"
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-neutral-700 rounded-lg text-white"
                />
                <input
                  type="text"
                  placeholder="Full Store Address"
                  value={newLocAddress}
                  onChange={(e) => setNewLocAddress(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-neutral-700 rounded-lg text-white"
                />
                <input
                  type="url"
                  placeholder="Google Maps URL"
                  value={newLocMapLink}
                  onChange={(e) => setNewLocMapLink(e.target.value)}
                  className="px-2.5 py-1.5 bg-slate-900 border border-neutral-700 rounded-lg text-white font-mono"
                />
              </div>
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-xs font-semibold"
              >
                + Add Outlet to List
              </button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-neutral-400">Cancel</button>
            <button type="submit" className="px-5 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl shadow-lg">Save Settings</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UserModal({ isOpen, onClose, onSave }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('orders');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ name: name.trim(), username: username.trim().toLowerCase(), password: password.trim(), role });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-neutral-700 rounded-2xl w-full max-w-md p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <h3 className="font-bold text-white text-base">Add Staff Account</h3>
          <button onClick={onClose}><X className="w-4 h-4 text-neutral-400" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block text-neutral-300 mb-1">Staff Name *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Aslam Khan" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Username *</label>
            <input type="text" required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="e.g. aslam_desk" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-lg text-white font-mono" />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Password *</label>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-lg text-white" />
          </div>
          <div>
            <label className="block text-neutral-300 mb-1">Role *</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 bg-slate-800 border border-neutral-700 rounded-lg text-white">
              <option value="admin">Operations Admin</option>
              <option value="orders">Order Call Desk</option>
              <option value="kitchen">Kitchen Staff (KDS)</option>
              <option value="delivery">Delivery Dispatch Rider</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-neutral-800">
            <button type="button" onClick={onClose} className="px-3 py-1.5 text-neutral-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-amber-500 text-slate-950 font-bold rounded-xl">Create Account</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomerTimelineModal({ phone, orders, onClose }) {
  const clean = sanitizePhone(phone);
  const matching = orders.filter(o => sanitizePhone(o.customerPhone) === clean);
  const name = matching[0]?.customerName || 'Customer';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/50 rounded-2xl w-full max-w-xl p-5 space-y-4 shadow-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base">{name}</h3>
            <p className="text-xs text-amber-400 font-mono">+91 {clean}</p>
          </div>
          <button onClick={onClose}><X className="w-4 h-4 text-neutral-400" /></button>
        </div>
        <div className="overflow-y-auto space-y-2.5 flex-1 pr-1 text-xs">
          {matching.map(o => (
            <div key={o.id} className="bg-slate-800 p-3 rounded-xl border border-neutral-700 space-y-1.5">
              <div className="flex justify-between font-bold items-center">
                <span className="text-amber-400 font-mono flex items-center gap-2">
                  #{o.id} • {o.targetDate}
                  {o.status === 'CANCELLED' && (
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-1.5 py-0.5 rounded font-black">CANCELLED</span>
                  )}
                  {o.status === 'COMPLETED' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-black">COMPLETED</span>
                  )}
                </span>
                <span className="text-white">₹{o.totalAmount}</span>
              </div>
              <div className="text-neutral-300">
                {o.items.map(i => `${formatPortionDisplay(i, i.actualKg || i.bookedKg)} ${i.name}`).join(', ')}
              </div>
              {o.status === 'CANCELLED' && (
                <div className="text-[11px] bg-slate-900 p-2 rounded-lg border border-neutral-700/60 text-neutral-300 space-y-0.5">
                  <div className="flex justify-between">
                    <span>Advance Refunded: <strong className="text-rose-400">₹{o.refundAmount || 0}</strong></span>
                    <span>Store Retained: <strong className="text-emerald-400">+₹{o.cancellationFee || 0}</strong></span>
                  </div>
                  {o.cancellationReason && (
                    <div className="text-[10px] text-neutral-400">Note: {o.cancellationReason}</div>
                  )}
                </div>
              )}
              <div className="text-[10px] text-neutral-400 flex justify-between pt-1 border-t border-neutral-700/60">
                <span>{o.deliveryArea || o.fulfillmentType}</span>
                <span>Bal: <strong className="text-rose-400">₹{o.balanceRemaining}</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}