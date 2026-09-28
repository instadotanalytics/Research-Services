import { Inbox } from 'lucide-react';

export default function EmptyState({ icon: Icon = Inbox, title = 'No data found', message = '' }) {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
      <Icon size={56} strokeWidth={1.5} style={{ marginBottom: 16, color: '#94a3b8' }} />
      <h3 style={{ fontSize: 18, color: '#0f172a', marginBottom: 6 }}>{title}</h3>
      {message && <p style={{ fontSize: 14 }}>{message}</p>}
    </div>
  );
}