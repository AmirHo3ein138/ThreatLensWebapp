import SearchForm from './components/SearchForm';
import './index.css';

function App() {
  const handleSearch = (ip) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (ip === '192.168.1.1') reject(new Error('آی‌پی خصوصی نامعتبر است!'));
        else resolve();
      }, 2000);
    });
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: '2rem' }}>ThreatLens</h2>
      <SearchForm onSearch={handleSearch} />
    </div>
  );
}

export default App;
