// Compact product row used outside the main table -- e.g. the dashboard's
// low-stock widget, where a full table would be too heavy.
export default function ProductCard({ product }) {
  return (
    <div className="low-stock-row">
      <div>
        <div>{product.name}</div>
        <span className="sku-tag">{product.sku}</span>
      </div>
      <span className="badge badge-danger">
        <span className="badge-dot" />
        {product.quantity_in_stock} left
      </span>
    </div>
  );
}
