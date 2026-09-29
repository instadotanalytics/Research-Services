import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical, HelpCircle } from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import { TableSkeletonRows } from '../../components/Skeleton/Skeleton.jsx';
import { withMinDelay } from '../../utils/minDelay.js';
import './AdminFAQs.css';

const empty = { question: '', answer: '', status: true, order: 0 };

export default function AdminFAQs() {
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
    withMinDelay(getFAQs(true))
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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

  const openEdit = (f) => {
    setEditing(f);
    setForm(f);
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
        await updateFAQ(editing._id, form);
        toast.success('FAQ updated successfully');
      } else {
        await createFAQ(form);
        toast.success('FAQ added successfully');
      }
      setShowModal(false);
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save FAQ');
    }
  };

  const onDelete = async () => {
    try {
      await deleteFAQ(confirm._id);
      toast.success('FAQ deleted');
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
    <div className="admin-faqs-page">
      <div className="admin-page-header">
        <div>
          <h1>FAQs</h1>
          <p>
            Manage frequently asked questions
            {items.length > 0 && (
              <span className="faq-count-badge">{items.length}</span>
            )}
          </p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {!loading && items.length === 0 ? (
        <div className="empty-wrapper">
          <HelpCircle size={48} strokeWidth={1.5} className="empty-icon" />
          <h3>No FAQs yet</h3>
          <p>Add your first FAQ to help visitors find answers quickly.</p>
          <button className="btn btn-primary" onClick={openCreate}>
            <Plus size={16} /> Add Your First FAQ
          </button>
        </div>
      ) : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '70px' }}>Order</th>
                <th>Question &amp; Answer</th>
                <th style={{ width: '120px' }}>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeletonRows rows={6} cols={4} />
              ) : (
                items.map((f) => (
                  <tr key={f._id}>
                    <td>
                      <span className="order-badge">{f.order}</span>
                    </td>
                    <td>
                      <div className="faq-question-cell">
                        <strong>{f.question}</strong>
                        <span className="faq-answer-preview">{f.answer}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`status-badge ${f.status ? 'status-active' : 'status-disabled'
                          }`}
                      >
                        {f.status ? 'Active' : 'Disabled'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', position: 'relative' }}>
                      <button
                        className="kebab-btn"
                        onClick={(e) => toggleDropdown(e, f._id)}
                        aria-label="Actions"
                      >
                        <MoreVertical size={18} />
                      </button>

                      {activeDropdown === f._id && (
                        <div className="dropdown-menu">
                          <button onClick={() => openEdit(f)}>
                            <Edit size={14} /> Edit
                          </button>
                          <button
                            className="danger"
                            onClick={() => {
                              setConfirm(f);
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
                  <HelpCircle size={20} />
                </div>
                <div>
                  <h2>{editing ? 'Edit FAQ' : 'Add New FAQ'}</h2>
                  <span className="modal-subtitle">
                    {editing ? 'Update the question and answer' : 'Create a new FAQ entry'}
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
                <label>Question *</label>
                <input
                  name="question"
                  className="form-control"
                  value={form.question}
                  onChange={onChange}
                  required
                  placeholder="e.g. What types of research support do you provide?"
                />
              </div>

              <div className="form-group">
                <label>Answer *</label>
                <textarea
                  name="answer"
                  rows="5"
                  className="form-control"
                  value={form.answer}
                  onChange={onChange}
                  required
                  placeholder="Write a detailed, helpful answer..."
                />
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
                    <span className="toggle-slider"></span>
                    <span className="toggle-label">
                      {form.status ? 'Active' : 'Disabled'}
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
                  {editing ? 'Update FAQ' : 'Create FAQ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
        confirmText="Delete FAQ"
      />
    </div>
  );
}