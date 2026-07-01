import api from './api';

export const getEmergencyContacts = () =>
  api.get('/emergency-contacts').then((res) => res.data.data.contacts);
