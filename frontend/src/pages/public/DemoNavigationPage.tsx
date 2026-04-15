// UniSphere notu: Demo Navigation Page oturum acmadan erisilen sayfa akisini tasir.
import { Link } from 'react-router-dom';

const groups = [
  {
    title: 'Public Akış',
    description: 'Ziyaretçinin gördüğü ilk ekranlar.',
    links: [
      { label: 'Ana Sayfa', to: '/' },
      { label: 'Etkinlik Keşfi', to: '/events' },
      { label: 'Kulüp Keşfi', to: '/clubs' },
      { label: 'Giriş', to: '/login' },
      { label: 'Kayıt', to: '/register' },
    ],
  },
  {
    title: 'Öğrenci Akışı',
    description: 'Etkinlik keşfi, başvuru, öneri, QR ve geri bildirim.',
    links: [
      { label: 'Öğrenci Paneli', to: '/student/dashboard' },
      { label: 'Tüm Etkinlikler', to: '/student/events' },
      { label: 'Etkinlik Detayı', to: '/student/events/101' },
      { label: 'Önerilenler', to: '/student/recommended' },
      { label: 'Başvurularım', to: '/student/applications' },
      { label: 'QR Bilet', to: '/student/ticket/101' },
      { label: 'Yorum', to: '/student/review/101' },
      { label: 'Profil', to: '/student/profile' },
    ],
  },
  {
    title: 'Kulüp Yöneticisi Akışı',
    description: 'Etkinlik operasyonu, katılımcı yönetimi, check-in ve analitik.',
    links: [
      { label: 'Kulüp Paneli', to: '/club-admin/dashboard' },
      { label: 'Etkinliklerim', to: '/club-admin/events' },
      { label: 'Etkinlik Oluştur', to: '/club-admin/events/create' },
      { label: 'Etkinlik Düzenle', to: '/club-admin/events/101/edit' },
      { label: 'Katılımcılar', to: '/club-admin/participants' },
      { label: 'QR Check-in', to: '/club-admin/qr-scanner' },
      { label: 'No-show Riski', to: '/club-admin/no-show-risk' },
      { label: 'Analitik', to: '/club-admin/analytics' },
    ],
  },
  {
    title: 'Sistem Yöneticisi Akışı',
    description: 'Platform geneli yönetim ve moderasyon ekranları.',
    links: [
      { label: 'Sistem Paneli', to: '/system-admin/dashboard' },
      { label: 'Kulüpler', to: '/system-admin/clubs' },
      { label: 'Kullanıcılar', to: '/system-admin/users' },
      { label: 'Moderasyon', to: '/system-admin/moderation' },
    ],
  },
];

export default function DemoNavigationPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Sunum Modu</div>
          <h1 className="panel-title">UniSphere demo rotaları</h1>
          <p className="panel-subtitle">
          </p>
        </section>

        <div className="panel-grid panel-grid--wide">
          {groups.map((group) => (
            <article className="panel-card" key={group.title}>
              <div>
                <h2 className="panel-card__title">{group.title}</h2>
                <p className="panel-card__text" style={{ marginTop: '0.35rem' }}>{group.description}</p>
              </div>
              <div className="panel-actions">
                {group.links.map((link) => (
                  <Link className="btn btn-outline" key={link.to} to={link.to}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
