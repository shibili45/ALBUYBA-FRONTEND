import React, { useState } from 'react';

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  const [formData, setFormData] = useState(settings);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl p-6 space-y-4 my-8">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-amber-400">⚙️ Outlet & Helpline Settings</h3>
          <button onClick={onClose} className="text-slate-400 text-lg">✕</button>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Customer Care Phone</label>
              <input
                type="text"
                value={formData.customerCareContact}
                onChange={(e) => setFormData({ ...formData, customerCareContact: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 mt-1 font-mono"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Delivery Helpline</label>
              <input
                type="text"
                value={formData.deliveryHelpline}
                onChange={(e) => setFormData({ ...formData, deliveryHelpline: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 mt-1 font-mono"
              />
            </div>
          </div>

          <div className="border border-slate-800 p-4 rounded-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Configured Outlets</span>
            {formData.kitchenOutlets.map((out) => (
              <div key={out.id} className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs space-y-1">
                <div className="font-bold text-amber-400">{out.name}</div>
                <div className="text-slate-400">{out.address}</div>
                <div className="text-sky-400 truncate text-[10px]">{out.mapsUrl}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-3">
          <button
            onClick={() => {
              onSave(formData);
              onClose();
            }}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl text-xs uppercase"
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}