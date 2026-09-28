import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import './AdminTestimonials.css';

const empty = { name: '', designation: '', institution: '', review: '', rating: 5, status: true, order: 0 };

export default function AdminTestimonials() {
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
    getTestimonials(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setShowModal(true); setActiveDropdown(null); };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateTestimonial(editing._id, form);
      else await createTestimonial(form);
      toast.success('Saved');
      setShowModal(false);
      load();
    } catch { toast.error('Failed'); }
  };

  const onDelete = async () => {
    try { await deleteTestimonial(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="admin-testimonials-page">
      {/* Header with small Add button on the right */}
      <div className="admin-page-header">
        <div>
          <h1>Testimonials</h1>
          <p>Manage client testimonials and reviews</p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Designation</th>
                <th>Rating</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="testimonial-name-cell">
                      <strong>{t.name}</strong>
                      <span className="testimonial-inst-preview">{t.institution}</span>
                    </div>
                  </td>
                  <td>{t.designation}</td>
                  <td className="rating-cell">{'★'.repeat(t.rating)}</td>
                  <td>
                    <span className={`status-badge ${t.status ? 'status-active' : 'status-disabled'}`}>
                      {t.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, t._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === t._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => openEdit(t)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button className="danger" onClick={() => { setConfirm(t); setActiveDropdown(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="5" className="empty-state">No testimonials found. Add one to get started.</td>
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
              <h2>{editing ? 'Edit' : 'Add'} Testimonial</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Name *</label>
                  <input name="name" className="form-control" value={form.name} onChange={onChange} required placeholder="e.g. John Doe" />
                </div>
                <div className="form-group">
                  <label>Designation</label>
                  <input name="designation" className="form-control" value={form.designation} onChange={onChange} placeholder="e.g. Professor" />
                </div>
              </div>

              <div className="form-group">
                <label>Institution</label>
                <input name="institution" className="form-control" value={form.institution} onChange={onChange} placeholder="e.g. Oxford University" />
              </div>

              <div className="form-group">
                <label>Review *</label>
                <textarea name="review" rows="3" className="form-control" value={form.review} onChange={onChange} required placeholder="Client feedback..." />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (1–5)</label>
                  <input type="number" min="1" max="5" name="rating" className="form-control" value={form.rating} onChange={onChange} />
                </div>
                <div className="form-group">
                  <label>Order</label>
                  <input type="number" name="order" className="form-control" value={form.order} onChange={onChange} />
                </div>
              </div>

              <div className="form-group checkbox-group">
                <label>
                  <input type="checkbox" name="status" checked={form.status} onChange={onChange} />
                  <span>Active (Visible on site)</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Testimonial</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete "${confirm?.name}"?`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}