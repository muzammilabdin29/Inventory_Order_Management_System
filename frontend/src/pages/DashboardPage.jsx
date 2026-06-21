import { useEffect, useState } from "react";
import Dashboard from "../components/dashboard/Dashboard";
import Loader from "../components/common/Loader";
import ErrorAlert from "../components/common/ErrorAlert";
import { getDashboardSummary } from "../services/api";

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    getDashboardSummary()
      .then((data) => active && setSummary(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <div className="topbar">
        <div>
          <h1>Dashboard</h1>
          <div className="topbar-subtitle">Overview of products, customers, and orders</div>
        </div>
      </div>
      <div className="page-content">
        <ErrorAlert message={error} />
        {loading ? <Loader label="Loading dashboard…" /> : summary && <Dashboard summary={summary} />}
      </div>
    </>
  );
}
