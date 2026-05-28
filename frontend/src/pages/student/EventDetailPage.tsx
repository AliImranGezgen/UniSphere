// UniSphere notu: Event Detail Page ogrenci deneyimindeki ana ekranlardan biridir.
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { applicationService } from '../../services/applicationService';
import { getEventById } from '../../services/eventService';
import type { Event } from '../../types/event';
import { fallbackEvents, formatDateTime, getFillCount, getFillPercent } from '../pageData';

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const numericId = Number(eventId);
  const [event, setEvent] = useState<Event | null>(null);
  const [applying, setApplying] = useState(false);
  const [applicationError, setApplicationError] = useState<string | null>(null);

  useEffect(() => {
    if (!numericId) return;
    getEventById(numericId)
      .then(setEvent)
      .catch(() => setEvent(fallbackEvents.find((item) => item.eventId === numericId) ?? fallbackEvents[0]));
  }, [numericId]);

  if (!event) {
    return <div className="panel-page"><div className="panel-shell"><div className="notice">Etkinlik detayı yükleniyor...</div></div></div>;
  }

  const fill = getFillCount(event);
  const percent = getFillPercent(event);

  const handleApply = async () => {
    if (!event) return;

    setApplying(true);
    setApplicationError(null);
    try {
      await applicationService.applyToEvent(event.eventId);
      navigate('/student/applications');
    } catch (error) {
      const fallback = 'Basvuru alinamadi. Daha once basvurmus olabilir veya tekrar denemeniz gerekebilir.';
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const detail =
          typeof responseData === 'string'
            ? responseData
            : responseData?.message ?? responseData?.detail;
        setApplicationError(detail || fallback);
      } else {
        setApplicationError(fallback);
      }
    } finally {
      setApplying(false);
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">{event.clubName || `Kulüp #${event.clubId}`}</div>
            <h1 className="panel-title">{event.title}</h1>
            <p className="panel-subtitle">{event.description}</p>
            <div className="panel-actions">
              <button className="btn btn-primary" type="button" onClick={() => void handleApply()} disabled={applying}>
                {applying ? 'Basvuru gonderiliyor...' : 'Basvur'}
              </button>
              <Link className="btn btn-outline" to={`/student/ticket/${event.eventId}`}>QR Bilet</Link>
              <Link className="btn btn-outline" to={`/student/review/${event.eventId}`}>Yorum Yap</Link>
            </div>
            {applicationError ? <div className="notice notice-error">{applicationError}</div> : null}
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">{formatDateTime(event.eventDate).split(' ')[0]}</div><div className="metric-label">{formatDateTime(event.eventDate)}</div></div>
            <div className="metric-card"><div className="metric-value">{event.capacity}</div><div className="metric-label">Kontenjan</div></div>
            <div className="metric-card"><div className="metric-value">{fill}</div><div className="metric-label">Tahmini başvuru</div></div>
            <div className="metric-card"><div className="metric-value">{percent}%</div><div className="metric-label">Doluluk</div></div>
          </div>
        </section>
        <div className="panel-card">
          <h2 className="panel-card__title">Etkinlik Bilgileri</h2>
          <div className="panel-meta">
            <span className="chip">{event.location}</span>
            <span className="chip">Etkinlik #{event.eventId}</span>
            <span className="chip">Kulüp #{event.clubId}</span>
          </div>
          <div className="progress-track"><div className="progress-fill" style={{ width: `${percent}%` }} /></div>
          <p className="panel-muted">Basvurun alindiginda durumunu Basvurularim ekraninda takip edebilirsin.</p>
        </div>
      </div>
    </div>
  );
}
