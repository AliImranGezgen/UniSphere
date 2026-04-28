import { useEffect, useState } from 'react';
import { getClubById, getClubs, updateClub, type CreateClubData } from '../../services/clubService';
import type { Club } from '../../types/club';

const toFormData = (club?: Club): CreateClubData => ({
  name: club?.name ?? '',
  description: club?.description ?? '',
  logo: club?.logo ?? '',
  shortDescription: club?.shortDescription ?? '',
  aboutText: club?.aboutText ?? '',
  foundedYear: club?.foundedYear ?? undefined,
  contactEmail: club?.contactEmail ?? '',
  socialLinks: club?.socialLinks ?? '',
  website: club?.website ?? '',
});

export default function ClubProfileEditPage() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<number>(0);
  const [formData, setFormData] = useState<CreateClubData>(toFormData());
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getClubs()
      .then((clubList) => {
        setClubs(clubList);
        if (clubList[0]) {
          setSelectedClubId(clubList[0].id);
        }
      })
      .catch(() => setError('Topluluk listesi yüklenemedi.'));
  }, []);

  useEffect(() => {
    if (!selectedClubId) return;

    setLoading(true);
    getClubById(selectedClubId)
      .then((club) => setFormData(toFormData(club)))
      .catch(() => setError('Topluluk profili yüklenemedi.'))
      .finally(() => setLoading(false));
  }, [selectedClubId]);

  const updateField = (field: keyof CreateClubData, value: string) => {
    setFormData((current) => ({
      ...current,
      [field]: field === 'foundedYear' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedClubId) {
      setError('Lütfen düzenlenecek topluluğu seçin.');
      return;
    }

    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const updatedClub = await updateClub(selectedClubId, formData);
      setFormData(toFormData(updatedClub));
      setMessage('Topluluk profili güncellendi.');
    } catch {
      setError('Topluluk profili güncellenemedi. Bu işlem için kulüp başkanı yetkisi gerekir.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Kulüp Profili</div>
          <h1 className="panel-title">Topluluk profilini düzenle</h1>
          <p className="panel-subtitle">Vitrin, iletişim ve hakkında alanlarını güncel tutun.</p>
        </section>

        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label full">
            Topluluk
            <select className="select" value={selectedClubId} onChange={(event) => setSelectedClubId(Number(event.target.value))}>
              <option value={0}>Topluluk seçin...</option>
              {clubs.map((club) => (
                <option key={club.id} value={club.id}>
                  {club.name}
                </option>
              ))}
            </select>
          </label>

          <label className="form-label">
            Topluluk adı *
            <input className="input" required value={formData.name} onChange={(event) => updateField('name', event.target.value)} />
          </label>

          <label className="form-label">
            Kısa açıklama
            <input className="input" maxLength={200} value={formData.shortDescription ?? ''} onChange={(event) => updateField('shortDescription', event.target.value)} />
          </label>

          <label className="form-label full">
            Açıklama *
            <textarea className="textarea" required value={formData.description} onChange={(event) => updateField('description', event.target.value)} />
          </label>

          <label className="form-label full">
            Hakkında metni
            <textarea className="textarea" rows={4} value={formData.aboutText ?? ''} onChange={(event) => updateField('aboutText', event.target.value)} />
          </label>

          <label className="form-label">
            Logo URL
            <input className="input" value={formData.logo ?? ''} onChange={(event) => updateField('logo', event.target.value)} />
          </label>

          <label className="form-label">
            Kuruluş yılı
            <input className="input" type="number" min="1900" max={2100} value={formData.foundedYear ?? ''} onChange={(event) => updateField('foundedYear', event.target.value)} />
          </label>

          <label className="form-label">
            İletişim e-posta
            <input className="input" type="email" value={formData.contactEmail ?? ''} onChange={(event) => updateField('contactEmail', event.target.value)} />
          </label>

          <label className="form-label">
            Web sitesi
            <input className="input" type="url" value={formData.website ?? ''} onChange={(event) => updateField('website', event.target.value)} />
          </label>

          <label className="form-label full">
            Sosyal medya linkleri
            <textarea className="textarea" rows={2} value={formData.socialLinks ?? ''} onChange={(event) => updateField('socialLinks', event.target.value)} />
          </label>

          <div className="form-actions full">
            <button className="btn btn-primary" type="submit" disabled={loading || !selectedClubId}>
              {loading ? 'Kaydediliyor...' : 'Profili kaydet'}
            </button>
          </div>

          {message ? <div className="notice notice-success full">{message}</div> : null}
          {error ? <div className="notice notice-error full">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
