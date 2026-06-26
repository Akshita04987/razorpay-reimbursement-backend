function ReimbursementTable({ reimbursements, showActions = false, onAction }) {
  if (!reimbursements.length) {
    return <p className="rounded border bg-white p-4 text-sm text-gray-500">No reimbursements found.</p>;
  }

  return (
    <div className="overflow-x-auto rounded border bg-white">
      <table className="w-full min-w-[760px] border-collapse text-sm">
        <thead className="bg-gray-100 text-left">
          <tr>
            <th className="p-3">Title</th>
            <th className="p-3">Employee</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
            <th className="p-3">RM</th>
            <th className="p-3">APE</th>
            {showActions && <th className="p-3">Action</th>}
          </tr>
        </thead>
        <tbody>
          {reimbursements.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-3">
                <p className="font-semibold">{item.title}</p>
                <p className="text-gray-500">{item.description || '-'}</p>
              </td>
              <td className="p-3">
                {item.employee ? item.employee.name : item.employee_id}
              </td>
              <td className="p-3">Rs. {Number(item.amount).toFixed(2)}</td>
              <td className="p-3">{item.status}</td>
              <td className="p-3">{item.rm_approved ? 'Yes' : 'No'}</td>
              <td className="p-3">{item.ape_approved ? 'Yes' : 'No'}</td>
              {showActions && (
                <td className="flex gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => onAction(item.id, 'APPROVED')}
                    className="rounded bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    type="button"
                    onClick={() => onAction(item.id, 'REJECTED')}
                    className="rounded bg-red-600 px-3 py-2 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ReimbursementTable;
