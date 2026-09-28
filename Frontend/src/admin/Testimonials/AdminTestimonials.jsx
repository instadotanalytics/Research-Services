import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';

const empty = { name: '', designation: '', institution: '', review: '', rating: 5, status: true, order: 0 };

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getTestimonials(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (t) => { setEditing(t); setForm(t); setShowModal(true); };
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

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Testimonials</h1><p>Manage client testimonials</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Testimonial</button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Name</th><th>Designation</th><th>Rating</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((t) => (
                <tr key={t._id}>
                  <td><strong>{t.name}</strong></td>
                  <td>{t.designation}</td>
                  <td>{'★'.repeat(t.rating)}</td>
                  <td><span className={`status-badge ${t.status ? 'status-completed' : 'status-closed'}`}>{t.status ? 'Active' : 'Disabled'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => openEdit(t)}><Edit size={15} /></button>{' '}
                    <button className="icon-btn" onClick={() => setConfirm(t)}><Trash2 size={15} color="#dc2626" /></button>
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
              <h2>{editing ? 'Edit' : 'Add'} Testimonial</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-row">
                <div className="form-group"><label>Name</label><input name="name" className="form-control" value={form.name} onChange={onChange} required /></div>
                <div className="form-group"><label>Designation</label><input name="designation" className="form-control" value={form.designation} onChange={onChange} /></div>
              </div>
              <div className="form-group"><label>Institution</label><input name="institution" className="form-control" value={form.institution} onChange={onChange} /></div>
              <div className="form-group"><label>Review</label><textarea name="review" rows="3" className="form-control" value={form.review} onChange={onChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Rating (1–5)</label><input type="number" min="1" max="5" name="rating" className="form-control" value={form.rating} onChange={onChange} /></div>
                <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={form.order} onChange={onChange} /></div>
              </div>
              <div className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <input type="checkbox" name="status" checked={form.status} onChange={onChange} /> Active
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirm} title="Delete" message="Are you sure?" danger onConfirm={onDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
}