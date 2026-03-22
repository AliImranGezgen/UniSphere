import React from 'react';
import EventForm from './components/EventForm';

function App() {
  return (
    <div style={{ backgroundColor: '#f4f4f4', minHeight: '100vh', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      
      {/* Hocanın göreceği şık bir başlık */}
      <div style={{ maxWidth: '600px', margin: '0 auto', marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ color: '#007BFF', marginBottom: '10px' }}>UniSphere</h1>
        <p style={{ color: '#555', fontSize: '18px' }}>Kampüs Etkinlik Yönetim Sistemi</p>
      </div>

      {/* Formumuzu (Yeni Kayıt modunda) ekrana basıyoruz */}
      <EventForm />
      
    </div>
  );
}

export default App;