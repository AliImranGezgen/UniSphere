import EventForm from './components/EventForm';

function App() {
  // Diyelim ki kullanıcı "Düzenle" butonuna bastı ve veritabanından bu veriler geldi:
  const sahteEskiVeri = {
    id: 99,
    title: "Eski UniSphere Toplantısı",
    description: "Bu etkinlik geçen aydan kaldı, lütfen güncelleyin.",
    date: "2026-04-10T14:30",
    location: "Merkez Kütüphane",
    clubId: "5"
  };

  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '20px' }}>
      
      {/* Formu GÜNCELLEME (Edit) Modunda çağırıyoruz. İçine veriyi yolladık! */}
      <EventForm initialData={sahteEskiVeri} />
      
    </div>
  );
}

export default App;