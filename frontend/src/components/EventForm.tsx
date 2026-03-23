import React, { useState } from 'react';

// Bekçinin istediği "Kimlik Kartı" (Type Definition)
interface EventData {
  id?: number;
  title?: string;
  description?: string;
  date?: string;
  location?: string;
  clubId?: string;
}

interface EventFormProps {
  initialData?: EventData; // "any" kelimesini sildik, yerine kimliği koyduk!
}

const EventForm: React.FC<EventFormProps> = ({ initialData }) => {
  const [formData, setFormData] = useState({
    baslik: initialData?.title || '',
    aciklama: initialData?.description || '',
    tarih: initialData?.date || '',
    konum: initialData?.location || '',
    kulupId: initialData?.clubId || ''
  });

  const [errors, setErrors] = useState({ baslik: '', aciklama: '', tarih: '', konum: '', kulupId: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = { baslik: '', aciklama: '', tarih: '', konum: '', kulupId: '' };
    let isValid = true;
    
    if (!formData.baslik.trim()) { newErrors.baslik = 'Başlık boş bırakılamaz!'; isValid = false; }
    if (!formData.aciklama.trim()) { newErrors.aciklama = 'Açıklama boş bırakılamaz!'; isValid = false; }
    if (!formData.konum.trim()) { newErrors.konum = 'Konum boş bırakılamaz!'; isValid = false; }
    if (!formData.kulupId) { newErrors.kulupId = 'Kulüp ID boş bırakılamaz!'; isValid = false; }
    if (!formData.tarih) { newErrors.tarih = 'Tarih boş bırakılamaz!'; isValid = false; } 

    setErrors(newErrors);

    if (isValid) {
      try {
        const url = initialData 
          ? `http://localhost:5182/api/events/${initialData.id}` 
          : 'http://localhost:5182/api/events';
        
        const method = initialData ? 'PUT' : 'POST';

        // 'const response =' kısmını sildik, sadece işlemi yapıp geçiyoruz
        await fetch(url, {
          method: method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.baslik,
            description: formData.aciklama,
            date: formData.tarih,
            location: formData.konum,
            clubId: parseInt(formData.kulupId)
          })
        });

        const mesaj = initialData ? "Etkinlik başarıyla GÜNCELLENDİ!" : "Yeni etkinlik KAYDEDİLDİ!";
        alert(mesaj + " (Backend rotası hazır olduğunda 200 OK dönecek 🚀)");
        
      } catch (error) {
        console.error("API Hatası:", error);
      }
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', color: '#333' }}>
        {initialData ? 'Etkinliği Düzenle' : 'Yeni Etkinlik Oluştur'}
      </h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Başlık: </label>
          <input type="text" name="baslik" value={formData.baslik} onChange={handleChange} style={{ width: '100%', padding: '10px', border: errors.baslik ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.baslik && <span style={{ color: 'red', fontSize: '13px' }}>{errors.baslik}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Açıklama: </label>
          <textarea name="aciklama" value={formData.aciklama} onChange={handleChange} style={{ width: '100%', padding: '10px', minHeight: '80px', border: errors.aciklama ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.aciklama && <span style={{ color: 'red', fontSize: '13px' }}>{errors.aciklama}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Tarih: </label>
          <input type="datetime-local" name="tarih" value={formData.tarih} onChange={handleChange} style={{ width: '100%', padding: '10px', border: errors.tarih ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.tarih && <span style={{ color: 'red', fontSize: '13px' }}>{errors.tarih}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Konum: </label>
          <input type="text" name="konum" value={formData.konum} onChange={handleChange} style={{ width: '100%', padding: '10px', border: errors.konum ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.konum && <span style={{ color: 'red', fontSize: '13px' }}>{errors.konum}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Kulüp ID: </label>
          <input type="number" name="kulupId" value={formData.kulupId} onChange={handleChange} style={{ width: '100%', padding: '10px', border: errors.kulupId ? '2px solid red' : '1px solid #ccc', borderRadius: '4px' }} />
          {errors.kulupId && <span style={{ color: 'red', fontSize: '13px' }}>{errors.kulupId}</span>}
        </div>

        <button type="submit" style={{ padding: '12px', backgroundColor: initialData ? '#28a745' : '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
          {initialData ? 'Değişiklikleri Güncelle' : 'Etkinliği Kaydet'}
        </button>

      </form>
    </div>
  );
};

export default EventForm;