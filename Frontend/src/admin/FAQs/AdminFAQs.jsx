import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X, MoreVertical } from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
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
    getFAQs(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (f) => { setEditing(f); setForm(f); setShowModal(true); setActiveDropdown(null); };

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await updateFAQ(editing._id, form);
      else await createFAQ(form);
      toast.success('Saved');
      setShowModal(false);
      load();
    } catch { toast.error('Failed'); }
  };

  const onDelete = async () => {
    try { await deleteFAQ(confirm._id); toast.success('Deleted'); setConfirm(null); load(); }
    catch { toast.error('Failed'); }
  };

  const toggleDropdown = (e, id) => {
    e.stopPropagation();
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  return (
    <div className="admin-faqs-page">
      {/* Header with small Add button on the right */}
      <div className="admin-page-header">
        <div>
          <h1>FAQs</h1>
          <p>Manage frequently asked questions</p>
        </div>
        <button className="btn-add-small" onClick={openCreate}>
          <Plus size={16} /> Add FAQ
        </button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: '60px' }}>Order</th>
                <th>Question</th>
                <th>Status</th>
                <th style={{ textAlign: 'right', width: '80px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f._id}>
                  <td><span className="order-badge">{f.order}</span></td>
                  <td>
                    <div className="faq-question-cell">
                      <strong>{f.question}</strong>
                      <span className="faq-answer-preview">{f.answer}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${f.status ? 'status-active' : 'status-disabled'}`}>
                      {f.status ? 'Active' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right', position: 'relative' }}>
                    <button
                      className="kebab-btn"
                      onClick={(e) => toggleDropdown(e, f._id)}
                    >
                      <MoreVertical size={18} />
                    </button>

                    {activeDropdown === f._id && (
                      <div className="dropdown-menu">
                        <button onClick={() => openEdit(f)}>
                          <Edit size={14} /> Edit
                        </button>
                        <button className="danger" onClick={() => { setConfirm(f); setActiveDropdown(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td colSpan="4" className="empty-state">No FAQs found. Add one to get started.</td>
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
              <h2>{editing ? 'Edit' : 'Add'} FAQ</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group">
                <label>Question *</label>
                <input name="question" className="form-control" value={form.question} onChange={onChange} required placeholder="e.g. How do I place an order?" />
              </div>

              <div className="form-group">
                <label>Answer *</label>
                <textarea name="answer" rows="4" className="form-control" value={form.answer} onChange={onChange} required placeholder="Detailed answer..." />
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
                <button type="submit" className="btn btn-primary">Save FAQ</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ?`}
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}