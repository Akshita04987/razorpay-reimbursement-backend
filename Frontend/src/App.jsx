import { Navigate, Route, Routes } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import { getSavedUser } from './utils/auth';

function App() {
  const [user, setUser] = useState(getSavedUser());

  return (
    <>
      <Navbar user={user} onLogout={() => setUser(null)} />
      <Routes>
        <Route
          path="/"
          element={user ? <DashboardPage user={user} /> : <Navigate to="/login" replace />}
        />
        <Route path="/login" element={<LoginPage onLogin={setUser} />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
