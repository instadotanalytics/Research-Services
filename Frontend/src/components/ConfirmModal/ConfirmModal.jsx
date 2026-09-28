import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({ open, title = 'Confirm', message, onConfirm, onCancel, confirmText = 'Confirm', danger = false }) {
  if (!open) return null;
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(15,23,42,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: 20,
      }}
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: '#fff',
          borderRadius: 16,
          padding: 28,
          maxWidth: 420,
          width: '100%',
          position: 'relative',
        }}
      >
        <button onClick={onCancel} style={{ position: 'absolute', top: 16, right: 16, color: '#64748b' }}>
          <X size={20} />
        </button>
        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: danger ? '#fef2f2' : '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AlertTriangle size={22} color={danger ? '#dc2626' : '#2563eb'} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 18, marginBottom: 6 }}>{title}</h3>
            <p style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>{message}</p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button className="btn btn-ghost" onClick={onCancel}>
                Cancel
              </button>
              <button
                className="btn"
                onClick={onConfirm}
                style={{
                  background: danger ? '#dc2626' : '#1e3a8a',
                  color: '#fff',
                }}
              >
                {confirmText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}