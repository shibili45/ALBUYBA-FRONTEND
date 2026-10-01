export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api').replace(/\/+$/, '');

export const DEFAULT_MENU = [
  { id: 'item-1', name: 'Mutton Mandi', category: 'MANDI', pricePerUnit: 1800, unit: 'KG' },
  { id: 'item-2', name: 'Chicken Mandi', category: 'MANDI', pricePerUnit: 480, unit: 'Full' },
  { id: 'item-3', name: 'Chicken Mandi (Half)', category: 'MANDI', pricePerUnit: 260, unit: 'Half' },
  { id: 'item-4', name: 'Mutton Madfoon', category: 'MADFOON', pricePerUnit: 2200, unit: 'KG' },
  { id: 'item-5', name: 'Mandi Rice Special', category: 'SIDES', pricePerUnit: 350, unit: 'KG' }
];

export const DEFAULT_SETTINGS = {
  customerCareContact: '+91 98451 99221',
  deliveryHelpline: '+91 98451 99222',
  upiId: 'mandiops@icici',
  kitchenOutlets: [
    {
      id: 'out-1',
      name: 'Main Kitchen - Indiranagar',
      address: '100ft Road, Indiranagar, Bengaluru, 560038',
      mapsUrl: 'https://maps.google.com/?q=Indiranagar+Bengaluru'
    },
    {
      id: 'out-2',
      name: 'Cloud Kitchen - Cherpulassery',
      address: 'Near Bypass Junction, Cherpulassery, Kerala, 679503',
      mapsUrl: 'https://maps.app.goo.gl/roY2DTRQSFzG638TA'
    }
  ]
};