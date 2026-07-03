import { useEffect, useState } from 'react';
import { getEmergencyContacts } from '../../services/emergencyService';
import CategorySection from '../../components/domain/CategorySection';

// Hardcoded fallback — this page must NEVER fail to display (SRS Section 3.6:
// "must degrade gracefully... since this content must never fail to display
// (safety-critical)"). Update these with real numbers before deploy.
const FALLBACK_CONTACTS = {
  Ambulance: [{ _id: 'fallback-amb', name: 'Ambulance Service', phoneNumber: '1122', address: '' }],
  'Blood Bank': [{ _id: 'fallback-bb', name: 'Blood Bank', phoneNumber: '051-1234567', address: '' }],
  Hospital: [{ _id: 'fallback-hosp', name: 'Emergency Hospital', phoneNumber: '051-7654321', address: '' }],
  Police: [{ _id: 'fallback-police', name: 'Police', phoneNumber: '15', address: '' }],
};

export default function Emergency() {
  const [grouped, setGrouped] = useState(null);

  useEffect(() => {
    let isMounted = true;
    getEmergencyContacts()
      .then((data) => {
        if (isMounted) setGrouped(data);
      })
      .catch(() => {
        // Never show an error state here — fall back silently.
        if (isMounted) setGrouped(FALLBACK_CONTACTS);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const dataToRender = grouped || FALLBACK_CONTACTS; // covers the "still loading" case too

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-8">
      <h1 className="font-bold text-3xl text-gray-900">Emergency Contacts</h1>
      <p className="text-gray-500 mb-6">Tap any number to call immediately. No login required.</p>

      {Object.entries(dataToRender).map(([category, contacts]) => (
        <CategorySection key={category} category={category} contacts={contacts} />
      ))}
    </main>
  );
}
