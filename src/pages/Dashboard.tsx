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
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" />
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