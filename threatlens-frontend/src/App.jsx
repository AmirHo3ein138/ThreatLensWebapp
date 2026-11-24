import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage from './pages/DashboardPage';
import CheckIpPage from './pages/CheckIpPage';
import HistoryPage from './pages/HistoryPage';
import ResultDetailPage from './pages/ResultDetailPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="check" element={<CheckIpPage />} />
          <Route path="history" element={<HistoryPage />} />
          <Route path="history/:id" element={<ResultDetailPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
