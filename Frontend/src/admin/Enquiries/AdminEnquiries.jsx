import { useEffect, useState } from 'react';
import { Search, Trash2, Eye, X, MoreVertical } from 'lucide-react';
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
    getEnquiries(params).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

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

  const onChangeStatus = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
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

  return (
    <div className="admin-enquiries-page">
      <div className="admin-page-header">
        <div>
          <h1>Enquiries</h1>
          <p>Manage all customer enquiries</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-filters">
        <div className="admin-search-box">
          <Search size={18} className="search-icon" />
          <input
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="filter-select"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <EmptyState title="No enquiries found" message="Try changing filters or wait for new enquiries." />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td className="text-muted">{e.email}</td>
                  <td className="text-muted">{e.phone}</td>
                  <td>{e.service}</td>
                  <td>
                    <select
                      className="status-select"
                      value={e.status}
                      onChange={(ev) => onChangeStatus(e._id, ev.target.value)}
                    >
                      {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(ev) => toggleDropdown(ev, e._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === e._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => { setSelected(e); setActiveDropdown(null); }}>
                          <Eye size={14} /> View Details
                        </button>
                        <button className="danger" onClick={() => { setConfirm(e); setActiveDropdown(null); }}>
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
              <h2>Enquiry Details</h2>
              <button className="close-btn" onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="detail-row">
                <span className="detail-label">Name</span>
                <span className="detail-value">{selected.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Email</span>
                <span className="detail-value">{selected.email}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Phone</span>
                <span className="detail-value">{selected.phone}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Service</span>
                <span className="detail-value">{selected.service}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Institution</span>
                <span className="detail-value">{selected.institution || '—'}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Preferred Contact</span>
                <span className="detail-value">{selected.preferredContact}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className={`status-badge status-${selected.status.toLowerCase().replace(/\s/g, '')}`}>
                  {selected.status}
                </span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Date</span>
                <span className="detail-value">{new Date(selected.createdAt).toLocaleString()}</span>
              </div>

              <div className="message-box">
                <div className="message-label">Message</div>
                <p className="message-content">{selected.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Enquiry"
        message={`Are you sure you want to delete the enquiry from "${confirm?.name}"?`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}