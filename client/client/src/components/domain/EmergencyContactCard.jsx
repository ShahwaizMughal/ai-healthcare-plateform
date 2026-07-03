export default function EmergencyContactCard({ contact }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex flex-col gap-1">
      <h3 className="font-semibold text-lg text-gray-900">{contact.name}</h3>
      {contact.address && <p className="text-sm text-gray-500">{contact.address}</p>}
      <a
        href={`tel:${contact.phoneNumber}`}
        className="mt-2 text-lg font-semibold text-[#D64550] hover:underline"
      >
        📞 {contact.phoneNumber}
      </a>
    </div>
  );
}
