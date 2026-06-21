import { useState } from "react";
import EmptyState from "../common/EmptyState";

export default function CustomerList({ customers, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  if (customers.length === 0) {
    return (
      <EmptyState
        icon="👤"
        title="No customers yet"
        description="Add a customer before you can create an order for them."
      />
    );
  }

  async function handleDelete(customer) {
    if (!window.confirm(`Delete "${customer.full_name}"? This cannot be undone.`)) return;
    setDeletingId(customer.id);
    try {
      await onDelete(customer.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.full_name}</td>
            <td className="cell-muted">{customer.email}</td>
            <td className="cell-muted">{customer.phone}</td>
            <td>
              <div className="cell-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(customer)}
                  disabled={deletingId === customer.id}
                >
                  {deletingId === customer.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
