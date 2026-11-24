import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { getHistory } from '../services/api';
import './HistoryPage.css';

function formatDateTime(isoDateString) {
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return isoDateString;
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

function getShortStatusLabel(status) {
  if (status === 'ok') return 'گزارش‌شده';
  if (status === 'no_report') return 'بدون گزارش';
  if (status === 'error') return 'خطا';
  return 'نامشخص';
}

export default function HistoryPage() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [activeQuery, setActiveQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadHistory = useCallback(async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const data = await getHistory(query);
      setItems(data);
    } catch (err) {
      setItems([]);
      setError(err.message || 'دریافت تاریخچه با خطا مواجه شد.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory('');
  }, [loadHistory]);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleaned = searchInput.trim();
    setActiveQuery(cleaned);
    loadHistory(cleaned);
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setActiveQuery('');
    loadHistory('');
  };

  return (
    <div className="history-page">
      <div className="history-page__header">
        <div>
          <h1 className="history-page__title">تاریخچه بررسی‌ها</h1>
          <p className="history-page__subtitle">
            نمایش بررسی‌های ذخیره‌شده از جدید به قدیم؛ باز کردن جزئیات بدون استعلام مجدد انجام می‌شود.
          </p>
        </div>
        <Button onClick={() => navigate('/check')}>بررسی آی‌پی جدید</Button>
      </div>

      <Card>
        <form className="history-search" onSubmit={handleSearch}>
          <div className="history-search__input">
            <Input
              id="history-ip-search"
              label="جست‌وجو بر اساس آی‌پی"
              placeholder="مثلاً 185.220 یا 8.8.8.8"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              ltr
            />
          </div>
          <div className="history-search__buttons">
            <Button type="submit" loading={loading}>
              جست‌وجو
            </Button>
            {(activeQuery || searchInput) && (
              <Button
                type="button"
                variant="secondary"
                onClick={handleClearSearch}
                disabled={loading}
              >
                پاک کردن
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card
        title={
          activeQuery
            ? `نتایج جست‌وجو برای «${activeQuery}»`
            : 'فهرست بررسی‌های ثبت‌شده'
        }
      >
        {loading ? (
          <div className="history-state">
            <p>در حال بارگذاری تاریخچه...</p>
          </div>
        ) : error ? (
          <div className="history-state">
            <div className="history-error">{error}</div>
            <Button variant="secondary" onClick={() => loadHistory(activeQuery)}>
              تلاش مجدد
            </Button>
          </div>
        ) : items.length === 0 ? (
          <div className="history-state">
            {activeQuery ? (
              <>
                <p>هیچ بررسی‌ای مطابق با «{activeQuery}» پیدا نشد.</p>
                <Button variant="secondary" onClick={handleClearSearch}>
                  نمایش همه سوابق
                </Button>
              </>
            ) : (
              <>
                <p>هنوز هیچ بررسی‌ای در تاریخچه ذخیره نشده است.</p>
                <Button onClick={() => navigate('/check')}>
                  ثبت اولین بررسی
                </Button>
              </>
            )}
          </div>
        ) : (
          <ul className="history-list">
            {items.map((item) => (
              <li key={item.id}>
                <Link to={`/history/${item.id}`} className="history-row">
                  <div className="history-row__main">
                    <span className="history-row__ip ltr-text">{item.ip}</span>
                    <span className="history-row__time">
                      شناسه #{item.id} • {formatDateTime(item.checked_at)}
                    </span>
                  </div>

                  <div className="history-row__right">
                    <div className="history-row__sources">
                      {(item.sources || []).map((src) => (
                        <span
                          key={src.source}
                          className={`source-pill source-pill--${src.status}`}
                        >
                          <span className="ltr-text">{src.source}</span>:{' '}
                          {getShortStatusLabel(src.status)}
                        </span>
                      ))}
                    </div>
                    <span className="history-row__link">جزئیات ←</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}