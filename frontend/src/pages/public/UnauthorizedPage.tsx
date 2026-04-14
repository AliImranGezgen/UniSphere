// UniSphere notu: Unauthorized Page oturum acmadan erisilen sayfa akisini tasir.
import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading">
          <div className="panel-eyebrow">403</div>
          <h1 className="panel-title">Yetkisiz erişim</h1>
          <p className="panel-subtitle">Bu alana erişmek için uygun role sahip bir hesapla giriş yapmalısınız.</p>
          <div className="panel-actions">
            <Link className="btn btn-primary" to="/login">Giriş Yap</Link>
            <Link className="btn btn-outline" to="/">Ana Sayfa</Link>
          </div>
        </section>
      </div>
    </div>
  );
}
