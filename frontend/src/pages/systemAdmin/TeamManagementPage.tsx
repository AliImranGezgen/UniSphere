import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { assignClubRole, getClubRoleAssignments, getClubs, revokeClubRole, type AssignRoleData } from '../../services/clubService';
import { authService } from '../../services/authService';
import type { Club, ClubRoleAssignment } from '../../types/club';
import type { UserListItem } from '../../types/auth';

const roles = [
  { value: 'VicePresident', label: 'Başkan yardımcısı' },
  { value: 'EventManager', label: 'Etkinlik sorumlusu' },
  { value: 'Treasurer', label: 'Sayman' },
  { value: 'Secretary', label: 'Sekreter' },
  { value: 'Member', label: 'Üye' },
];

const roleLabel = (value: string) => roles.find((role) => role.value === value)?.label ?? (value === 'President' ? 'Başkan' : value);

export default function TeamManagementPage() {
  const { clubId } = useParams<{ clubId: string }>();
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [assignments, setAssignments] = useState<ClubRoleAssignment[]>([]);
  const [selectedClub, setSelectedClub] = useState<number>(clubId ? Number(clubId) : 0);
  const [selectedUser, setSelectedUser] = useState<number>(0);
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedClubName = useMemo(() => clubs.find((club) => club.id === selectedClub)?.name, [clubs, selectedClub]);

  const loadAssignments = async (clubIdToLoad: number) => {
    if (!clubIdToLoad) {
      setAssignments([]);
      return;
    }

    try {
      const roleList = await getClubRoleAssignments(clubIdToLoad);
      setAssignments(roleList);
    } catch {
      setAssignments([]);
    }
  };

  useEffect(() => {
    Promise.all([getClubs(), authService.getAllUsers()])
      .then(([clubList, userList]) => {
        setClubs(clubList);
        setUsers(userList.filter((user) => user.role !== 'SystemAdmin' && user.role !== 'system_admin'));
      })
      .catch(() => setError('Topluluk veya kullanıcı listesi yüklenemedi.'));
  }, []);

  useEffect(() => {
    void loadAssignments(selectedClub);
  }, [selectedClub]);

  const handleAssignRole = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedClub || !selectedUser || !selectedRole) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const data: AssignRoleData = { userId: selectedUser, role: selectedRole };
      await assignClubRole(selectedClub, data);
      setMessage('Rol başarıyla atandı.');
      setSelectedUser(0);
      setSelectedRole('');
      await loadAssignments(selectedClub);
    } catch {
      setError('Rol ataması başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeRole = async (userId: number, role: string) => {
    if (!selectedClub) return;

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      await revokeClubRole(selectedClub, { userId, role });
      setMessage('Rol başarıyla kaldırıldı.');
      await loadAssignments(selectedClub);
    } catch {
      setError('Rol kaldırma başarısız. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Ekip Yönetimi</div>
          <h1 className="panel-title">Ekip yetkilendirme</h1>
          <p className="panel-subtitle">Topluluk üyelerine rol atayın, mevcut rolleri görün ve gerektiğinde yetkiyi kaldırın.</p>
        </section>

        <form className="panel-card form-grid" onSubmit={handleAssignRole}>
          <label className="form-label full">
            Topluluk *
            <select className="select" value={selectedClub} onChange={(event) => setSelectedClub(Number(event.target.value))} required>
              <option value={0}>Topluluk seçin...</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label full">
            Kullanıcı *
            <select className="select" value={selectedUser} onChange={(event) => setSelectedUser(Number(event.target.value))} required>
              <option value={0}>Kullanıcı seçin...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          </label>

          <label className="form-label full">
            Rol *
            <select className="select" value={selectedRole} onChange={(event) => setSelectedRole(event.target.value)} required>
              <option value="">Rol seçin...</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          <div className="form-actions full">
            <button className="btn btn-primary" type="submit" disabled={loading || !selectedClub || !selectedUser || !selectedRole}>
              {loading ? 'Atanıyor...' : 'Rol ata'}
            </button>
            <button className="btn" type="button" onClick={() => navigate('/system-admin/clubs')}>
              İptal
            </button>
          </div>

          {message ? <div className="notice notice-success full">{message}</div> : null}
          {error ? <div className="notice notice-error full">{error}</div> : null}
        </form>

        <section className="panel-heading" style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
          <h2 className="panel-title" style={{ fontSize: '1.25rem' }}>Mevcut roller</h2>
          <p className="panel-subtitle">{selectedClubName ? `${selectedClubName} için atanmış ekip rolleri.` : 'Rol listesini görmek için topluluk seçin.'}</p>
        </section>

        <div className="table-card">
          <table className="panel-table">
            <thead>
              <tr>
                <th>Kullanıcı</th>
                <th>Rol</th>
                <th>Atanma tarihi</th>
                <th>İşlem</th>
              </tr>
            </thead>
            <tbody>
              {assignments.length === 0 ? (
                <tr>
                  <td colSpan={4}>Bu topluluk için atanmış rol bulunamadı.</td>
                </tr>
              ) : assignments.map((assignment) => (
                <tr key={`${assignment.userId}-${assignment.role}`}>
                  <td>
                    <strong>{assignment.userName}</strong>
                    <div className="panel-muted">{assignment.userEmail}</div>
                  </td>
                  <td><span className="status-pill">{roleLabel(assignment.role)}</span></td>
                  <td>{new Date(assignment.assignedAt).toLocaleDateString('tr-TR')}</td>
                  <td>
                    <button
                      className="btn btn-sm"
                      type="button"
                      disabled={loading || assignment.role === 'President'}
                      onClick={() => void handleRevokeRole(assignment.userId, assignment.role)}
                    >
                      Kaldır
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
