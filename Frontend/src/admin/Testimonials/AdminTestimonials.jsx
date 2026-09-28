import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical, Star, Quote } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import './AdminTestimonials.css';

const empty = {
  name: '',
  designation: '',
  institution: '',
  review: '',
  rating: 5,
  status: true,
  order: 0,
};

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
    getTestimonials(true)
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

  const openEdit = (t) => {
    setEditing(t);
    setForm(t);
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
        await updateTestimonial(editing._id, form);
        toast.success('Testimonial updated');
      } else {
        await createTestimonial(form);
        toast.success('Testimonial added');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save');
    }
  };

  const onDelete = async () => {
    try {
      await deleteTestimonial(confirm._id);
      toast.success('Testimonial deleted');
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
    <div className="admin-testimonials-page">
      {/* ============ Header ============ */}
      <div className="admin-page-header">
        <div>
          <h1>Testimonials</h1>
          <p>
            Manage client testimonials and reviews
            {items.length > 0 && (
              <span className="testimonial-count-badge">{items.length}</span>
            )}
          </p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Testimonial
        </button>
      </div>

      {/* ============ Content ============ */}
      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <div className="empty-wrapper">
          <Quote size={48} strokeWidth={1.5} className="empty-icon" />
          <h3>No testimonials yet</h3>
          <p>Add your first testimonial to showcase client feedback.</p>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Your First Testimonial
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Designation</th>
                <th style={{ width: '130px' }}>Rating</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id}>
                  <td>
                    <div className="testimonial-name-cell">
                      <div className="testimonial-avatar">
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <strong>{t.name}</strong>
                        {t.institution && (
                          <span className="testimonial-inst-preview">
                            {t.institution}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="designation-text">
                      {t.designation || '—'}
                    </span>
                  </td>
                  <td>
                    <div className="rating-stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={14}
                          className={n <= t.rating ? 'star-filled' : 'star-empty'}
                          fill={n <= t.rating ? 'currentColor' : 'none'}
                        />
                      ))}
                      <span className="rating-number">{t.rating}.0</span>
                    </div>
                  </td>
                  <td>
                    <span
                      className={`status-badge ${
                        t.status ? 'status-active' : 'status-disabled'
                      }`}
                    >
                      {t.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, t._id)}
                      aria-label="Actions"
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === t._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => openEdit(t)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          className="danger"
                          onClick={() => {
                            setConfirm(t);
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
                  <Star size={20} />
                </div>
                <div>
                  <h2>{editing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
                  <span className="modal-subtitle">
                    {editing
                      ? 'Update the testimonial details'
                      : 'Create a new client testimonial'}
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
              <div className="form-row">
                <div className="form-group">
                  <label>Client Name *</label>
                  <input
                    name="name"
                    className="form-control"
                    value={form.name}
                    onChange={onChange}
                    required
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>

                <div className="form-group">
                  <label>Designation</label>
                  <input
                    name="designation"
                    className="form-control"
                    value={form.designation}
                    onChange={onChange}
                    placeholder="e.g. PhD Scholar"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Institution</label>
                <input
                  name="institution"
                  className="form-control"
                  value={form.institution}
                  onChange={onChange}
                  placeholder="e.g. Delhi University"
                />
              </div>

              <div className="form-group">
                <label>Review *</label>
                <textarea
                  name="review"
                  rows="4"
                  className="form-control"
                  value={form.review}
                  onChange={onChange}
                  required
                  placeholder="Client feedback / testimonial text..."
                  maxLength={500}
                />
                <span className="form-hint">
                  {form.review.length} / 500 characters
                </span>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Rating (1–5)</label>
                  <div className="rating-picker">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        className={`rating-star-btn ${
                          n <= form.rating ? 'active' : ''
                        }`}
                        onClick={() =>
                          setForm({ ...form, rating: n })
                        }
                        aria-label={`Rate ${n} stars`}
                      >
                        <Star
                          size={22}
                          fill={n <= form.rating ? 'currentColor' : 'none'}
                        />
                      </button>
                    ))}
                    <span className="rating-value">{form.rating}.0</span>
                  </div>
                </div>

                <div className="form-group">
                  <label>Order</label>
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
              </div>

              <div className="form-group">
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

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editing ? 'Update Testimonial' : 'Create Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ Delete Confirmation ============ */}
      <ConfirmModal
        open={!!confirm}
        title="Delete Testimonial"
        message={`Are you sure you want to delete the testimonial from "${confirm?.name}"? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete"
      />
    </div>
  );
}