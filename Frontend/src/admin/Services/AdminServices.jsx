import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../services/serviceApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import { slugify } from '../../utils/slugify.js';
import './AdminServices.css';

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  icon: 'FileText',
  ctaText: 'Get Research Assistance',
  status: true,
  order: 0,
};

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [confirm, setConfirm] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getServices(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...emptyForm, ...s });
    setShowModal(true);
    setActiveDropdown(null);
  };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const v = type === 'checkbox' ? checked : value;
    setForm((prev) => {
      const next = { ...prev, [name]: v };
      if (name === 'title' && !editing) next.slug = slugify(value);
      return next;
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateService(editing._id, form);
        toast.success('Service updated');
      } else {
        await createService(form);
        toast.success('Service created');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    }
  };

  const onDelete = async () => {
    try {
      await deleteService(confirm._id);
      toast.success('Service deleted');
      setConfirm(null);
      load();
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="admin-services-page">
      {/* Header with small Add Service button on the right */}
      <div className="admin-page-header">
        <div>
          <h1>Services</h1>
          <p>Manage your service offerings and visibility</p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td><span className="order-badge">{s.order}</span></td>
                  <td>
                    <div className="service-title-cell">
                      <strong>{s.title}</strong>
                      <span className="service-desc-preview">{s.shortDescription}</span>
                    </div>
                  </td>
                  <td><code className="slug-code">{s.slug}</code></td>
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
                  <td colSpan="5" className="empty-state">No services found. Add one to get started.</td>
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
              <h2>{editing ? 'Edit Service' : 'Add New Service'}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" className="form-control" value={form.title} onChange={onChange} required placeholder="e.g. Dissertation Help" />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input name="slug" className="form-control" value={form.slug} onChange={onChange} required placeholder="dissertation-help" />
              </div>
              <div className="form-group">
                <label>Short Description *</label>
                <textarea name="shortDescription" rows="2" className="form-control" value={form.shortDescription} onChange={onChange} required placeholder="Brief summary for the card..." />
              </div>
              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea name="description" rows="4" className="form-control" value={form.description} onChange={onChange} required placeholder="Full details..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon Name</label>
                  <input name="icon" className="form-control" value={form.icon} onChange={onChange} placeholder="FileText" />
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" name="order" className="form-control" value={form.order} onChange={onChange} />
                </div>
              </div>

              <div className="form-group">
                <label>CTA Text</label>
                <input name="ctaText" className="form-control" value={form.ctaText} onChange={onChange} />
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="status" checked={form.status} onChange={onChange} />
                  <span>Active (Visible on site)</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update Service' : 'Create Service'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Service"
        message={`Are you sure you want to delete "${confirm?.title}"? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}