import { useState } from "react";
import EmptyState from "../common/EmptyState";

const LOW_STOCK_THRESHOLD = 10;

export default function ProductList({ products, onEdit, onDelete }) {
  const [deletingId, setDeletingId] = useState(null);

  if (products.length === 0) {
    return (
      <EmptyState
        icon="📦"
        title="No products yet"
        description="Add your first product to start tracking inventory."
      />
    );
  }

  async function handleDelete(product) {
    if (!window.confirm(`Delete "${product.name}"? This cannot be undone.`)) return;
    setDeletingId(product.id);
    try {
      await onDelete(product.id);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Product</th>
          <th>SKU</th>
          <th>Price</th>
          <th>Stock</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => {
          const lowStock = product.quantity_in_stock <= LOW_STOCK_THRESHOLD;
          return (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>
                <span className="sku-tag">{product.sku}</span>
              </td>
              <td className="cell-muted">${Number(product.price).toFixed(2)}</td>
              <td>
                <span className={`badge ${lowStock ? "badge-danger" : "badge-success"}`}>
                  <span className="badge-dot" />
                  {product.quantity_in_stock} in stock
                </span>
              </td>
              <td>
                <div className="cell-actions">
                  <button className="btn btn-secondary btn-sm" onClick={() => onEdit(product)}>
                    Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product)}
                    disabled={deletingId === product.id}
                  >
                    {deletingId === product.id ? "Deleting…" : "Delete"}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
