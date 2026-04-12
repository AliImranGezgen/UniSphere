import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';
import axios from 'axios';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Yüklenme durumunu başlat
    setError(null);

    try {
      // Backend'e kayıt isteği gönder
      await authService.register({ name, email, password });
      alert('Kayıt başarıyla oluşturuldu. Şimdi giriş yapabilirsiniz.');
      // Kayıttan sonra giriş sayfasına yönlendir
      navigate('/login');
    } catch (err) {
      // Hata durumunda (örn: e-posta zaten kayıtlı) mesajı göster
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data || 'Kayıt işlemi başarısız oldu.');
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
        <h2 className="auth-title">Kayıt Ol</h2>
      </div>

      {error && (
        <div style={{ color: '#E63946', marginBottom: '15px', fontSize: '14px', fontWeight: '500' }}>
          {error}
        </div>
      )}

      <form className="auth-form" onSubmit={handleRegister}>
        <div className="auth-input-group">
          <input 
            type="text" 
            className="auth-input" 
            placeholder="Ad Soyad"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
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

        <button 
          type="submit" 
          className="auth-submit-btn" 
          disabled={isLoading}
          style={{ cursor: isLoading ? 'not-allowed' : 'pointer', opacity: isLoading ? 0.7 : 1 }}
        >
          {isLoading ? 'KAYIT YAPILIYOR...' : 'KAYIT OL'}
        </button>

        <div className="auth-bottom-text">
          Zaten bir hesabınız var mı? <Link to="/login" style={{color: '#E63946'}}>Giriş Yap</Link>
        </div>
      </form>
    </>
  );
}
