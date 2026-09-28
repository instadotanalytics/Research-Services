import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const removeToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  const toast = {
    success: (m) => addToast(m, 'success'),
    error: (m) => addToast(m, 'error'),
    info: (m) => addToast(m, 'info'),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((t) => (
          <div
            key={t.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '14px 18px',
              borderRadius: 10,
              background: '#fff',
              boxShadow: '0 8px 24px rgba(15,23,42,0.15)',
              borderLeft: `4px solid ${t.type === 'success' ? '#16a34a' : t.type === 'error' ? '#dc2626' : '#2563eb'}`,
              minWidth: 280,
              maxWidth: 400,
              animation: 'slideIn 0.3s ease',
            }}
          >
            {t.type === 'success' && <CheckCircle size={20} color="#16a34a" />}
            {t.type === 'error' && <XCircle size={20} color="#dc2626" />}
            {t.type === 'info' && <Info size={20} color="#2563eb" />}
            <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{t.message}</span>
            <button onClick={() => removeToast(t.id)} style={{ color: '#64748b' }}>
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);