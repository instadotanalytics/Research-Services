import { useEffect, useState } from 'react';
import { Search, Trash2, Eye, X, MoreVertical, Phone, Mail, Building2, Calendar, MessageSquare } from 'lucide-react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../services/enquiryApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../../components/Loading/EmptyState.jsx';
import { ENQUIRY_STATUSES } from '../../utils/constants.js';
import './AdminEnquiries.css';

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    getEnquiries(params)
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  // Debounced search + filter
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, statusFilter]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Prevent body scroll when modal open
  useEffect(() => {
    document.body.style.overflow = selected || confirm ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [selected, confirm]);

  const onChangeStatus = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
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
      await deleteEnquiry(confirm._id);
      toast.success('Enquiry deleted');
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

  return (
    <div className="admin-enquiries-page">
      {/* Page Header */}
      <div className="admin-page-header">
        <div>
          <h1>Enquiries</h1>
          <p>
            Manage all customer enquiries
            {items.length > 0 && (
              <span className="enquiry-count-badge">{items.length}</span>
            )}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by name, email, phone, service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              className="clear-search"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <div className="empty-wrapper">
          <EmptyState
            title="No enquiries found"
            message={
              search || statusFilter !== 'all'
                ? 'Try changing filters or search term.'
                : 'New enquiries will appear here once customers submit the form.'
            }
          />
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id}>
                  <td>
                    <div className="customer-cell">
                      <div className="customer-avatar">{getInitials(e.name)}</div>
                      <div className="customer-info">
                        <strong>{e.name}</strong>
                        {e.institution && (
                          <span className="customer-sub">{e.institution}</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <div className="contact-line">
                        <Mail size={13} /> {e.email}
                      </div>
                      <div className="contact-line">
                        <Phone size={13} /> {e.phone}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="service-tag">{e.service}</span>
                  </td>
                  <td>
                    <select
                      className={`status-select status-${e.status
                        .toLowerCase()
                        .replace(/\s/g, '')}`}
                      value={e.status}
                      onChange={(ev) => onChangeStatus(e._id, ev.target.value)}
                    >
                      {ENQUIRY_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="date-cell">
                    {new Date(e.createdAt).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(ev) => toggleDropdown(ev, e._id)}
                      aria-label="Actions"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === e._id && (
                      <div className="dropdown-menu">
                        <button
                          onClick={() => {
                            setSelected(e);
                            setActiveDropdown(null);
                          }}
                        >
                          <Eye size={14} /> View Details
                        </button>
                        <button
                          className="danger"
                          onClick={() => {
                            setConfirm(e);
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

      {/* View Details Modal */}
      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-avatar">{getInitials(selected.name)}</div>
                <div>
                  <h2>{selected.name}</h2>
                  <span className="modal-subtitle">Enquiry Details</span>
                </div>
              </div>
              <button className="close-btn" onClick={() => setSelected(null)} aria-label="Close">
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
                      <a href={`mailto:${selected.email}`} className="detail-value-link">
                        {selected.email}
                      </a>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><Phone size={15} /></div>
                    <div>
                      <span className="detail-label">Phone</span>
                      <a href={`tel:${selected.phone}`} className="detail-value-link">
                        {selected.phone}
                      </a>
                    </div>
                  </div>
                  {selected.institution && (
                    <div className="detail-item">
                      <div className="detail-icon"><Building2 size={15} /></div>
                      <div>
                        <span className="detail-label">Institution</span>
                        <span className="detail-value">{selected.institution}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enquiry Info */}
              <div className="detail-section">
                <div className="section-label">Enquiry Details</div>
                <div className="detail-grid">
                  <div className="detail-item">
                    <div className="detail-icon"><MessageSquare size={15} /></div>
                    <div>
                      <span className="detail-label">Service</span>
                      <span className="detail-value">{selected.service}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><Calendar size={15} /></div>
                    <div>
                      <span className="detail-label">Date</span>
                      <span className="detail-value">
                        {new Date(selected.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <div className="detail-icon"><Phone size={15} /></div>
                    <div>
                      <span className="detail-label">Preferred Contact</span>
                      <span
                        className="detail-value"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {selected.preferredContact}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="detail-section">
                <div className="section-label">Message</div>
                <div className="message-box">
                  <p className="message-content">{selected.message}</p>
                </div>
              </div>

              {/* Status Update */}
              <div className="detail-section">
                <div className="section-label">Update Status</div>
                <div className="status-update-row">
                  {ENQUIRY_STATUSES.map((status) => (
                    <button
                      key={status}
                      className={`status-chip ${
                        selected.status === status ? 'active' : ''
                      } status-${status.toLowerCase().replace(/\s/g, '')}`}
                      onClick={() => onChangeStatus(selected._id, status)}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        open={!!confirm}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from "${confirm?.name}"? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}