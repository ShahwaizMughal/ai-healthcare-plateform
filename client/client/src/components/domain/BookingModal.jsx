import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { createLabBooking } from '../../services/labService';

// Lightweight modal per the SRS (Section 3.5) — no full detail page needed.
export default function BookingModal({ test, onClose, onSuccess }) {
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const today = new Date().toISOString().split('T')[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { patientName: '', contactPhone: '', preferredDate: '' } });

  const onSubmit = async (form) => {
    setSubmitError('');
    setSubmitting(true);
    try {
      const booking = await createLabBooking({ labTestId: test._id, ...form });
      toast.success('Booking request received!');
      onSuccess(booking);
    } catch (err) {
      setSubmitError(err?.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-[min(90vw,420px)] rounded-xl bg-white p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-semibold text-lg mb-4">Book: {test.name}</h3>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label htmlFor="patientName" className="block text-sm font-semibold mb-1">
              Full name
            </label>
            <input
              id="patientName"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]"
              {...register('patientName', { required: 'Name is required.' })}
            />
            {errors.patientName && (
              <p className="text-[#D64550] text-sm mt-1">{errors.patientName.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="contactPhone" className="block text-sm font-semibold mb-1">
              Contact phone
            </label>
            <input
              id="contactPhone"
              inputMode="numeric"
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]"
              {...register('contactPhone', {
                required: 'Phone number is required.',
                pattern: { value: /^\d{10,15}$/, message: 'Enter a valid phone number (10-15 digits).' },
              })}
            />
            {errors.contactPhone && (
              <p className="text-[#D64550] text-sm mt-1">{errors.contactPhone.message}</p>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="preferredDate" className="block text-sm font-semibold mb-1">
              Preferred date
            </label>
            <input
              id="preferredDate"
              type="date"
              min={today}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 focus:border-[#0E7C86]"
              {...register('preferredDate', {
                required: 'Please choose a date.',
                validate: (v) => v >= today || 'Date cannot be in the past.',
              })}
            />
            {errors.preferredDate && (
              <p className="text-[#D64550] text-sm mt-1">{errors.preferredDate.message}</p>
            )}
          </div>

          {submitError && <p className="text-[#D64550] text-sm mb-3">{submitError}</p>}

          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="text-gray-500 font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="min-h-[44px] rounded-lg bg-[#0E7C86] hover:bg-[#0A5C63] disabled:opacity-60 text-white font-semibold px-5"
            >
              {submitting ? 'Booking…' : 'Confirm Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
