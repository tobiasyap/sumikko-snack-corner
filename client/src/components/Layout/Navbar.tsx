import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SumikkoCharacter from '../Characters/SumikkoCharacter';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      className="navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        height: 56,
        backgroundColor: '#FFF5F0',
        borderBottom: '2px solid #F0DCD4',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        position: 'sticky',
        top: 0,
        zIndex: 40,
      }}
    >
      <div
        className="navbar-left"
        style={{ display: 'flex', alignItems: 'center', gap: 12 }}
      >
        <SumikkoCharacter type="penguin" size={48} className="navbar-mascot" />

        <div
          className="navbar-links"
          style={{ display: 'flex', gap: 8 }}
        >
          {[
            { to: '/', label: 'Snack Machine' },
            { to: '/archive', label: 'Snack Diary' },
            { to: '/settings', label: 'Settings' },
          ].map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) =>
                `navbar-link ${isActive ? 'navbar-link-active' : ''}`
              }
              style={({ isActive }) => ({
                textDecoration: 'none',
                fontSize: 13,
                fontWeight: 600,
                padding: '6px 14px',
                borderRadius: 10,
                color: isActive ? '#fff' : '#7B6B8D',
                backgroundColor: isActive ? '#D4C8E8' : 'transparent',
                transition: 'all 0.15s ease',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div
        className="navbar-right"
        style={{ display: 'flex', alignItems: 'center', gap: 14 }}
      >
        {user && (
          <span
            className="navbar-email"
            style={{ fontSize: 12, color: '#8B7D6B' }}
          >
            {user.email}
          </span>
        )}

        <button
          className="navbar-logout-btn"
          onClick={logout}
          style={{
            background: 'none',
            border: '1.5px solid #F0DCD4',
            borderRadius: 10,
            padding: '5px 14px',
            fontSize: 12,
            fontWeight: 600,
            color: '#8B7D6B',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.backgroundColor = '#F0DCD4';
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.backgroundColor = 'transparent';
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
