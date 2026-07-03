import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Database Config
import connectDB from '../config/db.js';

// Models
import User from '../models/User.js';
import Doctor from '../models/Doctor.js';
import Medicine from '../models/Medicine.js';
import EmergencyContact from '../models/EmergencyContact.js';
import Blog from '../models/Blog.js';
import LabTest from '../models/LabTest.js';
import Appointment from '../models/Appointment.js';
import Order from '../models/Order.js';
import LabBooking from '../models/LabBooking.js';
import ContactMessage from '../models/ContactMessage.js';

// Seed Datasets
import doctorSeeds from './doctors.js';
import medicineSeeds from './medicines.js';
import blogSeeds from './blogs.js';
import emergencySeeds from './emergency.js';
import labTestSeeds from './labTest.js';

const seedDB = async () => {
  try {
    // 1. Connect to Database
    await connectDB();

    console.log('Clearing existing database collections...');
    // 2. Clear Collections
    await User.deleteMany({});
    await Doctor.deleteMany({});
    await Medicine.deleteMany({});
    await EmergencyContact.deleteMany({});
    await Blog.deleteMany({});
    await LabTest.deleteMany({});
    await Appointment.deleteMany({});
    await Order.deleteMany({});
    await LabBooking.deleteMany({});
    await ContactMessage.deleteMany({});
    console.log('Database cleared.');

    // 3. Hash Passwords and Seed Users
    console.log('Seeding Users...');
    const salt = bcrypt.genSaltSync(10);
    const adminPasswordHash = bcrypt.hashSync('AdminPassword123', salt);
    const patientPasswordHash = bcrypt.hashSync('PatientPassword123', salt);

    const users = await User.insertMany([
      {
        fullName: 'System Admin',
        email: 'admin@healthcare.com',
        phone: '03001234567',
        password: adminPasswordHash,
        role: 'admin',
        isActive: true,
      },
      {
        fullName: 'John Doe',
        email: 'patient@healthcare.com',
        phone: '03007654321',
        password: patientPasswordHash,
        role: 'user',
        isActive: true,
      },
    ]);
    const patientUser = users[1];
    console.log(`Seeded ${users.length} users successfully.`);

    // 4. Seed Doctors
    console.log('Seeding Doctors...');
    
    // Assign dynamic user IDs to reviews if not present
    doctorSeeds.forEach(doctor => {
      if (doctor.reviews) {
        doctor.reviews.forEach(review => {
          if (!review.userId) {
            review.userId = new mongoose.Types.ObjectId();
          }
        });
      }
    });

    const doctors = await Doctor.insertMany(doctorSeeds);
    const cardiologyDoctor = doctors.find(d => d.specialization === 'Cardiology');
    console.log(`Seeded ${doctors.length} doctors successfully.`);

    // 5. Seed Medicines
    console.log('Seeding Medicines...');
    const medicines = await Medicine.insertMany(medicineSeeds);
    const paracetamol = medicines.find(m => m.name === 'Paracetamol');
    console.log(`Seeded ${medicines.length} medicines successfully.`);

    // 6. Seed Blogs
    console.log('Seeding Blogs...');
    const blogs = await Blog.insertMany(blogSeeds);
    console.log(`Seeded ${blogs.length} blogs successfully.`);

    // 7. Seed Emergency Contacts
    console.log('Seeding Emergency Contacts...');
    const emergencyContacts = await EmergencyContact.insertMany(emergencySeeds);
    console.log(`Seeded ${emergencyContacts.length} emergency contacts successfully.`);

    // 8. Seed Lab Tests
    console.log('Seeding Lab Tests...');
    const labTests = await LabTest.insertMany(labTestSeeds);
    const cbcTest = labTests.find(t => t.name.includes('CBC'));
    console.log(`Seeded ${labTests.length} lab tests successfully.`);

    // 9. Seed Mock Appointments (to demonstrate Admin status management)
    console.log('Seeding Mock Appointments...');
    const appointmentDate = new Date();
    appointmentDate.setDate(appointmentDate.getDate() + 2); // 2 days in the future
    
    await Appointment.create({
      doctorId: cardiologyDoctor._id,
      userId: patientUser._id,
      patientName: patientUser.fullName,
      patientAge: 32,
      patientGender: 'Male',
      patientPhone: patientUser.phone,
      reasonForVisit: 'Routine cardiac health checkup and consultation.',
      date: appointmentDate,
      timeSlot: '10:00 AM',
      status: 'pending',
    });
    console.log('Seeded 1 mock appointment.');

    // 10. Seed Mock Orders (to demonstrate Admin order fulfillment)
    console.log('Seeding Mock Orders...');
    const lineTotal = paracetamol.price * 2;
    await Order.create({
      userId: patientUser._id,
      items: [
        {
          medicineId: paracetamol._id,
          name: paracetamol.name,
          unitPrice: paracetamol.price,
          quantity: 2,
          lineTotal: lineTotal,
        }
      ],
      subtotal: lineTotal,
      total: lineTotal,
      billingName: patientUser.fullName,
      billingAddress: 'House 45, Street 12, Sector F-8',
      billingCity: 'Islamabad',
      billingPostalCode: '44000',
      billingPhone: patientUser.phone,
      paymentMethod: 'cod',
      status: 'placed',
    });
    console.log('Seeded 1 mock order.');

    // 11. Seed Mock Lab Bookings
    console.log('Seeding Mock Lab Bookings...');
    const preferredLabDate = new Date();
    preferredLabDate.setDate(preferredLabDate.getDate() + 1); // tomorrow
    await LabBooking.create({
      labTestId: cbcTest._id,
      userId: patientUser._id,
      patientName: patientUser.fullName,
      contactPhone: patientUser.phone,
      preferredDate: preferredLabDate,
      status: 'pending',
    });
    console.log('Seeded 1 mock lab booking.');

    // 12. Seed Mock Contact Messages
    console.log('Seeding Mock Contact Messages...');
    await ContactMessage.create({
      name: 'Alice Johnson',
      email: 'alice.j@example.com',
      subject: 'Lab Test Schedule Availability',
      message: 'Hi, I would like to know if chest X-rays are available on Sundays. Thanks!',
      isRead: false,
    });
    console.log('Seeded 1 mock contact message.');

    console.log('Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDB();
