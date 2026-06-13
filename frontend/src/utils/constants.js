export const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
export const ROLES = { USER: 'user', ADMIN: 'admin' };
export const CATEGORIES = [
  'Civil Procedure',
  'Criminal Procedure',
  'Family Law',
  'Evidence Law',
  'Criminal Law',
  'Motor Vehicles Law',
  'Commercial Law',
  'Constitutional'
];
export const COURTS = ['Supreme Court', 'High Court', 'Sessions Court', 'Magistrate Court'];
export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];
