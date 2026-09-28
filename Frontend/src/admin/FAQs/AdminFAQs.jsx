import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getFAQs, createFAQ, updateFAQ, deleteFAQ } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';

const empty = { question: '', answer: '', status: true, order: 0 };

export default function AdminFAQs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getFAQs(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (f) => { setEditing(f); setForm(f); setShowModal(true); };
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

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>FAQs</h1><p>Manage frequently asked questions</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add FAQ</button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Question</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((f) => (
                <tr key={f._id}>
                  <td>{f.order}</td>
                  <td><strong>{f.question}</strong></td>
                  <td><span className={`status-badge ${f.status ? 'status-completed' : 'status-closed'}`}>{f.status ? 'Active' : 'Disabled'}</span></td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => openEdit(f)}><Edit size={15} /></button>{' '}
                    <button className="icon-btn" onClick={() => setConfirm(f)}><Trash2 size={15} color="#dc2626" /></button>
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
              <h2>{editing ? 'Edit' : 'Add'} FAQ</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group"><label>Question</label><input name="question" className="form-control" value={form.question} onChange={onChange} required /></div>
              <div className="form-group"><label>Answer</label><textarea name="answer" rows="4" className="form-control" value={form.answer} onChange={onChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={form.order} onChange={onChange} /></div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" name="status" checked={form.status} onChange={onChange} /> Active
                  </label>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal open={!!confirm} title="Delete FAQ" message="Are you sure?" danger onConfirm={onDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
}