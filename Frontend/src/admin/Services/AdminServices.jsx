import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getServices, createService, updateService, deleteService } from '../../services/serviceApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import { slugify } from '../../utils/slugify.js';

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
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getServices(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({ ...emptyForm, ...s });
    setShowModal(true);
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

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Services</h1>
          <p>Manage your service offerings</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Slug</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>{s.order}</td>
                  <td><strong>{s.title}</strong></td>
                  <td><code style={{ fontSize: '0.8rem' }}>{s.slug}</code></td>
                  <td>
                    <span className={`status-badge ${s.status ? 'status-completed' : 'status-closed'}`}>
                      {s.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => openEdit(s)}><Edit size={15} /></button>{' '}
                    <button className="icon-btn" onClick={() => setConfirm(s)}><Trash2 size={15} color="#dc2626" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Service' : 'Add Service'}</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group">
                <label>Title *</label>
                <input name="title" className="form-control" value={form.title} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Slug *</label>
                <input name="slug" className="form-control" value={form.slug} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Short Description *</label>
                <textarea name="shortDescription" rows="2" className="form-control" value={form.shortDescription} onChange={onChange} required />
              </div>
              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea name="description" rows="4" className="form-control" value={form.description} onChange={onChange} required />
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
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="status" checked={form.status} onChange={onChange} /> Active
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Service"
        message={`Delete "${confirm?.title}"? This cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}