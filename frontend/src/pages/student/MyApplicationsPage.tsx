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
        </div>
      </div>
    </div>
  );
}
