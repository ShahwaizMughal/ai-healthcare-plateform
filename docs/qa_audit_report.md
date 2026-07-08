# QA Audit Report - Phase 6: QA Auditing & Test Scenarios

## 1. Testing Strategy & Execution Summary

We have implemented a fully automated integration test suite under a dedicated `server/tests/` directory. The test suite utilizes the native Node.js test runner (`node --test`) and standard assertion module (`node:assert`) to perform end-to-end integration verifications against a dedicated test database environment (`ai-healthcare-test`) running on port `5999`.

### Execution Trace
All 11 integration tests pass cleanly with zero failures:
```
🧪 Starting QA Audit Test Orchestrator...
🌱 Seeding test database...
[Seed] ✅ MongoDB Connected: 127.0.0.1
[Seed] Database cleared.
[Seed] Seeded default users, doctors, medicines, blogs, and transactional logs.
🚀 Spawning Express API server on port 5999...
[Server] Server running on http://localhost:5999
🧪 Executing integration test suite...
TAP version 13
# Subtest: GET /admin/doctors without token returns 401
ok 1 - GET /admin/doctors without token returns 401
# Subtest: GET /admin/doctors with patient token returns 403
ok 2 - GET /admin/doctors with patient token returns 403
# Subtest: Admin login is successful and returns 200
ok 3 - Admin login is successful and returns 200
# Subtest: Retrieve appointments and update status to confirmed
ok 4 - Retrieve appointments and update status to confirmed
# Subtest: Retrieve orders and update status to processing
ok 5 - Retrieve orders and update status to processing
# Subtest: Retrieve lab bookings and update status to cancelled
ok 6 - Retrieve lab bookings and update status to cancelled
# Subtest: Soft-delete doctor verifies isActive is set to false
ok 7 - Soft-delete doctor verifies isActive is set to false
# Subtest: Soft-delete medicine verifies isActive is set to false
ok 8 - Soft-delete medicine verifies isActive is set to false
# Subtest: Create doctor with missing name fails with 400
ok 9 - Create doctor with missing name fails with 400
# Subtest: Create medicine with negative price fails with 400 or 500
ok 10 - Create medicine with negative price fails with 400 or 500
# Subtest: Fetch non-existent doctor with invalid ID returns proper JSON error structure
ok 11 - Fetch non-existent doctor with invalid ID returns proper JSON error structure
1..11
# tests 11
# pass 11
# fail 0
🧹 Tearing down Express server...
```

---

## 2. API Status & Deactivation Endpoints Audit

### Soft-Deactivation Behavior
1. **Doctor Profiles:** Hitting `DELETE /api/admin/doctors/:id` performs a soft-delete by toggling `isActive: false` inside the database instead of removing the record. The profile is filtered out from catalog views but preserved inside historic appointments.
2. **Medicines Catalog:** Hitting `DELETE /api/admin/medicines/:id` performs a soft-delete by toggling `isActive: false`. Historic purchases and orders preserve the reference while hiding the items from current pharmacy purchasing views.
3. **Blog Posts:** Hitting `DELETE /api/admin/blogs/:id` updates the article status to `"draft"`, effectively hiding the blog from the public view.

### Transactional Status Transitions
* **Appointments:** Supported status updates: `pending` -> `confirmed` / `completed` / `cancelled`. Enforces unique slot constraints in database models.
* **Orders:** Status flow: `placed` -> `processing` -> `shipped` -> `delivered` / `cancelled`. Triggers inventory stock checks.
* **Lab Bookings:** Supported states: `pending` -> `confirmed` -> `completed` / `cancelled`.

---

## 3. Boundary / Error-Handling Verification

* **Input Length & Boundaries:** Forms validate qualification and biography lengths (biographies > 20 characters), prices and stock counts (non-negative constraints), and consultation fees (> $0).
* **Missing Fields:** Endpoints validate body content and reject missing mandatory fields (e.g. creating doctors without names returns `400 Bad Request`).
* **Global Error Catching:** Route fetches with invalid mongoose `ObjectId` keys are trapped by Express global error middleware. It responds with proper JSON error packets:
  ```json
  {
    "message": "Cast to ObjectId failed for value \"invalid-object-id\"..."
  }
  ```
  This prevents raw node stack traces from leaking to public clients.

---

## 4. Connection Resilience & Database Drop Verification

We simulated database drop limits and backend network failures to evaluate the UI's resilience.

### Simulation Scenarios
1. **Scenario A (Database Offline):** Stopping the local MongoDB service.
2. **Scenario B (Server Network Timeouts):** Injecting high latencies and connection resets on backend ports.

### Client Resilience Results
* All CRUD tables and dashboard widgets automatically catch network failure parameters.
* Interactive tables display the custom `ErrorState` fallback page instead of freezing, breaking layout styling, or showing empty components:
  > **Connection Failure**
  > "Could not connect to the database server. Please check your network connection and verify if the service is running."
* Banners include a **"Try Again"** button which resets error parameters and triggers a fresh fetch query once clicked.
