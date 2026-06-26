import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';
import FormInput from '../components/FormInput';
import { saveSession } from '../utils/auth';

function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/rest/onboardings/login', form);
      const session = response.data.data;
      saveSession(session);
      onLogin(session.user);
      navigate('/');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded border bg-white p-6">
        <h1 className="text-2xl font-bold">Login</h1>
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={updateField} required />
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
          Login
        </button>
        <p className="text-sm text-gray-600">
          New user? <Link to="/register" className="text-blue-700">Register here</Link>
        </p>
      </form>
    </main>
  );
}

export default LoginPage;
