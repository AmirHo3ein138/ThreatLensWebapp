import { useState } from 'react';

export default function SearchForm({ onSearch }) {
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!ip.trim()) {
      setError('لطفاً یک آی‌پی وارد کنید.');
      return;
    }

    setLoading(true);
    try {
      await onSearch(ip);
      setIp('');
    } catch (err) {
      setError(err.message || 'خطا در ارتباط با سرور.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '1.5rem', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3 style={{ marginTop: 0, marginBottom: '1.5rem' }}>بررسی آی‌پی مشکوک</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            className="base-input"
            placeholder="مثال: 8.8.8.8"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            disabled={loading}
            dir="ltr"
          />
        </div>
        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
        <button type="submit" className="base-button" style={{ width: '100%' }} disabled={loading}>
          {loading ? 'در حال بررسی منابع...' : 'استعلام آی‌پی'}
        </button>
      </form>
    </div>
  );
}
