import { useEffect, useState } from 'react';
import { Trash2, Eye, X, MoreVertical, Mail, Phone, Calendar, MessageSquare, CheckCircle, Reply } from 'lucide-react';
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
  const [statusFilter, setStatusFilter] = useState('all');
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getContacts()
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Body scroll lock when modal open
  useEffect(() => {
    document.body.style.overflow = selected || confirm ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected, confirm]);

  const setStatus = async (id, status) => {
    try {
      await updateContact(id, { status });
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
      if (selected && selected._id === id) {
        setSelected({ ...selected, status });
      }
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const onDelete = async () => {
    try {
      await deleteContact(confirm._id);
      toast.success('Message deleted');
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

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  const getStatusClass = (status) => {
    if (status === 'unread') return 'status-new';
    if (status === 'read') return 'status-contacted';
    if (status === 'replied') return 'status-completed';
    return 'status-new';
  };

  // Filtered items
  const filtered =
    statusFilter === 'all'
      ? items
      : items.filter((m) => m.status === statusFilter);

  // Stats
  const stats = {
    total: items.length,
    unread: items.filter((m) => m.status === 'unread').length,
    read: items.filter((m) => m.status === 'read').length,
    replied: items.filter((m) => m.status === 'replied').length,
  };

  return (
    <div className="admin-messages-page">
      {/* ============ Header ============ */}
      <div className="admin-page-header">
        <div>
          <h1>Contact Messages</h1>
          <p>
            Messages submitted through the contact form
            {items.length > 0 && (
              <span className="message-count-badge">{items.length}</span>
            )}
          </p>
        </div>
      </div>

      {/* ============ Quick Stats ============ */}
      {items.length > 0 && (
        <div className="messages-stats">
          <button
            className={`stat-chip ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All <span className="chip-count">{stats.total}</span>
          </button>
          <button
            className={`stat-chip ${statusFilter === 'unread' ? 'active' : ''} chip-unread`}
            onClick={() => setStatusFilter('unread')}
          >
            Unread <span className="chip-count">{stats.unread}</span>
          </button>
          <button
            className={`stat-chip ${statusFilter === 'read' ? 'active' : ''} chip-read`}
            onClick={() => setStatusFilter('read')}
          >
            Read <span className="chip-count">{stats.read}</span>
          </button>
          <button
            className={`stat-chip ${statusFilter === 'replied' ? 'active' : ''} chip-replied`}
            onClick={() => setStatusFilter('replied')}
          >
            Replied <span className="chip-count">{stats.replied}</span>
          </button>
        </div>
      )}

      {/* ============ Content ============ */}
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No messages yet"
            message="Contact form submissions will appear here."
          />
        </div>
      ) : filtered.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No messages match filter"
            message="Try selecting a different filter."
          />
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr
                  key={m._id}
                  className={m.status === 'unread' ? 'row-unread' : ''}
                  onClick={() => setSelected(m)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="sender-cell">
                      <div className={`sender-avatar ${m.status === 'unread' ? 'unread' : ''}`}>
                        {getInitials(m.name)}
                      </div>
                      <div className="sender-info">
                        <strong>{m.name}</strong>
                        <span className="sender-email">{m.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="subject-text">
                      {m.subject || <em className="no-subject">No subject</em>}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusClass(m.status)}`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="date-cell">
                    {new Date(m.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, m._id)}
                      aria-label="Actions"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === m._id && (
                      <div className="dropdown-menu">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelected(m);
                            setActiveDropdown(null);
                          }}
                        >
                          <Eye size={14} /> View Message
                        </button>
                        <button
                          className="danger"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirm(m);
                            setActiveDropdown(null);
                          }}
                        >
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

      {/* ============ View Message Modal ============ */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-avatar">{getInitials(selected.name)}</div>
                <div>
                  <h2>{selected.name}</h2>
                  <span className="modal-subtitle">Message Details</span>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Contact Info */}
              <div className="detail-section">
                <div className="section-label">Contact Information</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-icon"><Mail size={15} /></div>
                    <div>
                      <span className="detail-label">Email</span>
                      <a
                        href={`mailto:${selected.email}`}
                        className="detail-value-link"
                      >
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  {selected.phone && (
                    <div className="detail-item">
                      <div className="detail-icon"><Phone size={15} /></div>
                      <div>
                        <span className="detail-label">Phone</span>
                        <a
                          href={`tel:${selected.phone}`}
                          className="detail-value-link"
                        >
                          {selected.phone}
                        </a>
                      </div>
                    </div>
                  )}
                  <div className="detail-item">
                    <div className="detail-icon"><Calendar size={15} /></div>
                    <div>
                      <span className="detail-label">Received</span>
                      <span className="detail-value">
                        {new Date(selected.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  {selected.subject && (
                    <div className="detail-item">
                      <div className="detail-icon"><MessageSquare size={15} /></div>
                      <div>
                        <span className="detail-label">Subject</span>
                        <span className="detail-value">{selected.subject}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="detail-section">
                <div className="section-label">Message</div>
                <div className="message-box">
                  <p className="message-content">{selected.message}</p>
                </div>
              </div>

              {/* Status Actions */}
              <div className="detail-section">
                <div className="section-label">Update Status</div>
                <div className="status-update-row">
                  <button
                    className={`status-chip ${
                      selected.status === 'unread' ? 'active' : ''
                    } status-new`}
                    onClick={() => setStatus(selected._id, 'unread')}
                  >
                    <Mail size={14} /> Unread
                  </button>
                  <button
                    className={`status-chip ${
                      selected.status === 'read' ? 'active' : ''
                    } status-contacted`}
                    onClick={() => setStatus(selected._id, 'read')}
                  >
                    <CheckCircle size={14} /> Read
                  </button>
                  <button
                    className={`status-chip ${
                      selected.status === 'replied' ? 'active' : ''
                    } status-completed`}
                    onClick={() => setStatus(selected._id, 'replied')}
                  >
                    <Reply size={14} /> Replied
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ Delete Confirm ============ */}
      <ConfirmModal
        open={!!confirm}
        title="Delete Message"
        message={`Are you sure you want to delete the message from "${confirm?.name}"? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}