// UniSphere notu: Clubs Discover Page oturum acmadan erisilen sayfa akisini tasir.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import { getClubs } from '../../services/clubService';
import { getEvents } from '../../services/eventService';
import type { Club } from '../../types/club';
import type { Event } from '../../types/event';

function getClubAvatar(name: string) {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 1) return name.slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function memberCountForClub(id: number) {
  return 32 + ((id * 13) % 68);
}

function ClubCard({ club, activeEvents, onJoin }: { club: Club; activeEvents: number; onJoin: (club: Club) => void }) {
  const color = {
    bg: '#eff6ff',
    text: '#2563eb',
    border: '#bfdbfe'
  };

  return (
    <div className="ev-card">
      <div
        className="ev-card__club-badge"
        style={{ backgroundColor: color.bg, color: color.text, border: `1px solid ${color.border}` }}
      >
        {getClubAvatar(club.name)}
      </div>
      <h3 className="ev-card__title">{club.name}</h3>
      <p className="ev-card__desc">{club.description}</p>

      <div className="ev-card__meta">
        <span className="ev-card__meta-item">
          <strong>{memberCountForClub(club.id)}</strong>
          Üye
        </span>
        <span className="ev-card__meta-item">
          <strong>{activeEvents}</strong>
          Aktif Etkinlik
        </span>
      </div>

      <div className="ev-card__footer">
        <button className="btn btn-primary ev-card__btn" onClick={() => onJoin(club)}>
          {authService.isAuthenticated() ? 'Kulübe Katıl' : 'Giriş Yap ve Kulübe Katıl'}
        </button>
        <button className="btn btn-outline ev-card__btn--detail">
          Detay
        </button>
      </div>
    </div>
  );
}

export default function ClubsDiscoverPage() {
  const navigate = useNavigate();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'createdAt'>('name');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3200);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([getClubs(), getEvents()])
      .then(([clubData, eventData]) => {
        setClubs(clubData);
        setEvents(eventData);
        setError(null);
      })
      .catch(() => {
        setError('Kulüpler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      })
      .finally(() => setLoading(false));
  }, []);

  const clubsWithActiveEvents = useMemo(() => {
    const map = new Map<number, number>();
    events.forEach((event) => {
      map.set(event.clubId, (map.get(event.clubId) ?? 0) + 1);
    });
    return map;
  }, [events]);

  const filteredClubs = useMemo(() => {
    let list = [...clubs];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (club) =>
          club.name.toLowerCase().includes(q) ||
          club.description.toLowerCase().includes(q)
      );
    }

    list.sort((a, b) => {
      if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return a.name.localeCompare(b.name, 'tr');
    });
    return list;
  }, [clubs, search, sortBy]);

  const handleJoin = useCallback(
    (club: Club) => {
      if (!authService.isAuthenticated()) {
        showToast('Kulübe katılmak için önce giriş yapmalısınız.');
        setTimeout(() => navigate('/login'), 1200);
        return;
      }
      showToast(`${club.name} kulübüne katılma isteğiniz alındı!`);
    },
    [navigate, showToast]
  );

  return (
    <>
      <style>{`
        /* ── Layout ── */
        .ev-page { min-height: 100vh; background: var(--bg-secondary); }

        /* ── Hero Banner ── */
        .ev-hero {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #7c3aed 100%);
          padding: 4rem 0 5rem;
          position: relative;
          overflow: hidden;
        }
        .ev-hero::before {
          content: '';
          position: absolute; inset: 0;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E") repeat;
        }
        .ev-hero__content { position: relative; text-align: center; }
        .ev-hero__eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          background: rgba(255,255,255,0.15); backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.25);
          color: white; padding: 6px 16px; border-radius: 999px;
          font-size: 0.8rem; font-weight: 600; letter-spacing: 0.08em;
          text-transform: uppercase; margin-bottom: 1.5rem;
        }
        .ev-hero__title {
          font-size: clamp(2rem, 5vw, 3.25rem);
          font-weight: 800; color: white;
          line-height: 1.15; margin-bottom: 1rem;
        }
        .ev-hero__subtitle {
          color: rgba(255,255,255,0.8);
          font-size: 1.1rem; max-width: 560px;
          margin: 0 auto 2.5rem;
        }

        /* ── Search bar ── */
        .ev-search-wrap {
          max-width: 560px; margin: 0 auto;
          background: white; border-radius: 14px;
          display: flex; align-items: center; gap: 0;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 20px 60px rgba(0,0,0,0.2);
          overflow: hidden;
        }
        .ev-search-icon {
          padding: 0 16px; color: #94a3b8;
          display: flex; align-items: center;
        }
        .ev-search-input {
          flex: 1; border: none; outline: none;
          font-size: 1rem; font-family: inherit;
          padding: 14px 0; color: var(--text-main);
          background: transparent;
        }
        .ev-search-input::placeholder { color: #94a3b8; }
        .ev-search-btn {
          margin: 6px; padding: 10px 20px;
          background: var(--primary); color: white;
          border-radius: 10px; font-size: 0.9rem;
          font-weight: 600; font-family: inherit;
          border: none; cursor: pointer;
          transition: background 0.2s;
          white-space: nowrap;
        }
        .ev-search-btn:hover { background: var(--primary-hover); }

        /* ── Toolbar ── */
        .ev-toolbar {
          display: flex; justify-content: space-between; align-items: center;
          flex-wrap: wrap; gap: 1rem;
          margin-bottom: 2rem;
        }
        .ev-toolbar__count {
          font-size: 0.95rem; color: var(--text-muted);
          font-weight: 500;
        }
        .ev-toolbar__count strong { color: var(--text-main); }
        .ev-sort {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; color: var(--text-muted);
        }
        .ev-sort select {
          border: 1px solid var(--border-color);
          background: white; color: var(--text-main);
          padding: 6px 10px; border-radius: 8px;
          font-size: 0.85rem; font-family: inherit;
          cursor: pointer; outline: none;
        }

        /* ── Grid ── */
        .ev-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(330px, 1fr));
          gap: 1.5rem;
        }

        /* ── Card ── */
        .ev-card {
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 1.5rem;
          display: flex; flex-direction: column; gap: 0;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
          overflow: hidden;
        }
        .ev-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(37,99,235,0.1);
          border-color: #bfdbfe;
        }
        .ev-card--skeleton { pointer-events: none; }

        .ev-card__club-badge {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 700;
          text-transform: uppercase; letter-spacing: 0.05em;
          padding: 4px 10px; border-radius: 6px;
          width: fit-content; margin-bottom: 0.9rem;
        }

        .ev-card__title {
          font-size: 1.15rem; font-weight: 700;
          color: var(--text-main); line-height: 1.4;
          margin-bottom: 0.6rem;
        }
        .ev-card__desc {
          font-size: 0.9rem; color: var(--text-muted);
          line-height: 1.6; margin-bottom: 1.25rem;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .ev-card__meta {
          display: flex; flex-wrap: wrap; gap: 10px;
          margin-bottom: 1.25rem;
        }
        .ev-card__meta-item {
          display: flex; align-items: center; gap: 5px;
          font-size: 0.8rem; color: var(--text-muted);
          background: var(--bg-secondary);
          padding: 4px 10px; border-radius: 6px;
        }

        .ev-card__capacity { margin-bottom: 1.25rem; }
        .ev-card__capacity-header {
          display: flex; justify-content: space-between;
          align-items: center;
          font-size: 0.82rem; color: var(--text-muted);
          margin-bottom: 6px;
        }
        .ev-card__progress-track {
          height: 6px; background: var(--bg-tertiary);
          border-radius: 999px; overflow: hidden;
        }
        .ev-card__progress-fill {
          height: 100%; border-radius: 999px;
          transition: width 0.4s ease;
        }
        .ev-card__capacity-foot {
          display: flex; justify-content: space-between;
          font-size: 0.75rem; color: var(--text-muted);
          margin-top: 4px;
        }
        .ev-card__badge {
          font-size: 0.7rem; font-weight: 700;
          padding: 2px 8px; border-radius: 4px;
          text-transform: uppercase; letter-spacing: 0.06em;
        }
        .ev-card__badge--warn { background: #fff7ed; color: #ea580c; }

        .ev-card__footer {
          display: flex; gap: 8px; margin-top: auto;
          padding-top: 1rem;
          border-top: 1px solid var(--border-color);
        }
        .ev-card__btn { flex: 1; font-size: 0.875rem; padding: 0.55rem 1rem; }
        .ev-card__btn--detail {
          font-size: 0.875rem; padding: 0.55rem 1rem;
          background: transparent;
          border: 1px solid var(--border-color);
          color: var(--text-main);
          border-radius: 0.5rem;
          font-family: inherit;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }
        .ev-card__btn--detail:hover { background: var(--bg-tertiary); }

        .skeleton-block {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }

        .ev-state {
          display: flex; flex-direction: column; align-items: center;
          justify-content: center; padding: 5rem 2rem;
          text-align: center;
        }
        .ev-state__icon {
          width: 72px; height: 72px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 1.5rem; font-size: 2rem;
        }
        .ev-state__icon--empty { background: var(--primary-light); color: var(--primary); }
        .ev-state__icon--error { background: #fef2f2; color: #dc2626; }
        .ev-state__title { font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; }
        .ev-state__desc { color: var(--text-muted); font-size: 0.95rem; max-width: 360px; }

        .ev-breadcrumb {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.85rem; color: rgba(255,255,255,0.65);
          margin-bottom: 1.5rem;
        }
        .ev-breadcrumb a { color: rgba(255,255,255,0.85); font-weight: 500; }
        .ev-breadcrumb a:hover { color: white; }
        .ev-breadcrumb span { color: rgba(255,255,255,0.4); }

        .ev-stats {
          display: flex; justify-content: center; gap: 3rem;
          margin-top: 2.5rem; flex-wrap: wrap;
        }
        .ev-stat { text-align: center; color: white; }
        .ev-stat__num {
          font-size: 2rem; font-weight: 800; line-height: 1;
          margin-bottom: 4px;
        }
        .ev-stat__label { font-size: 0.8rem; opacity: 0.7; text-transform: uppercase; letter-spacing: 0.06em; }

        .ev-body { padding: 2.5rem 0 4rem; }

        .ev-toast {
          position: fixed; bottom: 2rem; left: 50%;
          transform: translateX(-50%) translateY(0);
          background: #1e293b; color: white;
          padding: 14px 22px; border-radius: 12px;
          font-size: 0.9rem; font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.25);
          display: flex; align-items: center; gap: 10px;
          z-index: 9999; white-space: nowrap;
          animation: toastIn 0.3s ease;
        }
        .ev-toast--warn { background: #7c2d12; }
        .ev-toast--warn .ev-toast__icon { color: #fb923c; }
        .ev-toast--success { background: #14532d; }
        .ev-toast--success .ev-toast__icon { color: #4ade80; }
        @keyframes toastIn {
          from { opacity: 0; transform: translateX(-50%) translateY(12px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>

      <div className="ev-page">
        <div className="ev-hero">
          <div className="container ev-hero__content">
            <div className="ev-breadcrumb">
              <Link to="/">Ana Sayfa</Link>
              <span>›</span>
              <span>Kulüpler</span>
            </div>

            <div className="ev-hero__eyebrow">Tüm Kampüs Kulüpleri</div>
            <h1 className="ev-hero__title">Kampüsünüzdeki kulüpleri keşfedin ve topluluğunuza katılın.</h1>
            <p className="ev-hero__subtitle">
              Kulüplerin açıklamalarını inceleyin, kaç aktif etkinlik düzenlediklerini görün ve ilginizi çeken topluluğa hemen katılın.
            </p>

            <div className="ev-search-wrap">
              <span className="ev-search-icon">
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </span>
              <input
                className="ev-search-input"
                type="text"
                placeholder="Kulüp adı veya açıklama ara..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="ev-search-btn" onClick={() => {}}>Ara</button>
            </div>

            {!loading && !error && (
              <div className="ev-stats">
                <div className="ev-stat">
                  <div className="ev-stat__num">{clubs.length}</div>
                  <div className="ev-stat__label">Kulüp</div>
                </div>
                <div className="ev-stat">
                  <div className="ev-stat__num">{new Set(events.map((e) => e.clubId)).size}</div>
                  <div className="ev-stat__label">Kulüpte Etkinlik</div>
                </div>
                <div className="ev-stat">
                  <div className="ev-stat__num">{events.length}</div>
                  <div className="ev-stat__label">Aktif Etkinlik</div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="ev-body">
          <div className="container">
            {!loading && !error && (
              <div className="ev-toolbar">
                <p className="ev-toolbar__count">
                  <strong>{filteredClubs.length}</strong> kulüp listeleniyor
                  {search && ` · "${search}" araması için`}
                </p>
                <div className="ev-sort">
                  <span>Sırala:</span>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)}>
                    <option value="name">Ada göre</option>
                    <option value="createdAt">Yeniye göre</option>
                  </select>
                </div>
              </div>
            )}

            {loading && (
              <div className="ev-grid">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="ev-card ev-card--skeleton" />
                ))}
              </div>
            )}

            {!loading && error && (
              <div className="ev-state">
                <div className="ev-state__icon ev-state__icon--error">⚠️</div>
                <h2 className="ev-state__title">Bir hata oluştu</h2>
                <p className="ev-state__desc">{error}</p>
                <button
                  className="btn btn-primary"
                  style={{ marginTop: '1.5rem' }}
                  onClick={() => window.location.reload()}
                >
                  Tekrar Dene
                </button>
              </div>
            )}

            {!loading && !error && filteredClubs.length === 0 && (
              <div className="ev-state">
                <div className="ev-state__icon ev-state__icon--empty">
                  <svg width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h2 className="ev-state__title">Kulüp bulunamadı</h2>
                <p className="ev-state__desc">
                  {search
                    ? `"${search}" için sonuç yok. Farklı bir arama terimi deneyin.`
                    : 'Şu an listelenecek kulüp bulunmuyor. Daha sonra tekrar kontrol edin.'}
                </p>
                {search && (
                  <button
                    className="btn btn-outline"
                    style={{ marginTop: '1.5rem' }}
                    onClick={() => setSearch('')}
                  >
                    Aramayı Temizle
                  </button>
                )}
              </div>
            )}

            {!loading && !error && filteredClubs.length > 0 && (
              <div className="ev-grid">
                {filteredClubs.map((club) => (
                  <ClubCard
                    key={club.id}
                    club={club}
                    activeEvents={clubsWithActiveEvents.get(club.id) ?? 0}
                    onJoin={handleJoin}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {toast && (
        <div
          className={`ev-toast ${toast.includes('giriş') ? 'ev-toast--warn' : 'ev-toast--success'}`}
          role="alert"
        >
          <span className="ev-toast__icon">
            {toast.includes('giriş') ? (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            ) : (
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </span>
          {toast}
        </div>
      )}
    </>
  );
}
