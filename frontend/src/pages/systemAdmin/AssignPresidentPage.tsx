import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignPresident, getClubs } from '../../services/clubService';
import { authService } from '../../services/authService';
import type { Club } from '../../types/club';
import type { UserListItem } from '../../types/auth';

export default function AssignPresidentPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [selectedClub, setSelectedClub] = useState<number>(clubId ? Number(clubId) : 0);
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    Promise.all([getClubs(), authService.getAllUsers()])
      .then(([clubList, userList]) => {
        setClubs(clubList);
        setUsers(userList.filter((user) => user.role !== 'SystemAdmin' && user.role !== 'system_admin'));
      })
      .catch(() => setError('Topluluk veya kullanıcı listesi yüklenemedi.'))
      .finally(() => setDataLoading(false));
  }, []);

  useEffect(() => {
    if (clubId) {
      setSelectedClub(Number(clubId));
    }
  }, [clubId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedClub || !selectedUser) {
      setError('Lütfen bir topluluk ve kullanıcı seçin.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await assignPresident(selectedClub, selectedUser);
      setMessage('Başkan başarıyla atandı.');
      window.setTimeout(() => navigate('/system-admin/clubs'), 1200);
    } catch {
      setError('Başkan ataması başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Topluluk Yönetimi</div>
          <h1 className="panel-title">Başkan ata</h1>
          <p className="panel-subtitle">Seçtiğiniz topluluğa başkan atayın ve kulüp paneli yetkisini başlatın.</p>
        </section>

        <form className="panel-card form-grid" onSubmit={handleSubmit}>
          <label className="form-label full">
            Topluluk *
            <select className="select" value={selectedClub} onChange={(event) => setSelectedClub(Number(event.target.value))} required>
              <option value={0}>{dataLoading ? 'Yükleniyor...' : 'Topluluk seçin...'}</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label full">
            Başkan olacak kullanıcı *
            <select className="select" value={selectedUser} onChange={(event) => setSelectedUser(Number(event.target.value))} required>
              <option value={0}>{dataLoading ? 'Yükleniyor...' : 'Kullanıcı seçin...'}</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions full">
            <button className="btn btn-primary" type="submit" disabled={loading || dataLoading || !selectedClub || !selectedUser}>
              {loading ? 'Atanıyor...' : 'Başkanı ata'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/system-admin/clubs')}>
              İptal
            </button>
          </div>

          {message ? <div className="notice notice-success full">{message}</div> : null}
          {error ? <div className="notice notice-error full">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
