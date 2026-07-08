import test from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://localhost:5999/api';

async function getAdminToken() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@healthcare.com',
      password: 'AdminPassword123'
    })
  });
  const data = await res.json();
  return data.token;
}

async function getPatientToken() {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'patient@healthcare.com',
      password: 'PatientPassword123'
    })
  });
  const data = await res.json();
  return data.token;
}

// Auth Guard checks
test('GET /admin/doctors without token returns 401', async () => {
  const res = await fetch(`${BASE_URL}/admin/doctors`);
  assert.strictEqual(res.status, 401);
  const data = await res.json();
  assert.ok(data.message.includes('No token provided'));
});

test('GET /admin/doctors with patient token returns 403', async () => {
  const token = await getPatientToken();
  const res = await fetch(`${BASE_URL}/admin/doctors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(res.status, 403);
  const data = await res.json();
  assert.ok(data.message.includes('Access denied'));
});

test('Admin login is successful and returns 200', async () => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@healthcare.com',
      password: 'AdminPassword123'
    })
  });
  assert.strictEqual(res.status, 200);
  const data = await res.json();
  assert.strictEqual(data.success, true);
  assert.ok(data.token);
  assert.strictEqual(data.user.role, 'admin');
});

// Admin API status changes
test('Retrieve appointments and update status to confirmed', async () => {
  const token = await getAdminToken();
  
  // 1. Get appointments list
  const listRes = await fetch(`${BASE_URL}/admin/appointments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(listData.data.items.length > 0);
  const appointment = listData.data.items[0];
  assert.strictEqual(appointment.status, 'pending');

  // 2. Update status to confirmed
  const updateRes = await fetch(`${BASE_URL}/admin/appointments/${appointment._id}/status`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'confirmed' })
  });
  assert.strictEqual(updateRes.status, 200);

  // 3. Verify status
  const verifyRes = await fetch(`${BASE_URL}/admin/appointments`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();
  const updatedAppointment = verifyData.data.items.find(a => a._id === appointment._id);
  assert.strictEqual(updatedAppointment.status, 'confirmed');
});

test('Retrieve orders and update status to processing', async () => {
  const token = await getAdminToken();
  
  // 1. Get orders list
  const listRes = await fetch(`${BASE_URL}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(listData.data.items.length > 0);
  const order = listData.data.items[0];
  assert.strictEqual(order.status, 'placed');

  // 2. Update status to processing
  const updateRes = await fetch(`${BASE_URL}/admin/orders/${order._id}/status`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'processing' })
  });
  assert.strictEqual(updateRes.status, 200);

  // 3. Verify status
  const verifyRes = await fetch(`${BASE_URL}/admin/orders`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();
  const updatedOrder = verifyData.data.items.find(o => o._id === order._id);
  assert.strictEqual(updatedOrder.status, 'processing');
});

test('Retrieve lab bookings and update status to cancelled', async () => {
  const token = await getAdminToken();
  
  // 1. Get lab bookings list
  const listRes = await fetch(`${BASE_URL}/admin/lab-bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(listRes.status, 200);
  const listData = await listRes.json();
  assert.ok(listData.data.items.length > 0);
  const booking = listData.data.items[0];
  assert.strictEqual(booking.status, 'pending');

  // 2. Update status to cancelled
  const updateRes = await fetch(`${BASE_URL}/admin/lab-bookings/${booking._id}/status`, {
    method: 'PATCH',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ status: 'cancelled' })
  });
  assert.strictEqual(updateRes.status, 200);

  // 3. Verify status
  const verifyRes = await fetch(`${BASE_URL}/admin/lab-bookings`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();
  const updatedBooking = verifyData.data.items.find(b => b._id === booking._id);
  assert.strictEqual(updatedBooking.status, 'cancelled');
});

// Regression deactivation checks
test('Soft-delete doctor verifies isActive is set to false', async () => {
  const token = await getAdminToken();
  
  // 1. Get doctors list
  const listRes = await fetch(`${BASE_URL}/admin/doctors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const listData = await listRes.json();
  const doctor = listData.data.items[0];
  assert.strictEqual(doctor.isActive, true);

  // 2. Soft delete doctor
  const deleteRes = await fetch(`${BASE_URL}/admin/doctors/${doctor._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(deleteRes.status, 200);

  // 3. Verify in database
  const verifyRes = await fetch(`${BASE_URL}/admin/doctors`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();
  const updatedDoctor = verifyData.data.items.find(d => d._id === doctor._id);
  assert.strictEqual(updatedDoctor.isActive, false);
});

test('Soft-delete medicine verifies isActive is set to false', async () => {
  const token = await getAdminToken();
  
  // 1. Get medicines list
  const listRes = await fetch(`${BASE_URL}/admin/medicines`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const listData = await listRes.json();
  const medicine = listData.data.items[0];
  assert.strictEqual(medicine.isActive, true);

  // 2. Soft delete medicine
  const deleteRes = await fetch(`${BASE_URL}/admin/medicines/${medicine._id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.strictEqual(deleteRes.status, 200);

  // 3. Verify in database
  const verifyRes = await fetch(`${BASE_URL}/admin/medicines`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const verifyData = await verifyRes.json();
  const updatedMedicine = verifyData.data.items.find(m => m._id === medicine._id);
  assert.strictEqual(updatedMedicine.isActive, false);
});

// Boundary checks
test('Create doctor with missing name fails with 400', async () => {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/doctors`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      specialization: 'Cardiology',
      qualification: 'MD',
      experienceYears: 5,
      consultationFee: 150
    })
  });
  assert.strictEqual(res.status, 400);
});

test('Create medicine with negative price fails with 400 or 500', async () => {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/medicines`, {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: 'Ibuprofen',
      description: 'Pain reliever',
      dosage: '400mg',
      category: 'Cold & Flu',
      price: -5,
      imageUrl: 'https://example.com/ibuprofen.jpg',
      stockQuantity: 100,
      requiresPrescription: false
    })
  });
  assert.ok(res.status >= 400);
});

test('Fetch non-existent doctor with invalid ID returns proper JSON error structure', async () => {
  const token = await getAdminToken();
  const res = await fetch(`${BASE_URL}/admin/doctors/invalid-object-id`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  assert.ok(res.status >= 400);
  const data = await res.json();
  assert.ok(data.message);
});
