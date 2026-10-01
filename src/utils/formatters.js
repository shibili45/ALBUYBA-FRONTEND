export const formatKg = (val) => {
  if (val === null || val === undefined || isNaN(val)) return '0.000 kg';
  return `${parseFloat(val).toFixed(3)} kg`;
};

export const formatCurrency = (val) => `₹${Math.round(val || 0).toLocaleString('en-IN')}`;

export const sanitizePhone = (phoneStr) => {
  if (!phoneStr) return '';
  return phoneStr.toString().replace(/\D/g, '').slice(-10);
};
