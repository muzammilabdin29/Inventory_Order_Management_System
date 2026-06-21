import ProductCard from "../products/ProductCard";

export default function Dashboard({ summary }) {
  const { total_products, total_customers, total_orders, low_stock_products } = summary;

  return (
    <>
      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-card-label">Total products</div>
          <div className="stat-card-value">{total_products}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total customers</div>
          <div className="stat-card-value">{total_customers}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Total orders</div>
          <div className="stat-card-value">{total_orders}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-label">Low stock items</div>
          <div className={`stat-card-value ${low_stock_products.length > 0 ? "warn" : ""}`}>
            {low_stock_products.length}
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2>Low stock products</h2>
          <span className="cell-muted" style={{ fontSize: 12.5 }}>10 units or fewer</span>
        </div>
        <div className="card-body">
          {low_stock_products.length === 0 ? (
            <p className="cell-muted" style={{ margin: 0 }}>Everything's well stocked. Nothing needs reordering.</p>
          ) : (
            low_stock_products.map((product) => <ProductCard key={product.id} product={product} />)
          )}
        </div>
      </div>
    </>
  );
}
