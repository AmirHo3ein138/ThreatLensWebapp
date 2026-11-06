import { useState, useEffect } from 'react';
import { checkNewIp } from './services/api';
import ResultCard from './components/ResultCard';
import History from './components/History';
import SearchForm from './components/SearchForm';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    handleSearch('8.8.8.8');
  }, []);

  const handleSearch = (ip) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setLoading(true);
    setData(null); 
    
    checkNewIp(ip).then((result) => {
      setData(result);
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: '0 20px 40px 20px' }}>
      
      {/* هدر جدید و جذاب صفحه */}
      <header className="app-header">
        <div className="logo-container">
          <svg className="logo-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="app-title">
          ThreatLens <span className="title-highlight">Intelligence</span>
        </h1>
        <p className="app-subtitle">موتور جستجو و تحلیل‌گر پیشرفته تهدیدات سایبری</p>
      </header>
      
      <SearchForm onSearch={handleSearch} loading={loading} />
      
      {loading && (
        <div dir="ltr" style={{ textAlign: 'center', color: '#10b981', margin: '30px 0', fontSize: '1.1rem', fontWeight: '600', fontFamily: 'Inter' }}>
          ⏳ Analyzing threat intelligence data...
        </div>
      )}
      
      {data && !loading && <ResultCard data={data} />}
      
      <History onHistoryClick={handleSearch} />
    </div>
  );
}

export default App;