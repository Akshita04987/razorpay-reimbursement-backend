import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { clearSession } from '../utils/auth';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/rest/onboardings/logout');
    } finally {
      clearSession();
      onLogout();
      navigate('/login');
    }
  };

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 border-b bg-white px-5 py-4">
      <Link to="/" className="text-lg font-bold text-blue-700">
        Razorpay Reimbursement
      </Link>

      <div className="flex items-center gap-4 text-sm">
        <Link to="/" className="text-gray-700 hover:text-blue-700">
          Home
        </Link>
        {!user && (
          <Link to="/login" className="text-gray-700 hover:text-blue-700">
            Login
          </Link>
        )}
        {user && (
          <>
            <span className="rounded bg-gray-100 px-3 py-1 text-gray-700">
              {user.name} ({user.role})
            </span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
