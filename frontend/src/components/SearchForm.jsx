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
      <form onSubmit={handleSubmit} className="search-form">
        <input
          type="text"
          className="search-input"
          placeholder="Enter IP Address (e.g., 1.1.1.1)..."
          value={ip}
          onChange={(e) => setIp(e.target.value)}
          dir="ltr"
          disabled={loading}
        />
        <button 
          type="submit" 
          className={`search-btn ${loading ? 'scanning' : ''}`} 
          disabled={loading || !ip.trim()} 
          dir="ltr"
        >
          {loading ? (
            <>
              <span className="spinner"></span> Scanning...
            </>
          ) : (
            <>
              <svg className="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Scan
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default SearchForm;