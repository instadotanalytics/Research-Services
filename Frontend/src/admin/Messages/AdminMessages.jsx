import { useEffect, useState } from 'react';
import { Trash2, Eye, X, MoreVertical } from 'lucide-react';
import { getContacts, updateContact, deleteContact } from '../../services/contactApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../../components/Loading/EmptyState.jsx';
import './AdminMessages.css';

export default function AdminMessages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getContacts().then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const setStatus = async (id, status) => {
    try {
      await updateContact(id, { status });
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
      // Update the selected item if it's currently open in modal
      if (selected && selected._id === id) {
        setSelected({ ...selected, status });
      }
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

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="admin-messages-page">
      <div className="admin-page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>Messages submitted through the contact form</p>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <EmptyState title="No messages yet" />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((m) => (
                <tr key={m._id}>
                  <td><strong>{m.name}</strong></td>
                  <td className="text-muted">{m.email}</td>
                  <td>{m.subject || '—'}</td>
                  <td>
                    <span className={`status-badge ${m.status === 'unread' ? 'status-new' : m.status === 'read' ? 'status-contacted' : 'status-completed'}`}>
                      {m.status}
                    </span>
                  </td>
                  <td>{new Date(m.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, m._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === m._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => { setSelected(m); setActiveDropdown(null); }}>
                          <Eye size={14} /> View Message
                        </button>
                        <button className="danger" onClick={() => { setConfirm(m); setActiveDropdown(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* View Message Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Message Details</h2>
              <button className="close-btn" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">From</span>
                <span className="detail-value">{selected.name} ({selected.email})</span>
              </div>

              {selected.phone && (
                <div className="detail-row">
                  <span className="detail-label">Phone</span>
                  <span className="detail-value">{selected.phone}</span>
                </div>
              )}

              {selected.subject && (
                <div className="detail-row">
                  <span className="detail-label">Subject</span>
                  <span className="detail-value">{selected.subject}</span>
                </div>
              )}

              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge ${selected.status === 'unread' ? 'status-new' : selected.status === 'read' ? 'status-contacted' : 'status-completed'}`}>
                  {selected.status}
                </span>
              </div>

              <div className="message-box">
                <div className="message-label">Message</div>
                <p className="message-content">{selected.message}</p>
              </div>

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