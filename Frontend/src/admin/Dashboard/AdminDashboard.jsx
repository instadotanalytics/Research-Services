import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, Mail, Star, HelpCircle, BarChart3, TrendingUp, Users } from 'lucide-react';
import { getEnquiries } from '../../services/enquiryApi.js';
import { getServices } from '../../services/serviceApi.js';
import { getContacts } from '../../services/contactApi.js';
import { getTestimonials, getFAQs, getStatistics } from '../../services/contentApi.js';
import LoadingSpinner from '../../components/Loading/LoadingSpinner.jsx';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnquiries(),
      getServices(true),
      getContacts(),
      getTestimonials(true),
      getFAQs(true),
      getStatistics(true),
    ])
      .then(([e, s, c, t, f, st]) => {
        setCounts({
          enquiries: e.data.length,
          services: s.data.length,
          messages: c.data.length,
          testimonials: t.data.length,
          faqs: f.data.length,
          statistics: st.data.length,
          newEnquiries: e.data.filter((x) => x.status === 'New').length,
          unreadMessages: c.data.filter((x) => x.status === 'unread').length,
        });
        setRecent(e.data.slice(0, 6));
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSpinner fullScreen />;

  const cards = [
    { title: 'Total Enquiries', value: counts.enquiries, icon: MessageSquare, color: '#2563eb', link: '/admin/enquiries' },
    { title: 'New Enquiries', value: counts.newEnquiries, icon: TrendingUp, color: '#f59e0b', link: '/admin/enquiries' },
    { title: 'Services', value: counts.services, icon: Briefcase, color: '#16a34a', link: '/admin/services' },
    { title: 'Contact Messages', value: counts.messages, icon: Mail, color: '#8b5cf6', link: '/admin/messages' },
    { title: 'Testimonials', value: counts.testimonials, icon: Star, color: '#ec4899', link: '/admin/testimonials' },
    { title: 'FAQs', value: counts.faqs, icon: HelpCircle, color: '#06b6d4', link: '/admin/faqs' },
  ];

  return (
    <div>
      <div className="dash-grid">
        {cards.map((c, i) => (
          <Link to={c.link} key={i} className="dash-card">
            <div className="dash-card-icon" style={{ background: `${c.color}15`, color: c.color }}>
              <c.icon size={22} />
            </div>
            <div>
              <div className="dash-card-value">{c.value ?? 0}</div>
              <div className="dash-card-title">{c.title}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="dash-section">
        <div className="dash-section-header">
          <h2>Recent Enquiries</h2>
          <Link to="/admin/enquiries" className="btn btn-ghost" style={{ fontSize: 13, padding: '8px 14px' }}>
            View All
          </Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Service</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recent.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>No enquiries yet</td></tr>
              ) : recent.map((e) => (
                <tr key={e._id}>
                  <td><strong>{e.name}</strong></td>
                  <td>{e.email}</td>
                  <td>{e.service}</td>
                  <td><span className={`status-badge status-${e.status.replace(/\s/g, '').toLowerCase()}`}>{e.status}</span></td>
                  <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}