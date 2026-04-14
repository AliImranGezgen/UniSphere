import { useEffect, useState } from 'react';
import { authService } from '../../services/authService';
import type { User } from '../../types/auth';

type Profile = User & { createdAt?: string };

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>({ id: '1', name: 'Demo Öğrenci', email: 'student@campus.edu', role: 'Student' });

  useEffect(() => {
    if (authService.isAuthenticated()) {
      authService.getProfile().then(setProfile).catch(() => undefined);
    }
  }, []);

  return (
    <div className="panel-page">
      <div className="panel-shell">
        <section className="panel-hero">
          <div className="panel-heading">
            <div className="panel-eyebrow">Profil</div>
            <h1 className="panel-title">{profile.name}</h1>
            <p className="panel-subtitle">{profile.email}</p>
            <div className="panel-meta" style={{ marginTop: '1rem' }}>
              <span className="status-pill">{profile.role}</span>
              <span className="chip">Kayıt: {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('tr-TR') : 'Demo'}</span>
            </div>
          </div>
          <div className="metric-grid">
            <div className="metric-card"><div className="metric-value">3</div><div className="metric-label">Başvuru</div></div>
            <div className="metric-card"><div className="metric-value">1</div><div className="metric-label">Katılım</div></div>
            <div className="metric-card"><div className="metric-value">2</div><div className="metric-label">Öneri</div></div>
            <div className="metric-card"><div className="metric-value">4.8</div><div className="metric-label">Ortalama puan</div></div>
          </div>
        </section>
        <div className="panel-card">
          <h2 className="panel-card__title">İlgi Alanları</h2>
          <div className="panel-meta">
            <span className="chip">Teknoloji</span>
            <span className="chip">Kariyer</span>
            <span className="chip">Müzik</span>
            <span className="chip">Girişimcilik</span>
          </div>
        </div>
      </div>
    </div>
  );
}
