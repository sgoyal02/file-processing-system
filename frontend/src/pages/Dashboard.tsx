import { useState } from 'react';
import { NavLink, Outlet} from 'react-router-dom';
import '../styles/layout.css';
import { useAuth } from '../contexts/AuthContext';

const MENU_ITEMS = [
  {to: '/projects', label: 'Projects'},
  // {to: '/jobs', label: 'Jobs Tracking' },
];

const AppLayout =()=> {
  const { authData, onLogout } = useAuth();
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
          >
            <svg width={"25px"} height={"25px"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>

          </button>
          <div className="header-name">
            <span>File Processing System</span>
          </div>
        </div>

        <div className="header-right">
          <div className="user-info" title={authData.user?.email}>
            <div className='flex-center user-avatar'>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>

              <span className='user-active'></span>
            </div>
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