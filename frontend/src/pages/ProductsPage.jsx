import { useEffect, useState } from "react";
import ProductList from "../components/products/ProductList";
import ProductForm from "../components/products/ProductForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import ErrorAlert from "../components/common/ErrorAlert";
import { useAppContext } from "../context/AppContext";
import { createProduct, deleteProduct, getProducts, updateProduct } from "../services/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalMode, setModalMode] = useState(null); // null | "create" | { editing: product }
  const { notifySuccess, notifyError } = useAppContext();

  function loadProducts() {
    setLoading(true);
    getProducts()
      .then(setProducts)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadProducts, []);

  async function handleCreate(payload) {
    try {
      await createProduct(payload);
      notifySuccess(`"${payload.name}" was added to inventory.`);
      setModalMode(null);
      loadProducts();
    } catch (err) {
      notifyError(err.message);
      throw err;
    }
  }

  async function handleUpdate(payload) {
    try {
      await updateProduct(modalMode.editing.id, payload);
      notifySuccess(`"${payload.name}" was updated.`);
      setModalMode(null);
      loadProducts();
    } catch (err) {
      notifyError(err.message);
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      await deleteProduct(id);
      notifySuccess("Product deleted.");
      loadProducts();
    } catch (err) {
      notifyError(err.message);
    }
  }

  const isEditing = modalMode && modalMode !== "create";

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Products</h1>
          <div className="topbar-subtitle">Manage your catalog and stock levels</div>
        </div>
        <button className="btn btn-primary" onClick={() => setModalMode("create")}>
          + Add product
        </button>
      </div>
      <div className="page-content">
        <ErrorAlert message={error} />
        <div className="card">
          {loading ? (
            <Loader label="Loading products…" />
          ) : (
            <ProductList products={products} onEdit={(p) => setModalMode({ editing: p })} onDelete={handleDelete} />
          )}
        </div>
      </div>

      {modalMode === "create" && (
        <Modal title="Add product" onClose={() => setModalMode(null)}>
          <ProductForm onSubmit={handleCreate} onCancel={() => setModalMode(null)} submitLabel="Add product" />
        </Modal>
      )}

      {isEditing && (
        <Modal title="Edit product" onClose={() => setModalMode(null)}>
          <ProductForm
            initialValues={{
              name: modalMode.editing.name,
              sku: modalMode.editing.sku,
              price: String(modalMode.editing.price),
              quantity_in_stock: String(modalMode.editing.quantity_in_stock),
            }}
            onSubmit={handleUpdate}
            onCancel={() => setModalMode(null)}
            submitLabel="Save changes"
          />
        </Modal>
      )}
    </>
  );
}
