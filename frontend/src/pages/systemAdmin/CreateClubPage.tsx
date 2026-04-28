import { useState } from 'react';
import { createClub, type CreateClubData } from '../../services/clubService';

const getOptionalString = (form: FormData, key: string) => {
  const value = form.get(key)?.toString().trim();
  return value || undefined;
};

export default function CreateClubPage() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const form = new FormData(event.currentTarget);
    const foundedYearValue = form.get('foundedYear')?.toString();
    const clubData: CreateClubData = {
      name: form.get('name')?.toString().trim() ?? '',
      description: form.get('description')?.toString().trim() ?? '',
      logo: getOptionalString(form, 'logo'),
      shortDescription: getOptionalString(form, 'shortDescription'),
      aboutText: getOptionalString(form, 'aboutText'),
      foundedYear: foundedYearValue ? Number(foundedYearValue) : undefined,
      contactEmail: getOptionalString(form, 'contactEmail'),
      socialLinks: getOptionalString(form, 'socialLinks'),
      website: getOptionalString(form, 'website'),
    };

    try {
      const result = await createClub(clubData);
      setMessage(`Topluluk başarıyla oluşturuldu. ID: ${result.clubId}`);
      event.currentTarget.reset();
    } catch {
      setError('Topluluk oluşturulurken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-heading" style={{ marginBottom: '1rem' }}>
          <div className="panel-eyebrow">Yeni Topluluk</div>
          <h1 className="panel-title">Topluluk oluştur</h1>
          <p className="panel-subtitle">Sistem yöneticisi olarak yeni bir topluluk profili oluşturun.</p>
        </section>

        <form className="panel-card form-grid" onSubmit={(event) => void handleSubmit(event)}>
          <label className="form-label">
            Topluluk adı *
            <input className="input" name="name" required maxLength={100} placeholder="Örn: Teknoloji Kulübü" />
          </label>

          <label className="form-label">
            Kısa açıklama
            <input className="input" name="shortDescription" maxLength={200} placeholder="Kartlarda gösterilecek kısa tanım" />
          </label>

          <label className="form-label full">
            Açıklama *
            <textarea className="textarea" name="description" required maxLength={500} placeholder="Topluluk hakkında detaylı açıklama" />
          </label>

          <label className="form-label full">
            Hakkında metni
            <textarea className="textarea" name="aboutText" rows={4} placeholder="Profil sayfasında gösterilecek detaylı metin" />
          </label>

          <label className="form-label">
            Logo URL
            <input className="input" name="logo" placeholder="https://example.com/logo.png" />
          </label>

          <label className="form-label">
            Kuruluş yılı
            <input className="input" name="foundedYear" type="number" min="1900" max={2100} placeholder="2024" />
          </label>

          <label className="form-label">
            İletişim e-posta
            <input className="input" name="contactEmail" type="email" placeholder="kulup@uni.edu.tr" />
          </label>

          <label className="form-label">
            Web sitesi
            <input className="input" name="website" type="url" placeholder="https://kulup.edu.tr" />
          </label>

          <label className="form-label full">
            Sosyal medya linkleri
            <textarea className="textarea" name="socialLinks" rows={2} placeholder='{"instagram": "...", "twitter": "..."}' />
          </label>

          <div className="form-actions full">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? 'Oluşturuluyor...' : 'Topluluğu oluştur'}
            </button>
          </div>

          {message ? <div className="notice notice-success full">{message}</div> : null}
          {error ? <div className="notice notice-error full">{error}</div> : null}
        </form>
      </div>
    </div>
  );
}
