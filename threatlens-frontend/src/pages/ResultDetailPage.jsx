import { useParams } from 'react-router-dom';
import Card from '../components/ui/Card';

export default function ResultDetailPage() {
  const { id } = useParams();

  return (
    <Card
      title={`جزئیات بررسی #${id}`}
      subtitle="در انتظار پیاده‌سازی توسط نفر سوم"
    >
      <p style={{ color: 'var(--text-secondary)' }}>
        گزارش VirusTotal و AbuseIPDB برای شناسه {id} در این صفحه نمایش داده می‌شود.
      </p>
    </Card>
  );
}
