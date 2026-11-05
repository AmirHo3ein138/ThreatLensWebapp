import { useState } from 'react';
import './SearchForm.css';

const SearchForm = ({ onSearch, loading }) => {
  const [ip, setIp] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (ip.trim()) {
      onSearch(ip.trim());
    }
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form-unified">
        <div className="input-wrapper">
          {/* آیکون جستجو داخل کادر */}
          <svg className="input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          <input
            type="text"
            className="search-input-unified"
            placeholder="Enter IP Address to scan (e.g., 8.8.8.8)"
            value={ip}
            onChange={(e) => setIp(e.target.value)}
            dir="ltr"
            disabled={loading}
            autoComplete="off"
            spellCheck="false"
          />
          
          <button 
            type="submit" 
            className="search-btn-unified" 
            disabled={loading || !ip.trim()} 
            dir="ltr"
          >
            {loading ? (
              <span className="spinner-small"></span>
            ) : (
              'Scan'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;