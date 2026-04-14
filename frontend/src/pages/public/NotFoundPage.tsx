// UniSphere notu: Not Found Page oturum acmadan erisilen sayfa akisini tasir.
import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading">
          <div className="panel-eyebrow">404</div>
          <h1 className="panel-title">Sayfa bulunamadı</h1>
          <p className="panel-subtitle">Aradığınız adres taşınmış veya henüz oluşturulmamış olabilir.</p>
          <div className="panel-actions">
            <Link className="btn btn-primary" to="/">Ana Sayfa</Link>
            <Link className="btn btn-outline" to="/events">Etkinlikler</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
