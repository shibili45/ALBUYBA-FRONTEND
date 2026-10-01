import React from 'react';

export default function ExpensesTab({ expenses, onOpenAddExpense }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-100">Shop Overheads, Wages & Utilities</h2>
        <button
          onClick={onOpenAddExpense}
          className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs shadow-lg transition-all"
        >
          + Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {['SHOP', 'WAGE', 'RAW_MATERIAL'].map((cat) => {
          const catExpenses = expenses.filter((e) => e.category === cat);
          const catTotal = catExpenses.reduce((s, e) => s + (parseFloat(e.amount) || 0), 0);

          return (
            <div key={cat} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <h3 className="font-bold text-slate-200 text-sm">
                  {cat === 'SHOP' ? 'Shop Utilities & Overheads' : cat === 'WAGE' ? 'Staff Wages' : 'Kitchen Raw Material'}
                </h3>
                <span className="font-mono font-bold text-rose-400 text-sm">₹{catTotal}</span>
              </div>

              <div className="space-y-2">
                {catExpenses.length === 0 ? (
                  <div className="text-xs text-slate-500 italic py-2">No expenses recorded.</div>
                ) : (
                  catExpenses.map((e, idx) => (
                    <div key={idx} className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs flex justify-between">
                      <div>
                        <div className="font-semibold text-slate-200">{e.title}</div>
                        <div className="text-[10px] text-slate-500">{e.date}</div>
                      </div>
                      <div className="font-mono text-rose-400 font-bold">₹{e.amount}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}