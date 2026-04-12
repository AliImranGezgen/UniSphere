
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Hero Section */}
      <section style={{ 
        padding: '6rem 0', 
        backgroundColor: 'var(--bg-main)',
        borderBottom: '1px solid var(--border-color)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            fontWeight: 800, 
            letterSpacing: '-0.02em',
            marginBottom: '1.5rem',
            lineHeight: 1.1,
            color: 'var(--text-main)'
          }}>
            Kampüs hayatınız <span style={{ color: 'var(--primary)' }}>artık daha kolay.</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: 'var(--text-muted)', 
            marginBottom: '2.5rem',
            lineHeight: 1.6
          }}>
            Etkinlikleri keşfedin, öğrenci kulüplerine katılın ve kampüs topluluğunuzla tek bir yerden bağlantı kurun. UniSphere üniversite deneyiminizi bir araya getiriyor.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/events" className="btn btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>
              Etkinlikleri Keşfet
            </Link>
            <Link to="/clubs" className="btn btn-outline" style={{ padding: '0.8rem 1.5rem', fontSize: '1.1rem' }}>
              Kulüpleri Görüntüle
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section section-bg">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '1rem' }}>İhtiyacınız olan her şey</h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Öğrencilerin kampüs yolculuklarından en iyi şekilde yararlanmalarını sağlıyoruz.</p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Feature Card 1 */}
            <div className="card">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Yaklaşan Etkinlikler</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>Akademik etkinlikler, sosyal buluşmalar ve networking atölyelerini bulun ve tek tıkla kayıt olun.</p>
            </div>

            {/* Feature Card 2 */}
            <div className="card">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Öğrenci Kulüpleri</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>İlgi alanlarınıza uygun çeşitli öğrenci kulüplerini keşfedin ve topluluklara dahil olun. En son haberlerden geri kalmayın.</p>
            </div>

            {/* Feature Card 3 */}
            <div className="card">
              <div style={{ width: '48px', height: '48px', backgroundColor: 'var(--primary-light)', color: 'var(--primary)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Kolay Kayıt</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.5 }}>Etkinliklere sadece bir tıklama ile kaydolun. Tüm etkinliklerinizi kişisel panelinizden rahatça takip edin.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events Preview Section */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem' }}>
            <div>
              <h2 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>Popüler Etkinlikler</h2>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)' }}>Çevrenizde olup bitenleri sakın kaçırmayın.</p>
            </div>
            <Link to="/events" className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              Tümünü gör
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"></path></svg>
            </Link>
          </div>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {/* Event Card Placeholder 1 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)' }}></div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>TEKNOLOJİ KULÜBÜ</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>React ve Frontend Mimarisine Giriş</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>React ve Vite kullanarak modern frontend geliştirmeye derinlemesine bir dalış için bize katılın...</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>24 Eki • 14:00</span>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Detaylar</button>
                 </div>
              </div>
            </div>

            {/* Event Card Placeholder 2 */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)' }}></div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>KARİYER MERKEZİ</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>Mülakat Maratonu Simülasyonu</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>En prestijli teknoloji şirketlerinden profesyonellerle mülakat becerilerinizi test edin ve geliştirin.</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>26 Eki • 10:00</span>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Detaylar</button>
                 </div>
              </div>
            </div>

             {/* Event Card Placeholder 3 */}
             <div className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '180px', backgroundColor: 'var(--bg-tertiary)' }}></div>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '0.5rem' }}>MÜZİK KULÜBÜ</div>
                 <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem', lineHeight: 1.4 }}>Kampüste Akustik Gece</h3>
                 <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.5rem', flex: 1 }}>Günün yorgunluğunu üzerinizden atın ve yetenekli öğrencilerin canlı akustik performanslarının tadını çıkarın.</p>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginTop: 'auto' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>28 Eki • 19:30</span>
                    <button className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}>Detaylar</button>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--primary)', color: 'white', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1.5rem' }}>Başlamaya hazır mısınız?</h2>
          <p style={{ fontSize: '1.2rem', marginBottom: '2.5rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Bugün hesabınızı oluşturun ve kampüsünüzün sunduğu tüm fırsatları keşfetmeye hemen başlayın.
          </p>
          <Link to="/register" className="btn" style={{ backgroundColor: 'white', color: 'var(--primary)', fontSize: '1.1rem', padding: '0.8rem 2rem' }}>
            Ücretsiz Kayıt Ol
          </Link>
        </div>
      </section>
    </div>
  );
}
