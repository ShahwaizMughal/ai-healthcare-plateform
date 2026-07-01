export default function LabTestCard({ test, onBook }) {
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md hover:-translate-y-1 transition p-5 flex flex-col gap-2">
      <span className="self-start text-xs font-semibold text-white bg-[#0E7C86] rounded-full px-3 py-0.5">
        {test.category}
      </span>
      <h3 className="font-semibold text-lg text-gray-900">{test.name}</h3>
      {test.description && <p className="text-sm text-gray-500">{test.description}</p>}
      <p className="font-semibold text-gray-900">Rs. {test.price}</p>
      <button
        type="button"
        onClick={() => onBook(test)}
        className="mt-2 min-h-[44px] rounded-lg bg-[#0E7C86] hover:bg-[#0A5C63] text-white font-semibold transition"
      >
        Book Test
      </button>
    </div>
  );
}
