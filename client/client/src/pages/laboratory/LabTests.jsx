import { useEffect, useState } from 'react';
import { getLabTests } from '../../services/labService';
import LabTestCard from '../../components/domain/LabTestCard';
import BookingModal from '../../components/domain/BookingModal';

export default function LabTests() {
  const [tests, setTests] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | error | success
  const [selectedTest, setSelectedTest] = useState(null);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setStatus('loading');
    getLabTests({ page: 1, limit: 20 })
      .then((data) => {
        if (!isMounted) return;
        setTests(data.items);
        setStatus('success');
      })
      .catch(() => {
        if (isMounted) setStatus('error');
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleBookingSuccess = (booking) => {
    setSelectedTest(null);
    setConfirmedBooking(booking);
  };

  return (
    <main className="max-w-[1100px] mx-auto px-5 py-8">
      <h1 className="font-bold text-3xl text-gray-900">Lab Tests</h1>
      <p className="text-gray-500 mb-6">Browse available tests and book a slot — no account required.</p>

      {confirmedBooking && (
        <div className="bg-white rounded-xl border-l-4 border-[#3CA66B] shadow-sm p-4 mb-6">
          <strong>Booking request received.</strong> We&apos;ll confirm your appointment for{' '}
          {confirmedBooking.preferredDate?.slice(0, 10)} shortly.
        </div>
      )}

      {status === 'loading' && (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-36 rounded-xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      )}

      {status === 'error' && (
        <div className="text-center text-gray-500 py-10">
          Couldn&apos;t load lab tests right now. Please refresh the page.
        </div>
      )}

      {status === 'success' && tests.length === 0 && (
        <div className="text-center text-gray-500 py-10">No lab tests are available yet.</div>
      )}

      {status === 'success' && tests.length > 0 && (
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
          {tests.map((test) => (
            <LabTestCard key={test._id} test={test} onBook={setSelectedTest} />
          ))}
        </div>
      )}

      {selectedTest && (
        <BookingModal
          test={selectedTest}
          onClose={() => setSelectedTest(null)}
          onSuccess={handleBookingSuccess}
        />
      )}
    </main>
  );
}
