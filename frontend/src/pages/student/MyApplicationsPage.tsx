// UniSphere notu: My Applications Page ogrenci deneyimindeki ana ekranlardan biridir.
import { Link } from 'react-router-dom';
import { formatDateTime, mockApplications, statusClass } from '../pageData';

export default function MyApplicationsPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Başvurular</div>
          <h1 className="panel-title">Başvuru durumlarım</h1>
          <p className="panel-subtitle">Onaylanan, bekleyen ve tamamlanan etkinlik başvurularını tek yerden takip et.</p>
        </section>
        <div className="table-card">
          {mockApplications.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎫</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Henüz bir başvurunuz yok</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Kampüsteki etkinlikleri kaçırmayın! <Link to="/student/events" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Keşfet &rarr;</Link>
              </p>
            </div>
          ) : (
            <table className="panel-table">
              <thead><tr><th>Etkinlik</th><th>Kulüp</th><th>Tarih</th><th>Durum</th><th>Aksiyon</th></tr></thead>
              <tbody>
                {mockApplications.map((application) => (
                  <tr key={application.id}>
                    <td>{application.title}</td>
                    <td>{application.clubName}</td>
                    <td>{formatDateTime(application.eventDate)}</td>
                    <td><span className={statusClass(application.status)}>{application.status}</span></td>
                    <td><Link className="btn btn-outline" to={`/student/events/${application.eventId}`}>Detay</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
