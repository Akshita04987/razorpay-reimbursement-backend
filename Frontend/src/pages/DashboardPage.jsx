import { useEffect, useState } from 'react';
import api from '../api/client';
import FormInput from '../components/FormInput';
import ReimbursementTable from '../components/ReimbursementTable';
import { APPROVER_ROLES, ROLES } from '../constants/roles';

function DashboardPage({ user }) {
  const [reimbursements, setReimbursements] = useState([]);
  const [users, setUsers] = useState([]);
  const [expenseForm, setExpenseForm] = useState({ title: '', description: '', amount: '' });
  const [roleForm, setRoleForm] = useState({ userId: '', role: 'EMP' });
  const [message, setMessage] = useState('');

  const loadReimbursements = async () => {
    const endpoint = user.role === 'EMP' ? '/rest/reimbursements/me' : '/rest/reimbursements';
    const response = await api.get(endpoint);
    setReimbursements(response.data.data.reimbursements);
  };

  const loadUsers = async () => {
    const response = await api.get('/rest/users');
    setUsers(response.data.data.users);
  };

  useEffect(() => {
    loadReimbursements().catch(() => setMessage('Could not load reimbursements'));
    if (user.role === 'CFO') {
      loadUsers().catch(() => setMessage('Could not load users'));
    }
  }, [user.role]);

  const updateExpense = (event) => {
    setExpenseForm({ ...expenseForm, [event.target.name]: event.target.value });
  };

  const updateRole = (event) => {
    setRoleForm({ ...roleForm, [event.target.name]: event.target.value });
  };

  const submitReimbursement = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/rest/reimbursements', {
        ...expenseForm,
        amount: Number(expenseForm.amount)
      });
      setExpenseForm({ title: '', description: '', amount: '' });
      setMessage('Reimbursement submitted');
      await loadReimbursements();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not submit reimbursement');
    }
  };

  const updateRequest = async (id, action) => {
    setMessage('');

    try {
      await api.patch(`/rest/reimbursements/${id}`, { action });
      setMessage(`Request ${action.toLowerCase()}`);
      await loadReimbursements();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not update request');
    }
  };

  const assignRole = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      await api.post('/rest/roles/assign', roleForm);
      setMessage('Role updated');
      await loadUsers();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Could not assign role');
    }
  };

  return (
    <main className="mx-auto grid max-w-6xl gap-5 px-4 py-6">
      <section className="rounded border bg-white p-5">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">Logged in as {user.name} ({user.role})</p>
        {message && <p className="mt-3 rounded bg-blue-50 p-3 text-sm text-blue-800">{message}</p>}
      </section>

      {user.role === 'EMP' && (
        <EmployeeSection
          form={expenseForm}
          reimbursements={reimbursements}
          onChange={updateExpense}
          onSubmit={submitReimbursement}
        />
      )}

      {APPROVER_ROLES.includes(user.role) && (
        <ManagerSection reimbursements={reimbursements} onAction={updateRequest} />
      )}

      {user.role === 'CFO' && (
        <CfoSection
          users={users}
          form={roleForm}
          onChange={updateRole}
          onSubmit={assignRole}
        />
      )}
    </main>
  );
}

function EmployeeSection({ form, reimbursements, onChange, onSubmit }) {
  return (
    <>
      <section className="rounded border bg-white p-5">
        <h2 className="mb-4 text-xl font-semibold">Submit Reimbursement</h2>
        <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-2">
          <FormInput label="Title" name="title" value={form.title} onChange={onChange} required />
          <FormInput label="Amount" name="amount" type="number" min="1" value={form.amount} onChange={onChange} required />
          <FormInput label="Description" as="textarea" name="description" value={form.description} onChange={onChange} className="md:col-span-2" rows="3" />
          <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800 md:w-48">
            Submit
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-xl font-semibold">My Reimbursements</h2>
        <ReimbursementTable reimbursements={reimbursements} />
      </section>
    </>
  );
}

function ManagerSection({ reimbursements, onAction }) {
  return (
    <section>
      <h2 className="mb-3 text-xl font-semibold">Reimbursement Requests</h2>
      <ReimbursementTable reimbursements={reimbursements} showActions onAction={onAction} />
    </section>
  );
}

function CfoSection({ users, form, onChange, onSubmit }) {
  return (
    <section className="grid gap-5 lg:grid-cols-[1fr_320px]">
      <div>
        <h2 className="mb-3 text-xl font-semibold">All Users</h2>
        <div className="overflow-x-auto rounded border bg-white">
          <table className="w-full min-w-[620px] text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">User ID</th>
              </tr>
            </thead>
            <tbody>
              {users.map((item) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{item.name}</td>
                  <td className="p-3">{item.email}</td>
                  <td className="p-3">{item.role}</td>
                  <td className="p-3 text-xs text-gray-500">{item.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <form onSubmit={onSubmit} className="grid h-fit gap-4 rounded border bg-white p-5">
        <h2 className="text-xl font-semibold">Assign Role</h2>
        <FormInput label="User ID" name="userId" value={form.userId} onChange={onChange} required />
        <label className="grid gap-1 text-sm font-medium text-gray-700">
          Role
          <select name="role" value={form.role} onChange={onChange} className="rounded border border-gray-300 px-3 py-2">
            {ROLES.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </label>
        <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white hover:bg-blue-800">
          Assign Role
        </button>
      </form>
    </section>
  );
}

export default DashboardPage;
