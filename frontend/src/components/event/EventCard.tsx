
import type { Event } from '../../types/event';

export default function EventCard({ event }: { event: Event }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: 15, borderRadius: 5, marginBottom: 10 }}>
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <small>{event.location} - {event.date}</small>
    </div>
  );
}
