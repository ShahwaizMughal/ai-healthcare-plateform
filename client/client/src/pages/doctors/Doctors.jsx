import React, { useState } from 'react';

function DoctorsList() {
  // 🔴 STEP 2: States aur Filter Logic yahan paste ho gayi hai!
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');

  // Sample Doctors Data (Agar aapka data backend se aa raha hai toh ye array wahan automatic handle ho jayega)
  const doctors = [
    { id: 1, name: "Dr. Sarah Khan", specialty: "Cardiologist", experience: "10 Years", fees: "Rs. 2000" },
    { id: 2, name: "Dr. Ali Ahmed", specialty: "Dermatologist", experience: "8 Years", fees: "Rs. 1500" },
    { id: 3, name: "Dr. Zainab Bilal", specialty: "Pediatrician", experience: "5 Years", fees: "Rs. 1200" }
  ];

  // Input filter logic
  const filteredDoctors = doctors.filter(doctor => {
    const matchesName = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty === "" || doctor.specialty === selectedSpecialty;
    return matchesName && matchesSpecialty;
  });

  return (
    <div style={{ marginTop: '20px' }}>
      <h2>Find a Doctor</h2>
      
      {/* Inputs Section */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Search doctor by name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px', width: '250px', borderRadius: '4px', border: '1px solid #ccc' }}
        />

        <select 
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          <option value="">All Specialties</option>
          <option value="Cardiologist">Cardiologist</option>
          <option value="Dermatologist">Dermatologist</option>
          <option value="Pediatrician">Pediatrician</option>
        </select>
      </div>

      {/* Grid of Doctor Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {filteredDoctors.map(doctor => (
          <div key={doctor.id} style={{ border: '1px solid #e5e7eb', padding: '20px', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ margin: '0 0 10px 0' }}>{doctor.name}</h3>
            <p style={{ margin: '5px 0' }}><strong>Specialty:</strong> {doctor.specialty}</p>
            <p style={{ margin: '5px 0' }}><strong>Experience:</strong> {doctor.experience}</p>
            <p style={{ margin: '5px 0' }}><strong>Fees:</strong> {doctor.fees}</p>
            <button style={{ marginTop: '15px', width: '100%', padding: '10px', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Book Appointment
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DoctorsList;
