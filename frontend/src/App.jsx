import { useState, useEffect } from 'react';
import { checkNewIp } from './services/api';
import ResultCard from './components/ResultCard';

function App() {
  const [data, setData] = useState(null);

  useEffect(() => {
    // فراخوانی تابع API برای دریافت اطلاعات آی‌پی
    checkNewIp('8.8.8.8').then((result) => {
      setData(result);
    });
  }, []);

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <h1 style={{ textAlign: 'center', fontFamily: 'Tahoma', color: '#1e293b', marginTop: '20px' }}>
        پنل تست ThreatLens
      </h1>
      
      {/* نمایش کامپوننت کارت نتیجه با داده‌های دریافت شده */}
      <ResultCard data={data} />
    </div>
  );
}

export default App;