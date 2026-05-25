import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import type { UserListItem } from '../../types/auth';

export default function UsersPage() {
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    authService.getAllUsers()
      .then((data) => {
        setUsers(data);
        setError(null);
      })
      .catch(() => setError('Kullanici listesi alinamadi.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Kullanicilar</div>
          <h1 className="panel-title">Kullanici ve rol yonetimi</h1>
          <p className="panel-subtitle">Kayitli kullanicilarin guncel sistem rolleri.</p>
        </section>

        {loading ? <div className="notice">Kullanicilar yukleniyor...</div> : null}
        {error ? <div className="notice notice-error">{error}</div> : null}

        {!loading && !error ? (
          <div className="table-card">
            <table className="panel-table">
              <thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Rol</th><th>Kayit Tarihi</th></tr></thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td><span className="chip">{user.role}</span></td>
                    <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString('tr-TR') : '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </div>
  );
}
