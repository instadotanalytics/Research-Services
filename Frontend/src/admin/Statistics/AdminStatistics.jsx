import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical } from 'lucide-react';
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
    getStatistics(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm(s); setShowModal(true); setActiveDropdown(null); };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateStatistic(editing._id, form);
      else await createStatistic(form);
      toast.success('Saved');
      setShowModal(false);
      load();
    } catch { toast.error('Failed'); }
  };

  const onDelete = async () => {
    try { await deleteStatistic(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="admin-statistics-page">
      {/* Header with small Add button on the right */}
      <div className="admin-page-header">
        <div>
          <h1>Statistics</h1>
          <p>Manage homepage statistics and counters</p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Statistic
        </button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Title</th>
                <th>Value</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td><span className="order-badge">{s.order}</span></td>
                  <td>
                    <div className="stat-title-cell">
                      <strong>{s.title}</strong>
                      <span className="stat-icon-preview">Icon: {s.icon}</span>
                    </div>
                  </td>
                  <td><span className="stat-value-badge">{s.value}</span></td>
                  <td>
                    <span className={`status-badge ${s.status ? 'status-active' : 'status-disabled'}`}>
                      {s.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, s._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === s._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => openEdit(s)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button className="danger" onClick={() => { setConfirm(s); setActiveDropdown(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">No statistics found. Add one to get started.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit' : 'Add'} Statistic</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" className="form-control" value={form.title} onChange={onChange} required placeholder="e.g. Projects Completed" />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Value *</label>
                  <input name="value" className="form-control" value={form.value} onChange={onChange} required placeholder="e.g. 500+" />
                </div>
                <div className="form-group">
                  <label>Icon Name</label>
                  <input name="icon" className="form-control" value={form.icon} onChange={onChange} placeholder="Award" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" name="order" className="form-control" value={form.order} onChange={onChange} />
                </div>
                <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'flex-end', paddingBottom: '10px' }}>
                  <label>
                    <input type="checkbox" name="status" checked={form.status} onChange={onChange} />
                    <span>Active (Visible on site)</span>
                  </label>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Statistic</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Statistic"
        message={`Are you sure you want to delete "${confirm?.title}"?`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}