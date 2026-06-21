import { useState } from "react";

const blankLine = () => ({ product_id: "", quantity: 1 });

export default function OrderForm({ customers, products, onSubmit, onCancel }) {
  const [customerId, setCustomerId] = useState("");
  const [lines, setLines] = useState([blankLine()]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function updateLine(index, field, value) {
    setLines((prev) => prev.map((line, i) => (i === index ? { ...line, [field]: value } : line)));
  }

  function addLine() {
    setLines((prev) => [...prev, blankLine()]);
  }

  function removeLine(index) {
    setLines((prev) => prev.filter((_, i) => i !== index));
  }

  function productFor(id) {
    return products.find((p) => p.id === Number(id));
  }

  const estimatedTotal = lines.reduce((sum, line) => {
    const product = productFor(line.product_id);
    if (!product || !line.quantity) return sum;
    return sum + Number(product.price) * Number(line.quantity);
  }, 0);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!customerId) {
      setError("Select a customer for this order.");
      return;
    }
    const validLines = lines.filter((l) => l.product_id && Number(l.quantity) > 0);
    if (validLines.length === 0) {
      setError("Add at least one product line with a quantity greater than 0.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        customer_id: Number(customerId),
        items: validLines.map((l) => ({ product_id: Number(l.product_id), quantity: Number(l.quantity) })),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-field full" style={{ marginBottom: 16 }}>
        <label htmlFor="customer">Customer</label>
        <select id="customer" value={customerId} onChange={(e) => setCustomerId(e.target.value)}>
          <option value="">Select a customer…</option>
          {customers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.full_name} — {c.email}
            </option>
          ))}
        </select>
      </div>

      <label style={{ fontSize: 12.5, fontWeight: 600, display: "block", marginBottom: 8 }}>Order items</label>

      {lines.map((line, index) => {
        const product = productFor(line.product_id);
        const exceedsStock = product && Number(line.quantity) > product.quantity_in_stock;
        return (
          <div key={index} className="order-line">
            <div className="form-field">
              <select value={line.product_id} onChange={(e) => updateLine(index, "product_id", e.target.value)}>
                <option value="">Select a product…</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.sku}) — {p.quantity_in_stock} in stock
                  </option>
                ))}
              </select>
            </div>
            <div className="form-field">
              <input
                type="number"
                min="1"
                value={line.quantity}
                onChange={(e) => updateLine(index, "quantity", e.target.value)}
                placeholder="Qty"
              />
              {exceedsStock && (
                <span className="form-error">Only {product.quantity_in_stock} available.</span>
              )}
            </div>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => removeLine(index)}
              disabled={lines.length === 1}
            >
              Remove
            </button>
          </div>
        );
      })}

      <button type="button" className="btn btn-secondary btn-sm" onClick={addLine}>
        + Add another product
      </button>

      <div className="order-total-row">
        <span>Estimated total</span>
        <span>${estimatedTotal.toFixed(2)}</span>
      </div>

      {error && <p className="form-error" style={{ marginTop: 12 }}>{error}</p>}

      <div className="form-actions" style={{ marginTop: 18 }}>
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Placing order…" : "Place order"}
        </button>
      </div>
    </form>
  );
}
