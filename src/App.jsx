import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import TakeOrderModal from './components/TakeOrderModal';
import CancelModal from './components/CancelModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import AddExpenseModal from './components/AddExpenseModal';
import SettingsModal from './components/SettingsModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

import OrderDeskTab from './tabs/OrderDeskTab';
import KitchenKDSTab from './tabs/KitchenKDSTab';
import DispatchTab from './tabs/DispatchTab';
import ConsolidatedTab from './tabs/ConsolidatedTab';
import FinancialPnLTab from './tabs/FinancialPnLTab';
import ExpensesTab from './tabs/ExpensesTab';
import CRMTab from './tabs/CRMTab';

import { authFetch } from './services/api';
import { DEFAULT_MENU, DEFAULT_SETTINGS } from './config/constants';

export default function App() {
  const [currentUser] = useState(() => {
    const saved = localStorage.getItem('ops_user');
    return saved ? JSON.parse(saved) : { username: 'superadmin', role: 'superadmin' };
  });

  const [activeTab, setActiveTab] = useState('orders');
  const [apiOnline, setApiOnline] = useState(false);

  // Core Data
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState(DEFAULT_MENU);
  const [expenses, setExpenses] = useState([]);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  // Modals
  const [isTakeOrderOpen, setIsTakeOrderOpen] = useState(false);
  const [isCallbackLead, setIsCallbackLead] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Cancel Modal State
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [orderForPayment, setOrderForPayment] = useState(null);

  // Delete Modal State
  const [deleteConfirmationId, setDeleteConfirmationId] = useState(null);

  // Data Loading
  const loadData = async () => {
    try {
      const [resOrders, resMenu, resExp, resSettings] = await Promise.all([
        authFetch('/orders'),
        authFetch('/menu'),
        authFetch('/expenses'),
        authFetch('/settings')
      ]);

      if (resOrders.ok) {
        setOrders(await resOrders.json());
        setApiOnline(true);
      }
      if (resMenu.ok) setMenuItems(await resMenu.json());
      if (resExp.ok) setExpenses(await resExp.json());
      if (resSettings.ok) setSettings(await resSettings.json());
    } catch {
      setApiOnline(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Role Tab Permitted Ribbons
  const availableTabs = useMemo(() => {
    const role = currentUser?.role || 'orders';
    const all = [
      { id: 'orders', label: 'Order Desk', roles: ['superadmin', 'admin', 'orders'] },
      { id: 'callbacks', label: 'Callbacks', roles: ['superadmin', 'admin', 'orders'] },
      { id: 'crm', label: 'CRM & Callers', roles: ['superadmin', 'admin', 'orders'] },
      { id: 'kds', label: 'Kitchen KDS', roles: ['superadmin', 'admin', 'kitchen'] },
      { id: 'dispatch', label: 'Dispatch & Delivery', roles: ['superadmin', 'admin', 'delivery'] },
      { id: 'consolidated', label: 'Consolidated', roles: ['superadmin', 'admin', 'orders'] },
      { id: 'expenses', label: 'Expenses & Wages', roles: ['superadmin', 'admin'] },
      { id: 'pnl', label: 'Financial P&L', roles: ['superadmin', 'admin'] }
    ];
    return all.filter((tab) => tab.roles.includes(role));
  }, [currentUser]);

  // Order Handlers
  const handleSaveOrder = async (payload) => {
    try {
      const res = await authFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const saved = await res.json();
        setOrders((prev) => [saved, ...prev.filter((o) => o.id !== saved.id)]);
      } else {
        const fallback = { ...payload, id: `ORD-${Date.now().toString().slice(-4)}` };
        setOrders((prev) => [fallback, ...prev]);
      }
    } catch {
      const fallback = { ...payload, id: `ORD-${Date.now().toString().slice(-4)}` };
      setOrders((prev) => [fallback, ...prev]);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await authFetch(`/orders/${orderId}/status?status=${newStatus}`, { method: 'PATCH' });
    } catch (err) {
      console.warn('API error, falling back locally', err);
    }

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const isCompleted = newStatus === 'COMPLETED';
        return {
          ...o,
          status: newStatus,
          balanceRemaining: isCompleted ? 0 : o.balanceRemaining,
          amountPaidAtDispatch: isCompleted ? o.balanceRemaining : o.amountPaidAtDispatch
        };
      })
    );
  };

  const handleConfirmCancel = async ({ orderId, refundAmount, cancellationFee, cancellationReason }) => {
    try {
      await authFetch(`/orders/${orderId}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ refundAmount, cancellationFee, cancellationReason })
      });
    } catch (err) {
      console.warn('API cancel error', err);
    }

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'CANCELLED',
              balanceRemaining: 0,
              refundAmount,
              cancellationFee,
              cancellationReason
            }
          : o
      )
    );
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      await authFetch(`/orders/${orderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('API delete error', err);
    }
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleRecordPayment = async ({ orderId, amountPaid, discount }) => {
    setOrders((prev) =>
      prev.map((o) => {
        if (o.id !== orderId) return o;
        const updatedPaid = (parseFloat(o.amountPaidAtDispatch) || 0) + amountPaid;
        const balance = Math.max(0, (parseFloat(o.totalAmount) || 0) - (parseFloat(o.advancePaid) || 0) - updatedPaid - discount);
        return {
          ...o,
          amountPaidAtDispatch: updatedPaid,
          discount: discount,
          balanceRemaining: balance
        };
      })
    );
  };

  const handleSaveExpense = async (expensePayload) => {
    try {
      await authFetch('/expenses', {
        method: 'POST',
        body: JSON.stringify(expensePayload)
      });
    } catch (err) {
      console.warn('API expense error', err);
    }
    setExpenses((prev) => [expensePayload, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      <Navbar
        currentUser={currentUser}
        apiOnline={apiOnline}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        availableTabs={availableTabs}
        onOpenTakeOrder={(asCallback) => {
          setIsCallbackLead(asCallback);
          setIsTakeOrderOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogout={() => {
          localStorage.clear();
          window.location.reload();
        }}
      />

      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === 'orders' && (
          <OrderDeskTab
            orders={orders.filter((o) => !o.isCallback)}
            settings={settings}
            onUpdateStatus={handleUpdateStatus}
            onInitiateCancel={(order) => {
              setOrderToCancel(order);
              setIsCancelModalOpen(true);
            }}
            onInitiateDelete={(id) => setDeleteConfirmationId(id)}
          />
        )}

        {activeTab === 'callbacks' && (
          <OrderDeskTab
            orders={orders.filter((o) => o.isCallback || o.status === 'CALLBACK_REQUIRED')}
            settings={settings}
            onUpdateStatus={handleUpdateStatus}
            onInitiateCancel={(order) => {
              setOrderToCancel(order);
              setIsCancelModalOpen(true);
            }}
            onInitiateDelete={(id) => setDeleteConfirmationId(id)}
          />
        )}

        {activeTab === 'kds' && (
          <KitchenKDSTab
            orders={orders}
            menuItems={menuItems}
            onMarkPacked={(id) => handleUpdateStatus(id, 'READY')}
          />
        )}

        {activeTab === 'dispatch' && (
          <DispatchTab
            orders={orders}
            onOpenPaymentModal={(order) => {
              setOrderForPayment(order);
              setIsPaymentModalOpen(true);
            }}
            onUpdateStatus={handleUpdateStatus}
          />
        )}

        {activeTab === 'consolidated' && <ConsolidatedTab orders={orders} />}
        {activeTab === 'crm' && <CRMTab orders={orders} />}
        {activeTab === 'pnl' && <FinancialPnLTab orders={orders} expenses={expenses} />}
        {activeTab === 'expenses' && (
          <ExpensesTab
            expenses={expenses}
            onOpenAddExpense={() => setIsAddExpenseOpen(true)}
          />
        )}
      </main>

      {/* Modals */}
      <TakeOrderModal
        isOpen={isTakeOrderOpen}
        onClose={() => setIsTakeOrderOpen(false)}
        isCallback={isCallbackLead}
        menuItems={menuItems}
        kitchenOutlets={settings.kitchenOutlets}
        existingOrders={orders}
        currentUser={currentUser}
        onSave={handleSaveOrder}
      />

      <CancelModal
        isOpen={isCancelModalOpen}
        onClose={() => {
          setIsCancelModalOpen(false);
          setOrderToCancel(null);
        }}
        order={orderToCancel}
        onConfirm={handleConfirmCancel}
      />

      <RecordPaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => {
          setIsPaymentModalOpen(false);
          setOrderForPayment(null);
        }}
        order={orderForPayment}
        onConfirm={handleRecordPayment}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSave={handleSaveExpense}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={async (newSettings) => {
          setSettings(newSettings);
          await authFetch('/settings', { method: 'POST', body: JSON.stringify(newSettings) });
        }}
      />

      <DeleteConfirmModal
        isOpen={Boolean(deleteConfirmationId)}
        onClose={() => setDeleteConfirmationId(null)}
        orderId={deleteConfirmationId}
        onConfirm={handleDeleteOrder}
      />
    </div>
  );
}