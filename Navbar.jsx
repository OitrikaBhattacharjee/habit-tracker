import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/habits', label: 'My Habits' },
  { to: '/insights', label: 'Insights' },
  { to: '/about', label: 'About' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar">
      <NavLink to="/" className="nav-brand" onClick={() => setOpen(false)}>
        <svg className="nav-flame" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2c1 3-2 4-2 7a3 3 0 1 0 6 0c2 1 3 3 3 5.5A7 7 0 1 1 8 14c0-3 1.5-4 1-6 1 .5 2 .5 3-.5C12.5 6 11 4 12 2z"
            fill="#E8622C"
          />
        </svg>
        Ember
      </NavLink>

      <button
        className={`nav-toggle ${open ? 'open' : ''}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle navigation menu"
        aria-expanded={open}
      >
        <span /><span /><span />
      </button>

      <nav className={`nav-links ${open ? 'open' : ''}`}>
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            onClick={() => setOpen(false)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
