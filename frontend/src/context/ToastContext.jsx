/* eslint-disable react-refresh/only-export-components -- provider + useToast hook are intentionally co-located */
import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle2, XCircle, X } from "lucide-react";

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const push = useCallback(
    (message, type) => {
      const id = ++idCounter;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => remove(id), 4000);
    },
    [remove]
  );

  const toast = useMemo(
    () => ({
      success: (message) => push(message, "success"),
      error: (message) => push(message, "error"),
    }),
    [push]
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2.5 w-[calc(100%-3rem)] max-w-sm pointer-events-none">
        {toasts.map((t) => {
          const isError = t.type === "error";
          const Icon = isError ? XCircle : CheckCircle2;

          return (
            <div
              key={t.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3.5 shadow-lg shadow-slate-900/10 bg-white animate-[toast-in_0.25s_ease-out] ${
                isError ? "border-red-100" : "border-emerald-100"
              }`}
            >
              <Icon
                size={18}
                className={`shrink-0 mt-0.5 ${
                  isError ? "text-red-600" : "text-emerald-600"
                }`}
              />
              <p className="text-sm text-slate-700 flex-1 leading-snug">
                {t.message}
              </p>
              <button
                onClick={() => remove(t.id)}
                className="shrink-0 text-slate-400 hover:text-slate-600 transition"
              >
                <X size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
}
