// Assumes M1 publishes a shared axios instance as the default export of
// ./api.js (baseURL = import.meta.env.VITE_API_BASE_URL). That file is
// still empty as of this commit — this will work as soon as it's filled in.
import api from './api';

export const getLabTests = (params = {}) =>
  api.get('/lab-tests', { params }).then((res) => res.data.data);

export const createLabBooking = (payload) =>
  api.post('/lab-bookings', payload).then((res) => res.data.data.labBooking);
