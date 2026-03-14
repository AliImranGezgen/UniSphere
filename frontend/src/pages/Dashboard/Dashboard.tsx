import { useEffect, useState } from "react"
import { getEvents, deleteEvent } from "../../services/eventService"
import type { Event } from "../../types/event"
import EventCard from "../../components/EventCard" // EventCard componentini kullanıyoruz

// Kulüp yöneticisinin etkinliklerini gösteren dashboard sayfası
function Dashboard() {

  // Etkinlik listesini tutan state
  const [events, setEvents] = useState<Event[]>([])

  // Bir etkinliği silmek için kullanılan fonksiyon
  const handleDelete = async (id: number) => {
    await deleteEvent(id)

    // Silme işleminden sonra etkinlikleri tekrar çekiyoruz
    const data = await getEvents()
    setEvents(data)
  }

  // Bir etkinliği düzenlemek için kullanılacak fonksiyon
const handleEdit = (event: Event) => {
  console.log("Edit event:", event)

  // Backend hazır olunca burada update işlemi yapılacak
}

  // Sayfa ilk açıldığında etkinlikleri backend'den çekiyoruz
  useEffect(() => {
    const loadEvents = async () => {
      const data = await getEvents()
      setEvents(data)
    }

    loadEvents()
  }, [])

  return (
    <div>
      {/* Dashboard başlığı */}
      <h1>Club Dashboard</h1>

      {/* Etkinlik yoksa mesaj göster */}
      {events.length === 0 && <p>No events yet</p>}

      {/* Etkinlikleri listeleme */}
      {events.map(event => (
        <EventCard
          key={event.id}
          event={event}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      ))}
    </div>
  )
}

export default Dashboard