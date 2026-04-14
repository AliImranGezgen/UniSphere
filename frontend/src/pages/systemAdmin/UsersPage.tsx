import { mockUsers, statusClass } from '../pageData';

export default function UsersPage() {
  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Kullanıcılar</div>
          <h1 className="panel-title">Kullanıcı ve rol yönetimi</h1>
          <p className="panel-subtitle">Rol bazlı erişim ve hesap durumları için yönetim ekranı.</p>
        </section>
        <div className="table-card">
          <table className="panel-table">
            <thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Durum</th></tr></thead>
            <tbody>
              {mockUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className="chip">{user.role}</span></td>
                  <td><span className={statusClass(user.status)}>{user.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
