import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import './DashboardPage.css';

// داده موقت تا زمان آماده شدن سرویس API توسط نفر سوم
// برای تست حالت تاریخچه خالی، کافی است این آرایه را [] بگذارید
const TEMP_MOCK_HISTORY = [
  { id: 6, ip: '185.220.101.4', checked_at: new Date().toISOString() },
  { id: 5, ip: '8.8.8.8', checked_at: new Date().toISOString() },
  { id: 4, ip: '45.155.205.233', checked_at: '2026-11-23T18:20:00Z' },
  { id: 3, ip: '1.1.1.1', checked_at: '2026-11-22T14:10:00Z' },
  { id: 2, ip: '193.142.146.35', checked_at: '2026-11-21T09:45:00Z' },
  { id: 1, ip: '94.102.61.47', checked_at: '2026-11-20T11:00:00Z' },
];

function isSameLocalDay(isoDateString) {
  const target = new Date(isoDateString);
  if (Number.isNaN(target.getTime())) return false;
  const now = new Date();
  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

function formatDateTime(isoDateString) {
  const date = new Date(isoDateString);
  if (Number.isNaN(date.getTime())) return isoDateString;
  return new Intl.DateTimeFormat('fa-IR', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(date);
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const history = TEMP_MOCK_HISTORY;

  const { totalCount, todayCount, recentFive } = useMemo(() => {
    const sorted = [...history].sort(
      (a, b) => new Date(b.checked_at) - new Date(a.checked_at)
    );
    const today = sorted.filter((item) => isSameLocalDay(item.checked_at)).length;
    return {
      totalCount: sorted.length,
      todayCount: today,
      recentFive: sorted.slice(0, 5),
    };
  }, [history]);

  return (
    <div className="dashboard">
      <div className="dashboard__top">
        <div>
          <h1 className="dashboard__title">داشبورد ThreatLens</h1>
          <p className="dashboard__desc">
            نمای کلی بررسی‌های انجام‌شده و دسترسی سریع به آخرین گزارش‌ها
          </p>
        </div>
        <Button onClick={() => navigate('/check')}>بررسی آی‌پی جدید</Button>
      </div>

      <div className="dashboard__stats">
        <Card title="تعداد کل بررسی‌ها" subtitle="مجموع سوابق ثبت‌شده در سامانه">
          <div className="stat-value">{totalCount}</div>
        </Card>

        <Card title="بررسی‌های امروز" subtitle="تعداد استعلام‌های ثبت‌شده در روز جاری">
          <div className="stat-value stat-value--accent">{todayCount}</div>
        </Card>
      </div>

      <Card
        title="پنج بررسی آخر"
        subtitle="برای مشاهده جزئیات کامل هر بررسی، روی آن کلیک کنید"
      >
        {recentFive.length === 0 ? (
          <div className="empty-state">
            <p>هنوز هیچ آی‌پی بررسی نشده است.</p>
            <Button variant="secondary" onClick={() => navigate('/check')}>
              شروع اولین بررسی
            </Button>
          </div>
        ) : (
          <ul className="recent-list">
            {recentFive.map((item) => (
              <li key={item.id}>
                <Link to={`/history/${item.id}`} className="recent-item">
                  <span className="recent-item__ip ltr-text">{item.ip}</span>
                  <div className="recent-item__meta">
                    <span>{formatDateTime(item.checked_at)}</span>
                    <span className="recent-item__action">مشاهده جزئیات ←</span>
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
