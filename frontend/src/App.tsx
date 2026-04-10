import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import EventForm from "./components/EventForm";

// Ana uygulama bileşeni
function App() {
  return (
    // Router tüm uygulamayı sarar
    <BrowserRouter>

      {/* Genel sayfa tasarımı */}
      <div
        style={{
          backgroundColor: "#f4f4f4",
          minHeight: "100vh",
          padding: "40px 20px",
          fontFamily: "sans-serif",
        }}
      >

        {/* Üst başlık alanı */}
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            marginBottom: "30px",
            textAlign: "center",
          }}
        >
          {/* Proje başlığı */}
          <h1 style={{ color: "#007BFF" }}>UniSphere</h1>

          {/* Alt açıklama */}
          <p style={{ color: "#555" }}>
            Kampüs Etkinlik Yönetim Sistemi
          </p>
        </div>

        {/* Sayfa yönlendirmeleri burada yapılır */}
        <Routes>

          {/* Ana sayfa -> Dashboard */}
          <Route path="/" element={<Dashboard />} />

          {/* Dashboard sayfası */}
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Etkinlik oluşturma formu */}
          <Route path="/event-create" element={<EventForm />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

// Component dışa aktarılır
export default App;
