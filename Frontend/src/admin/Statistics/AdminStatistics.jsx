import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, X } from 'lucide-react';
import { getStatistics, createStatistic, updateStatistic, deleteStatistic } from '../../services/contentApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';

const empty = { title: '', value: '', icon: 'Award', status: true, order: 0 };

export default function AdminStatistics() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    getStatistics(true).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setEditing(null); setForm(empty); setShowModal(true); };
  const openEdit = (s) => { setEditing(s); setForm(s); setShowModal(true); };
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

  return (
    <div>
      <div className="admin-page-header">
        <div><h1>Statistics</h1><p>Manage homepage statistics</p></div>
        <button className="btn btn-primary" onClick={openCreate}><Plus size={16} /> Add Statistic</button>
      </div>

      {loading ? <LoadingSpinner fullScreen /> : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr><th>Order</th><th>Title</th><th>Value</th><th>Status</th><th style={{ textAlign: 'right' }}>Actions</th></tr>
            </thead>
            <tbody>
              {items.map((s) => (
                <tr key={s._id}>
                  <td>{s.order}</td>
                  <td><strong>{s.title}</strong></td>
                  <td>{s.value}</td>
                  <td><span className={`status-badge ${s.status ? 'status-completed' : 'status-closed'}`}>{s.status ? 'Active' : 'Disabled'}</span></td>
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
              <h2>{editing ? 'Edit' : 'Add'} Statistic</h2>
              <button onClick={() => setShowModal(false)}><X size={20} /></button>
            </div>
            <form onSubmit={onSubmit} className="modal-body">
              <div className="form-group"><label>Title</label><input name="title" className="form-control" value={form.title} onChange={onChange} required /></div>
              <div className="form-row">
                <div className="form-group"><label>Value</label><input name="value" className="form-control" value={form.value} onChange={onChange} required placeholder="500+" /></div>
                <div className="form-group"><label>Icon</label><input name="icon" className="form-control" value={form.icon} onChange={onChange} placeholder="Award" /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label>Order</label><input type="number" name="order" className="form-control" value={form.order} onChange={onChange} /></div>
                <div className="form-group">
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 24 }}>
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

      <ConfirmModal open={!!confirm} title="Delete" message="Are you sure?" danger onConfirm={onDelete} onCancel={() => setConfirm(null)} />
    </div>
  );
}