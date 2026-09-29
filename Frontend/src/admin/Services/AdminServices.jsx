import { useEffect, useRef, useState } from 'react';
import {
  Plus,
  Edit,
  Trash2,
  X,
  MoreVertical,
  Briefcase,
  Search,
  ExternalLink,
  ImagePlus,
  Loader2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { getServices, createService, updateService, deleteService } from '../../services/serviceApi.js';
import { uploadImage } from '../../services/uploadApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import { TableSkeletonRows } from '../../components/Skeleton/Skeleton.jsx';
import { withMinDelay } from '../../utils/minDelay.js';
import { slugify } from '../../utils/slugify.js';
import './AdminServices.css';

const emptyForm = {
  title: '',
  slug: '',
  shortDescription: '',
  description: '',
  icon: 'FileText',
  image: '',
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
  const [menuPos, setMenuPos] = useState({ top: 'auto', bottom: 'auto', right: 16 });
  const [search, setSearch] = useState('');
  const toast = useToast();

  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const onImagePick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return toast.error('Please select an image file');
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setForm((p) => ({ ...p, image: data.url }));
      toast.success('Image uploaded');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const load = () => {
    setLoading(true);
    withMinDelay(getServices(true))
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  // Close dropdown on outside click, scroll, or resize
  useEffect(() => {
    const close = () => setActiveDropdown(null);
    document.addEventListener('click', close);
    window.addEventListener('scroll', close, true); // capture: catches inner scroll containers too
    window.addEventListener('resize', close);
    return () => {
      document.removeEventListener('click', close);
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
    };
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
        toast.success('Service updated successfully');
      } else {
        await createService(form);
        toast.success('Service created successfully');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service');
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
    if (activeDropdown === id) return setActiveDropdown(null);

    const rect = e.currentTarget.getBoundingClientRect();
    const MENU_HEIGHT = 150; // approx height of the 3-item menu
    const openUp = window.innerHeight - rect.bottom < MENU_HEIGHT;

    setMenuPos({
      top: openUp ? 'auto' : rect.bottom + 4,
      bottom: openUp ? window.innerHeight - rect.top + 4 : 'auto',
      right: Math.max(window.innerWidth - rect.right, 8),
    });
    setActiveDropdown(id);
  };

  const filtered = search
    ? items.filter(
      (s) =>
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.slug.toLowerCase().includes(search.toLowerCase())
    )
    : items;

  return (
    <div className="admin-services-page">
      <div className="admin-page-header">
        <div>
          <h1>Services</h1>
          <p>
            Manage your service offerings and visibility
            {items.length > 0 && (
              <span className="service-count-badge">{items.length}</span>
            )}
          </p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add Service
        </button>
      </div>

      {items.length > 0 && (
        <div className="admin-filters">
          <div className="admin-search-box">
            <Search size={18} className="search-icon" />
            <input
              placeholder="Search by title or slug..."
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
        </div>
      )}

      {!loading && items.length === 0 ? (
        <div className="empty-wrapper">
          <Briefcase size={48} strokeWidth={1.5} className="empty-icon" />
          <h3>No services yet</h3>
          <p>Add your first service to get started.</p>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Your First Service
          </button>
        </div>
      ) : !loading && filtered.length === 0 ? (
        <div className="empty-wrapper">
          <Search size={48} strokeWidth={1.5} className="empty-icon" />
          <h3>No matches found</h3>
          <p>No services match "{search}".</p>
          <button className="btn btn-ghost" onClick={() => setSearch('')}>
            Clear Search
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Order</th>
                <th>Service</th>
                <th>Slug</th>
                <th style={{ width: '110px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows rows={6} cols={5} />
              ) : (
                filtered.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <span className="order-badge">{s.order}</span>
                    </td>
                    <td>
                      <div className="service-cell-inner">
                        {s.image ? (
                          <img src={s.image} alt="" className="service-thumb" />
                        ) : (
                          <span className="service-thumb service-thumb-empty"><Briefcase size={16} /></span>
                        )}
                        <div className="service-title-cell">
                          <strong>{s.title}</strong>
                          <span className="service-desc-preview">{s.shortDescription}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <code className="slug-code">{s.slug}</code>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${s.status ? 'status-active' : 'status-disabled'
                          }`}
                      >
                        {s.status ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        className="kebab-btn"
                        onClick={(e) => toggleDropdown(e, s._id)}
                        aria-label="Actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeDropdown === s._id && (
                        <div className="dropdown-menu" style={menuPos}>
                          <Link
                            to={`/services/${s.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            onClick={() => setActiveDropdown(null)}
                          >
                            <ExternalLink size={14} /> View on Site
                          </Link>
                          <button onClick={() => openEdit(s)}>
                            <Edit size={14} /> Edit Service
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
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-group">
                <div className="modal-icon">
                  <Briefcase size={20} />
                </div>
                <div>
                  <h2>{editing ? 'Edit Service' : 'Add New Service'}</h2>
                  <span className="modal-subtitle">
                    {editing
                      ? 'Update service details'
                      : 'Create a new service offering'}
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
                  placeholder="e.g. Dissertation Writing"
                />
              </div>

              <div className="form-group">
                <label>Slug (URL) *</label>
                <input
                  name="slug"
                  className="form-control"
                  value={form.slug}
                  onChange={onChange}
                  required
                  placeholder="dissertation-writing"
                />
                <span className="form-hint">
                  Auto-generated from title. Used in URL: /services/{form.slug || 'slug'}
                </span>
              </div>

              <div className="form-group">
                <label>Short Description *</label>
                <textarea
                  name="shortDescription"
                  rows="2"
                  className="form-control"
                  value={form.shortDescription}
                  onChange={onChange}
                  required
                  placeholder="Brief summary shown on service cards..."
                  maxLength={180}
                />
                <span className="form-hint">
                  {form.shortDescription.length} / 180 characters
                </span>
              </div>

              <div className="form-group">
                <label>Detailed Description *</label>
                <textarea
                  name="description"
                  rows="5"
                  className="form-control"
                  value={form.description}
                  onChange={onChange}
                  required
                  placeholder="Full details about this service..."
                />
              </div>

              <div className="form-group">
                <label>Service Image</label>
                <div className={`image-upload ${form.image ? 'has-image' : ''}`}>
                  {form.image ? (
                    <div className="image-upload-preview">
                      <img src={form.image} alt="Service preview" />
                      <div className="image-upload-actions">
                        <button type="button" className="btn btn-ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                          {uploading ? 'Uploading…' : 'Change'}
                        </button>
                        <button type="button" className="btn btn-ghost danger-text" onClick={() => setForm((p) => ({ ...p, image: '' }))} disabled={uploading}>
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button type="button" className="image-upload-drop" onClick={() => fileRef.current?.click()} disabled={uploading}>
                      {uploading ? <Loader2 size={22} className="spin" /> : <ImagePlus size={22} />}
                      <span>{uploading ? 'Uploading…' : 'Click to upload an image'}</span>
                      <small>JPG, PNG or WebP · landscape (16:10) works best</small>
                    </button>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={onImagePick} />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Icon Name</label>
                  <input
                    name="icon"
                    className="form-control"
                    value={form.icon}
                    onChange={onChange}
                    placeholder="FileText"
                  />
                  <span className="form-hint">
                    Lucide icon name (e.g. FileText, BookOpen, Send)
                  </span>
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
                <label>CTA Button Text</label>
                <input
                  name="ctaText"
                  className="form-control"
                  value={form.ctaText}
                  onChange={onChange}
                  placeholder="Get Research Assistance"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-toggle">
                  <input
                    type="checkbox"
                    name="status"
                    checked={form.status}
                    onChange={onChange}
                  />
                  <span className="toggle-slider" />
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
                <button type="submit" className="btn btn-primary" disabled={uploading}>
                  {editing ? 'Update Service' : 'Create Service'}
                </button>
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