import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';
import { Can } from './Can';
import { NotificationBell } from './NotificationBell';

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <Link to="/tickets" className="brand">
        Mesa de Ayuda
      </Link>
      <nav>
        <Link to="/tickets">Tickets</Link>
        <Can permission="ticket:create">
          <Link to="/tickets/new">Nuevo ticket</Link>
        </Can>
        <Can permission="user:read">
          <Link to="/admin/users">Usuarios</Link>
        </Can>
      </nav>
      <div className="navbar-right">
        <Can permission="notification:read">
          <NotificationBell />
        </Can>
        <span className="muted">
          {user.name} <span className="role">{user.role}</span>
        </span>
        <button className="secondary" onClick={handleLogout}>
          Salir
        </button>
      </div>
    </header>
  );
}
