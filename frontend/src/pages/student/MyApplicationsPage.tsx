// UniSphere notu: My Applications Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, statusClass } from '../pageData';
import { applicationService } from '../../services/applicationService';
import type { Application, ApplicationStatus } from '../../types/application';

const statusLabel = (status: ApplicationStatus) => {
  if (status === 'Approved') return 'Onaylandı';
  if (status === 'Waitlisted') return 'Bekleme Listesi';
  if (status === 'Cancelled') return 'İptal Edildi';
  if (status === 'CheckedIn') return 'Katıldı';
  return 'Beklemede';
};

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applicationService.getMyApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Başvurular</div>
          <h1 className="panel-title">Başvuru durumlarım</h1>
          <p className="panel-subtitle">Onaylanan, bekleyen ve tamamlanan etkinlik başvurularını tek yerden takip et.</p>
        </section>
        <div className="table-card">
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Başvurular yükleniyor...</div>
          ) : applications.length === 0 ? (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', background: 'white', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Henüz bir başvurunuz yok</h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Kampüsteki etkinlikleri kaçırmayın! <Link to="/student/events" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Keşfet &rarr;</Link>
              </p>
            </div>
          ) : (
            <table className="panel-table">
              <thead><tr><th>Etkinlik</th><th>Kulüp</th><th>Tarih</th><th>Durum</th><th>Aksiyon</th></tr></thead>
              <tbody>
                {applications.map((application) => {
                  const label = statusLabel(application.status);
                  return (
                    <tr key={application.id}>
                      <td>{application.title}</td>
                      <td>{application.clubName}</td>
                      <td>{formatDateTime(application.eventDate)}</td>
                      <td><span className={statusClass(label)}>{label}</span></td>
                      <td><Link className="btn btn-outline" to={`/student/events/${application.eventId}`}>Detay</Link></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
