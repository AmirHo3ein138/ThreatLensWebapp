import { useState, useEffect } from 'react';
import { getHistory } from '../services/api';
import './History.css';

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHistory().then((data) => {
      setHistoryData(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="history-container" style={{ textAlign: 'center' }}>
        <p>در حال بارگذاری تاریخچه...</p>
      </div>
    );
  }

  return (
    <div className="history-container">
      <h2 className="history-header">تاریخچه بررسی‌ها</h2>
      
      <div className="history-list">
        {historyData.map((item, index) => (
          <div key={index} className="history-item">
            <div className="history-info">
              <div className="history-ip" dir="ltr">{item.ip}</div>
              <div className="history-date">
                زمان استعلام: <span dir="ltr">{new Date(item.timestamp).toLocaleString('fa-IR-u-nu-latn')}</span>
              </div>
            </div>
            <button className="details-btn">
              مشاهده نتیجه
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;