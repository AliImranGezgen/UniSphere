import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Yüklenme durumunu başlat
    setError(null);

    try {
      // Backend'e giriş isteği gönder
      await authService.login({ email, password });
      // Başarılıysa dashboard'a yönlendir
      navigate('/student/dashboard');
    } catch (err: any) {
      // Hata durumunda backend'den gelen mesajı göster
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
      } else {
        setError('Bir ağ hatası oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false); // Yüklenme durumunu bitir
    }
  };

  return (
    <>
      <div className="auth-title-row">
        <h2 className="auth-title">Giriş Yap</h2>
      </div>

      {error && (
        <div style={{ color: '#E63946', marginBottom: '15px', fontSize: '14px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-input-group">
          <input 
            type="email" 
            className="auth-input" 
            placeholder="E-posta adresi"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="auth-input-group">
          <input 
            type="password" 
            className="auth-input" 
            placeholder="Şifre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        <div className="auth-options">
          <label>
            <input type="checkbox" disabled={isLoading} /> Beni hatırla
          </label>
          <a href="#">Şifremi unuttum</a>
        </div>

        <button 
          type="submit" 
          className="auth-submit-btn" 
          disabled={isLoading}
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'GİRİŞ YAPILIYOR...' : 'GİRİŞ YAP'}
        </button>

        <div className="auth-bottom-text">
          Hesabınız yok mu? <Link to="/register">Kayıt Ol</Link>
        </div>
      </form>
    </>
  );
}
