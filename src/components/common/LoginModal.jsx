import React, { useState } from 'react';
import { Flame, User, Lock } from 'lucide-react';

export default function LoginModal({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-500/30 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="text-center mb-6">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-slate-950 mb-3 shadow-lg shadow-amber-500/20">
            <Flame className="w-8 h-8 stroke-[2.5]" />
          </div>
          <h1 className="text-2xl font-black tracking-wider text-amber-400 font-serif">ALBUYBA AUTHENTIC MANDI</h1>
          <p className="text-xs text-neutral-400 mt-1">Pre-Booking Operations & KDS Desk</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">Username</label>
            <div className="relative">
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username (e.g. superadmin, orders)"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password (default: 123)"
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
  );
}
