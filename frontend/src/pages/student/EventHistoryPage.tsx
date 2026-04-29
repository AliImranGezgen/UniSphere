// UniSphere notu: Event History Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatDateTime, statusClass } from '../pageData';
import { applicationService } from '../../services/applicationService';
import type { Application } from '../../types/application';

export default function EventHistoryPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const history = useMemo(
    () => applications.filter((application) => ['CheckedIn', 'Cancelled'].includes(application.status)),
    [applications]
  );

  useEffect(() => {
    applicationService.getMyApplications()
      .then(setApplications)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Geçmiş</div>
          <h1 className="panel-title">Etkinlik geçmişi</h1>
          <p className="panel-subtitle">Katıldığın etkinliklerden sonra yorum bırakabilir ve geçmiş davranışlarını görebilirsin.</p>
        </section>
        <div className="panel-grid">
          {loading ? <div className="panel-card">Etkinlik geçmişi yükleniyor...</div> : history.map((application) => {
            const label = application.status === 'CheckedIn' ? 'Katıldı' : 'İptal Edildi';
            return (
              <article className="panel-card" key={application.id}>
                <div className="panel-card__top">
                  <h2 className="panel-card__title">{application.title}</h2>
                  <span className={statusClass(label)}>{label}</span>
                </div>
                <p className="panel-muted">{application.clubName} · {formatDateTime(application.eventDate)}</p>
                <div className="panel-actions">
                  <Link className="btn btn-primary" to={`/student/review/${application.eventId}`}>Yorum Yaz</Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
