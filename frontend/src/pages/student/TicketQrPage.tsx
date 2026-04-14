import { Link, useParams } from 'react-router-dom';

export default function TicketQrPage() {
  const { eventId } = useParams();

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">QR Bilet</div>
            <h1 className="panel-title">Etkinlik giriş kodun</h1>
            <p className="panel-subtitle">Kulüp görevlisi QR check-in ekranından bu kodu okutarak katılımını işaretleyebilir.</p>
            <div className="panel-actions">
              <Link className="btn btn-outline" to={`/student/events/${eventId ?? ''}`}>Etkinliğe Dön</Link>
            </div>
          </div>
          <div className="panel-card" style={{ alignItems: 'center' }}>
            <div className="qr-box"><span>UNI-{eventId ?? '000'}</span></div>
            <p className="panel-muted">Bilet No: UNI-{eventId ?? '000'}-STUDENT</p>
          </div>
        </section>
      </div>
    </div>
  );
}
