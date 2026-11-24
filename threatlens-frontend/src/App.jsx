import Card from './components/ui/Card';
import Input from './components/ui/Input';
import Button from './components/ui/Button';

export default function App() {
  return (
    <div style={{ maxWidth: '520px', margin: '60px auto', padding: '0 16px' }}>
      <Card
        title="ThreatLens — پایه فرانت‌اند آماده است"
        subtitle="کامپوننت‌های مشترک Button، Input و Card با موفقیت بارگذاری شدند."
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input id="sample-ip" label="نمونه کادر ورودی IP" placeholder="8.8.8.8" ltr />
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button variant="primary">دکمه اصلی</Button>
            <Button variant="secondary">دکمه فرعی</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}