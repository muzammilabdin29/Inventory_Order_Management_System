import { useEffect, useState } from "react";
import OrderList from "../components/orders/OrderList";
import OrderForm from "../components/orders/OrderForm";
import OrderDetails from "../components/orders/OrderDetails";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import ErrorAlert from "../components/common/ErrorAlert";
import { useAppContext } from "../context/AppContext";
import { createOrder, deleteOrder, getCustomers, getOrders, getProducts } from "../services/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewingOrder, setViewingOrder] = useState(null);
  const { notifySuccess, notifyError } = useAppContext();

  function loadAll() {
    setLoading(true);
    Promise.all([getOrders(), getCustomers(), getProducts()])
      .then(([ordersData, customersData, productsData]) => {
        setOrders(ordersData);
        setCustomers(customersData);
        setProducts(productsData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadAll, []);

  async function handleCreate(payload) {
    await createOrder(payload);
    notifySuccess(`Order placed successfully.`);
    setShowForm(false);
    loadAll();
  }

  async function handleDelete(id) {
    try {
      await deleteOrder(id);
      notifySuccess("Order cancelled and stock restored.");
      loadAll();
    } catch (err) {
      notifyError(err.message);
    }
  }

  const canCreateOrder = customers.length > 0 && products.length > 0;

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Orders</h1>
          <div className="topbar-subtitle">Create and track customer orders</div>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowForm(true)}
          disabled={!canCreateOrder}
          title={canCreateOrder ? "" : "Add a product and a customer first"}
        >
          + New order
        </button>
      </div>
      <div className="page-content">
        <ErrorAlert message={error} />
        <div className="card">
          {loading ? (
            <Loader label="Loading orders…" />
          ) : (
            <OrderList orders={orders} customers={customers} onView={setViewingOrder} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {showForm && (
        <Modal title="New order" onClose={() => setShowForm(false)}>
          <OrderForm customers={customers} products={products} onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}

      {viewingOrder && (
        <Modal title={`Order #${viewingOrder.id}`} onClose={() => setViewingOrder(null)}>
          <OrderDetails order={viewingOrder} />
        </Modal>
      )}
    </>
  );
}
