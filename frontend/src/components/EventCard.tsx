import type { Event } from "../types/event"

// Component'e gönderilecek props
interface Props {
  event: Event
  onDelete: (id: number) => void
  onEdit: (event: Event) => void // Event düzenleme fonksiyonu
}

// Tek bir etkinliği kart şeklinde gösteren component
function EventCard({ event, onDelete, onEdit }: Props) {
  return (
    <div className="event-card">
      {/* Etkinlik başlığı */}
      <h3>{event.title}</h3>

      {/* Açıklama */}
      <p>{event.description}</p>

      {/* Lokasyon */}
      <p>{event.location}</p>

      {/* Tarih */}
      <p>{event.date}</p>

      {/* Düzenleme butonu */}
      <button onClick={() => onEdit(event)}>
        Edit
      </button>

      {/* Silme butonu */}
      <button onClick={() => onDelete(event.id)}>
        Delete
      </button>
    </div>
  )
}

export default EventCard