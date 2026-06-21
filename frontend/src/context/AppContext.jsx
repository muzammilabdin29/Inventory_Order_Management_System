import { createContext, useCallback, useContext, useState } from "react";

const AppContext = createContext(null);

let toastId = 0;

export function AppProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const pushToast = useCallback(
    (message, type = "success") => {
      const id = ++toastId;
      setToasts((current) => [...current, { id, message, type }]);
      setTimeout(() => dismissToast(id), 4000);
    },
    [dismissToast]
  );

  const notifySuccess = useCallback((message) => pushToast(message, "success"), [pushToast]);
  const notifyError = useCallback((message) => pushToast(message, "error"), [pushToast]);

  return (
    <AppContext.Provider value={{ toasts, notifySuccess, notifyError, dismissToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within an AppProvider");
  return ctx;
}
