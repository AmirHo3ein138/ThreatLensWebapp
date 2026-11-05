import './ResultCard.css';

const ResultCard = ({ data }) => {
  if (!data) return <div className="result-container" style={{ textAlign: 'center' }}><p>در حال دریافت اطلاعات از بک‌اند...</p></div>;

  const statusConfig = {
    success: { class: 'status-success', label: 'گزارش شده' },
    no_report: { class: 'status-no_report', label: 'بدون گزارش' },
    error: { class: 'status-error', label: 'خطای ارتباط' }
  };

  const renderSourceCard = (sourceName, sourceData) => {
    const config = statusConfig[sourceData.status] || statusConfig.error;
    return (
      <div className="source-card">
        <div className="source-header">
          <h3 className="source-title">{sourceName}</h3>
          <span className={`badge ${config.class}`}>{config.label}</span>
        </div>
        <div className="source-details">
          {sourceData.status === 'error' ? (
            <p>⚠️ {sourceData.message}</p>
          ) : (
            <>
              <p>تعداد گزارش / امتیاز: <span className="score-value" dir="ltr">{sourceData.reports_count ?? 0}</span></p>
              <p>توضیحات: {sourceData.message}</p>
              {sourceData.status === 'no_report' && (
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '10px' }}>
                  * نبود گزارش به معنای سالم بودن قطعی نیست.
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="result-container">
      <div className="result-header">
        <h2>نتیجه بررسی آی‌پی: <span className="ip-highlight">{data.ip}</span></h2>
        <p className="meta-info">زمان استعلام: <span dir="ltr">{new Date(data.timestamp).toLocaleString('fa-IR-u-nu-latn')}</span></p>
      </div>
      <div className="sources-grid">
        {data.results?.VirusTotal && renderSourceCard('VirusTotal', data.results.VirusTotal)}
        {data.results?.AbuseIPDB && renderSourceCard('AbuseIPDB', data.results.AbuseIPDB)}
      </div>
    </div>
  );
};

export default ResultCard;