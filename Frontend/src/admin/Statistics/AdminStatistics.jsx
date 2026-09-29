import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical, BarChart3, Award } from 'lucide-react';
import { getStatistics, createStatistic, updateStatistic, deleteStatistic } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import './AdminStatistics.css';

const empty = { title: '', value: '', icon: 'Award', status: true, order: 0 };

export default function AdminStatistics() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getStatistics(true)
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
    document.body.style.overflow = showModal || confirm ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal, confirm]);

  const openCreate = () => {
    setEditing(null);
    setForm(empty);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm(s);
    setShowModal(true);
    setActiveDropdown(null);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateStatistic(editing._id, form);
        toast.success('Statistic updated');
      } else {
        await createStatistic(form);
        toast.success('Statistic added');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const onDelete = async () => {
    try {
      await deleteStatistic(confirm._id);
      toast.success('Statistic deleted');
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
    <div className="admin-statistics-page">
      {/* ============ Header ============ */}
      <div className="admin-page-header">
        <div>
          <h1>Statistics</h1>
          <p>
            Manage homepage statistics and counters
            {items.length > 0 && (
              <span className="stat-count-badge">{items.length}</span>
            )}
          </p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <div className="empty-wrapper">
          <BarChart3 size={48} strokeWidth={1.5} className="empty-icon" />
          <h3>No statistics yet</h3>
          <p>Add your first statistic to display on the homepage.</p>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Your First Statistic
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Order</th>
                <th>Statistic</th>
                <th style={{ width: '140px' }}>Value</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>
                    <span className="order-badge">{s.order}</span>
                  </td>
                  <td>
                    <div className="stat-title-cell">
                      <div className="stat-icon-preview">
                        <Award size={14} />
                      </div>
                      <div>
                        <strong>{s.title}</strong>
                        <span className="stat-icon-name">Icon: {s.icon}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="stat-value-badge">{s.value}</span>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        s.status ? 'status-active' : 'status-disabled'
                      }`}
                    >
                      {s.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, s._id)}
                      aria-label="Actions"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === s._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => openEdit(s)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => {
                            setConfirm(s);
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

      {/* ============ Add/Edit Modal ============ */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon">
                  <BarChart3 size={20} />
                </div>
                <div>
                  <h2>{editing ? 'Edit Statistic' : 'Add New Statistic'}</h2>
                  <span className="modal-subtitle">
                    {editing
                      ? 'Update the counter details'
                      : 'Create a new homepage statistic'}
                  </span>
                </div>
              </div>
              <button
                className="close-btn"
                onClick={() => setShowModal(false)}
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input
                  name="title"
                  className="form-control"
                  value={form.title}
                  onChange={onChange}
                  required
                  placeholder="e.g. Research Projects Supported"
                />
                <span className="form-hint">
                  Descriptive label shown under the number
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Value *</label>
                  <input
                    name="value"
                    className="form-control"
                    value={form.value}
                    onChange={onChange}
                    required
                    placeholder="e.g. 500+"
                  />
                  <span className="form-hint">
                    Number with suffix (500+, 1000+, 50+)
                  </span>
                </div>

                <div className="form-group">
                  <label>Icon Name</label>
                  <input
                    name="icon"
                    className="form-control"
                    value={form.icon}
                    onChange={onChange}
                    placeholder="Award"
                  />
                  <span className="form-hint">
                    Lucide icon (Award, Users, FileText, Building2)
                  </span>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Display Order</label>
                  <input
                    type="number"
                    name="order"
                    className="form-control"
                    value={form.order}
                    onChange={onChange}
                    placeholder="0"
                  />
                  <span className="form-hint">Lower numbers appear first</span>
                </div>

                <div className="form-group">
                  <label>Visibility</label>
                  <label className="checkbox-toggle">
                    <input
                      type="checkbox"
                      name="status"
                      checked={form.status}
                      onChange={onChange}
                    />
                    <span className="toggle-label">
                      {form.status ? 'Active — visible on site' : 'Disabled — hidden'}
                    </span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update Statistic' : 'Create Statistic'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ Delete Confirmation ============ */}
      <ConfirmModal
        open={!!confirm}
        title="Delete Statistic"
        message={`Are you sure you want to delete "${confirm?.title}"? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}