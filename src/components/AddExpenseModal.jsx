import React, { useState } from 'react';

export default function AddExpenseModal({ isOpen, onClose, onSave }) {
  const [formData, setFormData] = useState({
    category: 'SHOP',
    title: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      category: formData.category,
      title: formData.title,
      amount: parseFloat(formData.amount) || 0,
      date: formData.date,
      notes: formData.notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-amber-400">Record Shop Expense or Wage</h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Expense Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 mt-1"
            >
              <option value="SHOP">Shop Utilities & Overheads (Water, Electric, Rent, Fuel)</option>
              <option value="WAGE">Staff Wages & Daily Labor</option>
              <option value="RAW_MATERIAL">Kitchen Raw Material (Mutton, Rice, Spices)</option>
            </select>
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase text-slate-400">Expense Title / Description</label>
            <input
              type="text"
              required
              placeholder="e.g. KSEB Electricity Bill, Water Tanker"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 mt-1"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Amount (₹)</label>
              <input
                type="number"
                required
                placeholder="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 mt-1 font-mono text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold uppercase text-slate-400">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-slate-400">
              Cancel
            </button>
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-5 py-2 rounded-xl uppercase text-xs"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}