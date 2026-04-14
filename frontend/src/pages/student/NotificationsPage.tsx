// UniSphere notu: Notifications Page ogrenci deneyimindeki ana ekranlardan biridir.
import { formatDateTime, mockNotifications } from '../pageData';

export default function NotificationsPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Bildirimler</div>
          <h1 className="panel-title">Kampüs akışı</h1>
          <p className="panel-subtitle">Başvuru güncellemeleri, öneriler ve etkinlik hatırlatmaları burada görünür.</p>
        </section>
        <div className="panel-grid">
          {mockNotifications.map((notification) => (
            <article className="panel-card" key={notification.id}>
              <div className="panel-card__top">
                <h2 className="panel-card__title">{notification.title}</h2>
                <span className={notification.read ? 'status-pill' : 'status-pill status-pill--good'}>{notification.read ? 'Okundu' : 'Yeni'}</span>
              </div>
              <p className="panel-card__text">{notification.message}</p>
              <span className="chip">{formatDateTime(notification.createdAt)}</span>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
