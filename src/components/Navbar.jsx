import React from 'react';

export default function Navbar({
  currentUser,
  apiOnline,
  activeTab,
  setActiveTab,
  availableTabs,
  onOpenTakeOrder,
  onOpenSettings,
  onLogout
}) {
  return (
    <>
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-40 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-black text-xl shadow-inner">
            Ψ
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-amber-400 flex items-center gap-2">
              AL-MANDI OPSDESK PRO
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                apiOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
              }`}>
                {apiOnline ? 'API LIVE' : 'CLIENT MODE'}
              </span>
            </h1>
            <p className="text-xs text-slate-400 font-medium">Authentic Mutton & Chicken Pre-Booking Operations</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {currentUser?.role !== 'kitchen' && currentUser?.role !== 'delivery' && (
            <>
              <button
                onClick={() => onOpenTakeOrder(false)}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-lg text-sm flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
              >
                <span className="text-lg leading-none">+</span> Take Order
              </button>
              <button
                onClick={() => onOpenTakeOrder(true)}
                className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 font-semibold px-3.5 py-2 rounded-lg text-sm flex items-center gap-2 transition-all active:scale-95"
              >
                📞 Callback Lead
              </button>
            </>
          )}

          {['superadmin', 'admin'].includes(currentUser?.role) && (
            <button
              onClick={onOpenSettings}
              className="p-2 text-slate-400 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 border border-slate-700 rounded-lg transition-all"
              title="Settings"
            >
              ⚙️️
            </button>
          )}

          <div className="flex items-center gap-3 pl-3 border-l border-slate-800 text-xs">
            <div className="text-right">
              <div className="font-semibold text-slate-200 capitalize">{currentUser?.username}</div>
              <div className="text-slate-500 uppercase tracking-wider text-[10px]">{currentUser?.role}</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-slate-400 hover:text-rose-400 transition-all"
              title="Logout"
            >
              ⎋
            </button>
          </div>
        </div>
      </header>

      <nav className="bg-slate-900/60 border-b border-slate-800 px-6 overflow-x-auto flex space-x-1 backdrop-blur-sm">
        {availableTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold tracking-wide uppercase whitespace-nowrap transition-all border-b-2 flex items-center gap-2 ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  );
}