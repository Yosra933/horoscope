import { useState, useEffect } from "react";

export function Auth({ isOpen, onClose, onLoginSuccess }) {
  useEffect(() => {
    if (isOpen) {
      fetch('http://localhost:5000/api/health')
        .then(r => r.json())
        .then(d => console.log('[Auth] Server health:', d.status))
        .catch(e => console.error('[Auth] Server unreachable at http://localhost:5000 - start with: npm run server'));
    }
  }, [isOpen]);
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/register';
      const body = mode === 'login'
        ? { email, password }
        : { email, password, name };

      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue');
        return;
      }

      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      onLoginSuccess?.(data.user);
      onClose();
    } catch (err) {
      console.error('[Auth] Fetch error:', err);
      console.error('[Auth] Server running? Try: http://localhost:5000/api/health');
      if (err.message === 'Failed to fetch' || err.message === 'NetworkError when attempting to fetch resource.') {
        setError('Serveur inaccessible. Vérifiez que npm run server est lancé sur http://localhost:5000');
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="ov" onClick={onClose}>
      <div className="mb" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h2 style={{ fontFamily: "'Cinzel',serif", fontSize: 28, marginBottom: 10, color: '#D4AF37' }}>
            {mode === 'login' ? '✦ Connexion' : '✦ Inscription'}
          </h2>
          <p style={{ color: '#8a7a60', fontSize: 14 }}>
            {mode === 'login' ? 'Accédez à votre compte mystique' : 'Rejoignez notre communauté spirituelle'}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 12, color: '#D4AF37', fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6, display: 'block' }}>
                Nom
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                required={mode === 'register'}
              />
            </div>
          )}

          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: '#D4AF37', fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6, display: 'block' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre@email.com"
              required
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, color: '#D4AF37', fontFamily: "'Cinzel',serif", letterSpacing: 1, marginBottom: 6, display: 'block' }}>
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(220, 38, 38, .2)', border: '1px solid #DC2626', color: '#FCA5A5', padding: 12, borderRadius: 4, marginBottom: 16, fontSize: 13 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="bg glw"
            disabled={loading}
            style={{ width: '100%', marginBottom: 12, opacity: loading ? 0.6 : 1 }}
          >
            {loading ? '⟳ Traitement...' : (mode === 'login' ? '✦ Se connecter' : '✦ S\'inscrire')}
          </button>
        </form>

        <div style={{ textAlign: 'center', paddingTop: 16, borderTop: '1px solid rgba(212, 175, 55, .2)' }}>
          <p style={{ fontSize: 13, color: '#8a7a60', marginBottom: 10 }}>
            {mode === 'login' ? 'Pas encore de compte ?' : 'Déjà inscrit ?'}
          </p>
          <button
            onClick={() => {
              setMode(mode === 'login' ? 'register' : 'login');
              setError('');
            }}
            style={{
              background: 'transparent',
              border: '1px solid #D4AF37',
              color: '#D4AF37',
              padding: '8px 16px',
              cursor: 'pointer',
              fontFamily: "'Cinzel',serif",
              fontSize: 12,
              borderRadius: 2,
              transition: 'all .3s'
            }}
          >
            {mode === 'login' ? 'Créer un compte' : 'Se connecter'}
          </button>
        </div>

        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: 16,
            right: 16,
            background: 'none',
            border: 'none',
            color: '#D4AF37',
            fontSize: 24,
            cursor: 'pointer',
            padding: 0
          }}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
