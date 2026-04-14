// UniSphere notu: Qr Scanner Page kulup yoneticisinin ilgili is akisini ekran seviyesinde toplar.
import { useState } from 'react';

export default function QrScannerPage() {
  const [code, setCode] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">QR Check-in</div>
            <h1 className="panel-title">Katılımcı girişi</h1>
            <p className="panel-subtitle">Kamera entegrasyonu eklendiğinde bu ekran canlı QR tarama akışını yönetecek. Şimdilik bilet kodunu elle doğrulayabilirsin.</p>
          </div>
          <div className="panel-card" style={{ alignItems: 'center' }}>
            <div className="qr-box"><span>SCAN</span></div>
          </div>
        </section>
        <form className="panel-card" onSubmit={(event) => { event.preventDefault(); setMessage(`${code || 'UNI-000'} kodu check-in için işaretlendi.`); }}>
          <label className="form-label">Bilet Kodu<input className="input" value={code} onChange={(event) => setCode(event.target.value)} placeholder="UNI-101-STUDENT" /></label>
          <button className="btn btn-primary" type="submit">Check-in Yap</button>
          {message ? <div className="notice">{message}</div> : null}
        </form>
      </div>
    </div>
  );
}
