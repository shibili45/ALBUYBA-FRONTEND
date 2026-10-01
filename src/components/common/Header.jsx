import React from 'react';
import { Utensils, PhoneCall, PhoneForwarded, Plus, Settings, LogOut } from 'lucide-react';
import { ROLE_TABS, TAB_META } from '../../constants/roles';

export default function Header({
  currentUser,
  isBackendConnected,
  activeTab,
  setActiveTab,
  onOpenOrderModal,
  onOpenMenuModal,
  onOpenSettingsModal,
  onLogout
}) {
  const permittedTabs = currentUser ? (ROLE_TABS[currentUser.role] || ['orders']) : [];

  return (
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

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenOrderModal(false)}
            className="px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 text-slate-950 rounded-xl shadow-lg flex items-center gap-1.5 transition"
          >
            <PhoneCall className="w-3.5 h-3.5" />
            <span>+ Take Order</span>
          </button>
          <button
            onClick={() => onOpenOrderModal(true)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 rounded-xl flex items-center gap-1.5"
          >
            <PhoneForwarded className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Callback Lead</span>
          </button>
          {(currentUser?.role === 'superadmin' || currentUser?.role === 'admin') && (
            <>
              <button
                onClick={onOpenMenuModal}
                className="px-3 py-1.5 text-xs font-bold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span className="hidden md:inline">+ Add Menu Item</span>
              </button>
              <button
                onClick={onOpenSettingsModal}
                className="p-2 text-neutral-400 hover:text-amber-400 bg-slate-800 rounded-xl border border-neutral-700"
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
              onClick={onLogout}
              className="p-2 bg-slate-800 hover:bg-rose-500/20 text-neutral-400 hover:text-rose-400 rounded-xl border border-neutral-700"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

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
  );
}
