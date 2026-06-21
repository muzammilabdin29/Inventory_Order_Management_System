import { useState } from "react";
import EmptyState from "../common/EmptyState";

export default function OrderList({ orders, customers, onView, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  if (orders.length === 0) {
    return (
      <EmptyState
        icon="🧾"
        title="No orders yet"
        description="Create an order once you have at least one product and customer."
      />
    );
  }

  function customerName(customerId) {
    return customers.find((c) => c.id === customerId)?.full_name ?? `Customer #${customerId}`;
  }

  async function handleDelete(order) {
    if (!window.confirm(`Cancel order #${order.id}? Stock will be returned to inventory.`)) return;
    setDeletingId(order.id);
    try {
      await onDelete(order.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Order</th>
          <th>Customer</th>
          <th>Items</th>
          <th>Total</th>
          <th>Placed</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id}>
            <td style={{ fontFamily: "var(--font-mono)" }}>#{order.id}</td>
            <td>{customerName(order.customer_id)}</td>
            <td className="cell-muted">{order.items.length} item{order.items.length !== 1 ? "s" : ""}</td>
            <td>${Number(order.total_amount).toFixed(2)}</td>
            <td className="cell-muted">{new Date(order.created_at).toLocaleDateString()}</td>
            <td>
              <div className="cell-actions">
                <button className="btn btn-secondary btn-sm" onClick={() => onView(order)}>
                  View
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(order)}
                  disabled={deletingId === order.id}
                >
                  {deletingId === order.id ? "Cancelling…" : "Cancel"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
