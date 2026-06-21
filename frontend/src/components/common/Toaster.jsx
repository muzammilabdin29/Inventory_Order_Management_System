import { useAppContext } from "../../context/AppContext";

export default function Toaster() {
  const { toasts, dismissToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <div style={{ position: "fixed", top: 18, right: 18, zIndex: 100, display: "flex", flexDirection: "column", gap: 8 }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"}`}
          style={{ marginBottom: 0, cursor: "pointer", minWidth: 240 }}
          onClick={() => dismissToast(toast.id)}
        >
          <span>{toast.type === "error" ? "⚠" : "✓"}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
