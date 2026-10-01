import {
  PhoneCall, PhoneForwarded, Users, Flame, Truck, Calendar, Utensils, Wallet, TrendingUp, Shield
} from 'lucide-react';

export const ROLE_TABS = {
  superadmin: ['orders', 'callbacks', 'customers', 'kitchen', 'dispatch', 'consolidated', 'menu', 'expenses', 'insights', 'users'],
  admin: ['orders', 'callbacks', 'customers', 'kitchen', 'dispatch', 'consolidated', 'menu', 'expenses', 'insights'],
  orders: ['orders', 'callbacks', 'customers', 'menu', 'consolidated'],
  kitchen: ['kitchen', 'dispatch'],
  delivery: ['dispatch']
};

export const TAB_META = {
  orders: { label: '1. Order Desk', icon: PhoneCall },
  callbacks: { label: '2. Callbacks', icon: PhoneForwarded },
  customers: { label: '3. CRM & Callers', icon: Users },
  kitchen: { label: '4. Kitchen KDS', icon: Flame },
  dispatch: { label: '5. Dispatch & Delivery', icon: Truck },
  consolidated: { label: '6. Consolidated', icon: Calendar },
  menu: { label: '7. Menu Catalog', icon: Utensils },
  expenses: { label: '8. Expenses & Wages', icon: Wallet },
  insights: { label: '9. Financial P&L', icon: TrendingUp },
  users: { label: '10. Staff Accounts', icon: Shield }
};
