const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const api = {
  getMenu: () => fetch(`${BASE_URL}/menu`).then(r => r.json()),
  saveMenuItem: (item, id) => fetch(id ? `${BASE_URL}/menu/${id}` : `${BASE_URL}/menu`, {
    method: id ? 'PUT' : 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  }).then(r => r.json()),
  deleteMenuItem: (id) => fetch(`${BASE_URL}/menu/${id}`, { method: 'DELETE' }),

  getOrders: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return fetch(`${BASE_URL}/orders?${q}`).then(r => r.json());
  },
  createOrder: (order) => fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order)
  }).then(r => r.json()),
  updateStatus: (id, status) => fetch(`${BASE_URL}/orders/${id}/status?status=${status}`, { method: 'PATCH' }),
  updateWeight: (id, actualKg, recalc = true) => fetch(`${BASE_URL}/orders/${id}/weight`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ actualKg, recalculateBill: recalc })
  }).then(r => r.json()),
  auditPayment: (id, payload) => fetch(`${BASE_URL}/orders/${id}/audit`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  }).then(r => r.json()),

  getExpenses: (date) => fetch(`${BASE_URL}/expenses${date ? `?date=${date}` : ''}`).then(r => r.json()),
  addExpense: (exp) => fetch(`${BASE_URL}/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(exp)
  }).then(r => r.json()),
  deleteExpense: (id) => fetch(`${BASE_URL}/expenses/${id}`, { method: 'DELETE' }),

  getSettings: () => fetch(`${BASE_URL}/settings`).then(r => r.json()),
  saveSettings: (s) => fetch(`${BASE_URL}/settings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(s)
  }),

  login: (username, password) => fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  }).then(r => {
    if (!r.ok) throw new Error('Invalid credentials');
    return r.json();
  })
};