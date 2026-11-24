import { NavLink, Outlet } from 'react-router-dom';
import './Layout.css';

export default function Layout() {
  const getLinkClass = ({ isActive }) =>
    `app-nav__link ${isActive ? 'app-nav__link--active' : ''}`;

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__inner">
          <NavLink to="/" className="app-brand">
            <span className="ltr-text">ThreatLens</span>
            <span className="app-brand__badge">نسخه درسی</span>
          </NavLink>

          <nav className="app-nav" aria-label="منوی اصلی">
            <NavLink to="/" end className={getLinkClass}>
              داشبورد
            </NavLink>
            <NavLink to="/check" className={getLinkClass}>
              بررسی آی‌پی جدید
            </NavLink>
            <NavLink to="/history" className={getLinkClass}>
              تاریخچه بررسی‌ها
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
}
