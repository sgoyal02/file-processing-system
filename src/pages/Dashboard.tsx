import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import '../styles/layout.css';
import { useAuth } from '../contexts/AuthContext';

const MENU_ITEMS = [
  {to: '/projects', label: 'Projects'},
  {to: '/jobs', label: 'Jobs Tracking' },
];

const AppLayout =()=> {
  const { authData, onLogout } = useAuth();
  const navigate = useNavigate();
  const [sideMenu, setSideMenu] = useState(false);

  function handleLogout() {
    onLogout();
  }

  return (
    <div className="dashboard">
      <header className="header">
        <div className="header-left">
          <button className="menu-icon"
            onClick={() => setSideMenu((prev) => !prev)}
          ><span /><span /> <span />
          </button>
          <div className="header-name">
            <span>File Processing System</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info">
            <span className='user-active'></span>
            <span className="user-name">{authData.user?.email}</span>
          </div>
          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
</svg>
        <span>Logout</span>
          </button>
        </div>
      </header>

      <div className="app-body">
        {sideMenu && (
          <div className="sidebar-overlay" onClick={() => setSideMenu(false)} />
        )}
        <aside className={`sidebar ${sideMenu ? 'sidebar-open' : ''}`}>
          <nav className="sidebar-menu">
            <p className="side-label">Menu</p>
            {MENU_ITEMS.map((item, idx) => (
              <NavLink
                key={idx}
                to={item.to}
                className={({ isActive }) =>
                  `side-link ${isActive ? 'side-link--active' : ''}`
                }
                onClick={() => setSideMenu(false)}
              >
                <span>{item.label}</span>
              </NavLink>
            ))}
          </nav>
        </aside>


        <main className="app-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
export default AppLayout;