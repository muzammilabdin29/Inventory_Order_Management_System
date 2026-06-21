export default function OrderDetails({ order }) {
  if (!order) return null;

  return (
    <div>
      <div className="form-grid" style={{ marginBottom: 18 }}>
        <div>
          <div className="cell-muted" style={{ fontSize: 12.5, marginBottom: 4 }}>Order ID</div>
          <div style={{ fontFamily: "var(--font-mono)" }}>#{order.id}</div>
        </div>
        <div>
          <div className="cell-muted" style={{ fontSize: 12.5, marginBottom: 4 }}>Status</div>
          <span className="badge badge-success">
            <span className="badge-dot" />
            {order.status}
          </span>
        </div>
        <div>
          <div className="cell-muted" style={{ fontSize: 12.5, marginBottom: 4 }}>Placed on</div>
          <div>{new Date(order.created_at).toLocaleString()}</div>
        </div>
        <div>
          <div className="cell-muted" style={{ fontSize: 12.5, marginBottom: 4 }}>Total amount</div>
          <div style={{ fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            ${Number(order.total_amount).toFixed(2)}
          </div>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>SKU</th>
            <th>Qty</th>
            <th>Unit price</th>
            <th>Line total</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.id}>
              <td>{item.product?.name ?? `Product #${item.product_id}`}</td>
              <td>{item.product?.sku && <span className="sku-tag">{item.product.sku}</span>}</td>
              <td>{item.quantity}</td>
              <td className="cell-muted">${Number(item.unit_price).toFixed(2)}</td>
              <td>${(Number(item.unit_price) * item.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
