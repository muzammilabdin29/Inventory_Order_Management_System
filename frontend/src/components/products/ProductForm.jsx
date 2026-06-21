import { useState } from "react";

const emptyForm = { name: "", sku: "", price: "", quantity_in_stock: "" };

export default function ProductForm({ initialValues, onSubmit, onCancel, submitLabel = "Save product" }) {
  const [form, setForm] = useState(initialValues || emptyForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = "Product name is required.";
    if (!form.sku.trim()) next.sku = "SKU is required.";
    if (form.price === "" || Number(form.price) <= 0) next.price = "Price must be greater than 0.";
    if (form.quantity_in_stock === "" || Number(form.quantity_in_stock) < 0)
      next.quantity_in_stock = "Stock cannot be negative.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await onSubmit({
        name: form.name.trim(),
        sku: form.sku.trim(),
        price: Number(form.price),
        quantity_in_stock: Number(form.quantity_in_stock),
      });
    } finally {
      setSubmitting(false);
    }
  }

  function handleChange(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-field full">
          <label htmlFor="name">Product name</label>
          <input
            id="name"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Wireless Mouse"
          />
          {errors.name && <span className="form-error">{errors.name}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="sku">SKU / code</label>
          <input
            id="sku"
            value={form.sku}
            onChange={(e) => handleChange("sku", e.target.value)}
            placeholder="e.g. WM-2042"
          />
          {errors.sku && <span className="form-error">{errors.sku}</span>}
        </div>

        <div className="form-field">
          <label htmlFor="price">Price ($)</label>
          <input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            placeholder="0.00"
          />
          {errors.price && <span className="form-error">{errors.price}</span>}
        </div>

        <div className="form-field full">
          <label htmlFor="quantity">Quantity in stock</label>
          <input
            id="quantity"
            type="number"
            min="0"
            value={form.quantity_in_stock}
            onChange={(e) => handleChange("quantity_in_stock", e.target.value)}
            placeholder="0"
          />
          {errors.quantity_in_stock && <span className="form-error">{errors.quantity_in_stock}</span>}
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
