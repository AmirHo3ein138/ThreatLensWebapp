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
    setLoading(true);
    setData(null); 
    
    checkNewIp(ip).then((result) => {
      setData(result);
      setLoading(false);
    });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', color: '#0f172a', margin: '30px 0', fontSize: '2.2rem', fontWeight: '700' }}>
        پنل تست ThreatLens
      </h1>
      
      <SearchForm onSearch={handleSearch} loading={loading} />
      
      {loading && (
        <div dir="ltr" style={{ textAlign: 'center', color: '#3b82f6', margin: '30px 0', fontSize: '1.1rem', fontWeight: '600', fontFamily: 'Inter' }}>
          ⏳ Analyzing threat intelligence data...
        </div>
      )}
      
      {data && !loading && <ResultCard data={data} />}
      
      <History />
    </div>
  );
}

export default App;