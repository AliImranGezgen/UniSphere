import { Link } from 'react-router-dom';
import { formatDateTime, mockApplications, statusClass } from '../pageData';

export default function EventHistoryPage() {
  const history = mockApplications.filter((application) => ['Katıldı', 'İptal Edildi'].includes(application.status));

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Geçmiş</div>
          <h1 className="panel-title">Etkinlik geçmişi</h1>
          <p className="panel-subtitle">Katıldığın etkinliklerden sonra yorum bırakabilir ve geçmiş davranışlarını görebilirsin.</p>
        </section>
        <div className="panel-grid">
          {history.map((application) => (
            <article className="panel-card" key={application.id}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{application.title}</h2>
                <span className={statusClass(application.status)}>{application.status}</span>
              </div>
              <p className="panel-muted">{application.clubName} · {formatDateTime(application.eventDate)}</p>
              <div className="panel-actions">
                <Link className="btn btn-primary" to={`/student/review/${application.eventId}`}>Yorum Yaz</Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
