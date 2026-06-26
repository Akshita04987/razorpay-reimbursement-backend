import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';
import FormInput from '../components/FormInput';
import { ROLES } from '../constants/roles';

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'EMP' });
  const [message, setMessage] = useState('');

  const updateField = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/rest/onboardings/register', form);
      navigate('/login');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <form onSubmit={handleSubmit} className="grid gap-4 rounded border bg-white p-6">
        <h1 className="text-2xl font-bold">Register</h1>
        <FormInput label="Name" name="name" value={form.name} onChange={updateField} required />
        <FormInput label="Email" name="email" type="email" value={form.email} onChange={updateField} required />
        <FormInput label="Password" name="password" type="password" value={form.password} onChange={updateField} required />
        <label className="grid gap-1 text-sm font-medium text-gray-700">
          Role
          <select name="role" value={form.role} onChange={updateField} className="rounded border border-gray-300 px-3 py-2">
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        {message && <p className="text-sm text-red-600">{message}</p>}
        <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
          Create Account
        </button>
        <p className="text-sm text-gray-600">
          Already registered? <Link to="/login" className="text-blue-700">Login</Link>
        </p>
      </form>
    </main>
  );
}

export default RegisterPage;
