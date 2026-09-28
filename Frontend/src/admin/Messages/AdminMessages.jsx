import { useEffect, useState } from 'react';
import { Trash2, Eye, X } from 'lucide-react';
import { getContacts, updateContact, deleteContact } from '../../services/contactApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../../components/Loading/EmptyState.jsx';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getContacts().then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const setStatus = async (id, status) => {
    try {
      await updateContact(id, { status });
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
      toast.success('Updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const onDelete = async () => {
    try {
      await deleteContact(confirm._id);
      toast.success('Deleted');
      setConfirm(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>Messages submitted through contact form</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <EmptyState title="No messages yet" />
      ) : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m._id}>
                  <td><strong>{m.name}</strong></td>
                  <td>{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td>
                    <span className={`status-badge ${m.status === 'unread' ? 'status-new' : m.status === 'read' ? 'status-contacted' : 'status-completed'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => setSelected(m)}><Eye size={15} /></button>{' '}
                    <button className="icon-btn" onClick={() => setConfirm(m)}><Trash2 size={15} color="#dc2626" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <p><strong>From:</strong> {selected.name} ({selected.email})</p>
              {selected.phone && <p><strong>Phone:</strong> {selected.phone}</p>}
              {selected.subject && <p><strong>Subject:</strong> {selected.subject}</p>}
              <p style={{ marginTop: 12, padding: 14, background: '#f8fafc', borderRadius: 10, lineHeight: 1.7 }}>{selected.message}</p>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setStatus(selected._id, 'read')}>Mark Read</button>
                <button className="btn btn-primary" onClick={() => setStatus(selected._id, 'replied')}>Mark Replied</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Message"
        message="This action cannot be undone."
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}