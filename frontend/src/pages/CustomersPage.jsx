import { useEffect, useState } from "react";
import CustomerList from "../components/customers/CustomerList";
import CustomerForm from "../components/customers/CustomerForm";
import Modal from "../components/common/Modal";
import Loader from "../components/common/Loader";
import ErrorAlert from "../components/common/ErrorAlert";
import { useAppContext } from "../context/AppContext";
import { createCustomer, deleteCustomer, getCustomers } from "../services/api";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { notifySuccess, notifyError } = useAppContext();

  function loadCustomers() {
    setLoading(true);
    getCustomers()
      .then(setCustomers)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(loadCustomers, []);

  async function handleCreate(payload) {
    try {
      await createCustomer(payload);
      notifySuccess(`"${payload.full_name}" was added.`);
      setShowForm(false);
      loadCustomers();
    } catch (err) {
      notifyError(err.message);
      throw err;
    }
  }

  async function handleDelete(id) {
    try {
      await deleteCustomer(id);
      notifySuccess("Customer deleted.");
      loadCustomers();
    } catch (err) {
      notifyError(err.message);
    }
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Customers</h1>
          <div className="topbar-subtitle">People who place orders with you</div>
        </div>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>
          + Add customer
        </button>
      </div>
      <div className="page-content">
        <ErrorAlert message={error} />
        <div className="card">
          {loading ? <Loader label="Loading customers…" /> : <CustomerList customers={customers} onDelete={handleDelete} />}
        </div>
      </div>

      {showForm && (
        <Modal title="Add customer" onClose={() => setShowForm(false)}>
          <CustomerForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </Modal>
      )}
    </>
  );
}
