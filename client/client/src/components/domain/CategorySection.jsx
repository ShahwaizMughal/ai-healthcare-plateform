import EmergencyContactCard from './EmergencyContactCard';

export default function CategorySection({ category, contacts }) {
  return (
    <section className="mb-8">
      <h2 className="font-semibold text-xl text-[#0A5C63] mb-3">{category}</h2>
      <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {contacts.map((c) => (
          <EmergencyContactCard key={c._id} contact={c} />
        ))}
      </div>
    </section>
  );
}
