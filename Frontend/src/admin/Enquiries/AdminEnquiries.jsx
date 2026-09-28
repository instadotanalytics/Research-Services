import { useEffect, useState } from 'react';
import { Search, Trash2, Eye, X } from 'lucide-react';
import { getEnquiries, updateEnquiry, deleteEnquiry } from '../../services/enquiryApi.js';
import { useToast } from '../../components/Toast/ToastContext.jsx';
import ConfirmModal from '../../components/ConfirmModal/ConfirmModal.jsx';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import EmptyState from '../../components/Loading/EmptyState.jsx';
import { ENQUIRY_STATUSES } from '../../utils/constants.js';

export default function AdminEnquiries() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (statusFilter !== 'all') params.status = statusFilter;
    getEnquiries(params).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line
  }, [search, statusFilter]);

  const onChangeStatus = async (id, status) => {
    try {
      await updateEnquiry(id, { status });
      setItems(items.map((i) => (i._id === id ? { ...i, status } : i)));
      toast.success('Status updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const onDelete = async () => {
    try {
      await deleteEnquiry(confirm._id);
      toast.success('Enquiry deleted');
      setConfirm(null);
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>Enquiries</h1>
          <p>Manage all customer enquiries</p>
        </div>
      </div>

      <div className="admin-filters">
        <div className="admin-search">
          <Search size={16} />
          <input placeholder="Search by name, email, phone..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="form-control" style={{ maxWidth: 200 }} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
        </select>
      </div>

      {loading ? (
        <LoadingSpinner fullScreen />
      ) : items.length === 0 ? (
        <EmptyState title="No enquiries found" message="Try changing filters or wait for new enquiries." />
      ) : (
        <div className="admin-table-wrap" style={{ background: '#fff', borderRadius: 14, border: '1px solid var(--border)' }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((e) => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}</td>
                  <td>{e.phone}</td>
                  <td>{e.service}</td>
                  <td>
                    <select
                      className="form-control"
                      style={{ fontSize: 12, padding: '6px 8px' }}
                      value={e.status}
                      onChange={(ev) => onChangeStatus(e._id, ev.target.value)}
                    >
                      {ENQUIRY_STATUSES.map((s) => <option key={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button className="icon-btn" onClick={() => setSelected(e)}><Eye size={15} /></button>{' '}
                    <button className="icon-btn" onClick={() => setConfirm(e)}><Trash2 size={15} color="#dc2626" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Enquiry Details</h2>
              <button onClick={() => setSelected(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              {[
                ['Name', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Service', selected.service],
                ['Institution', selected.institution || '—'],
                ['Preferred Contact', selected.preferredContact],
                ['Status', selected.status],
                ['Date', new Date(selected.createdAt).toLocaleString()],
              ].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
                  <span style={{ width: 160, color: 'var(--text-muted)', fontSize: 14 }}>{k}</span>
                  <span style={{ flex: 1, fontWeight: 500, fontSize: 14 }}>{v}</span>
                </div>
              ))}
              <div style={{ marginTop: 16 }}>
                <div style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 6 }}>Message</div>
                <p style={{ padding: 14, background: '#f8fafc', borderRadius: 10, fontSize: 14, lineHeight: 1.7 }}>{selected.message}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        open={!!confirm}
        title="Delete Enquiry"
        message="This action cannot be undone."
        danger
        onConfirm={onDelete}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}