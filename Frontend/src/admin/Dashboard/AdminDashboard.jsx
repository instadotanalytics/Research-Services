import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MessageSquare, Star, HelpCircle, MoreVertical } from 'lucide-react';
import { getEnquiries } from '../../services/enquiryApi.js';
import { getServices } from '../../services/serviceApi.js';
import { getTestimonials, getFAQs, getStatistics } from '../../services/contentApi.js';
import { Skeleton as Skel } from '../../components/Skeleton/Skeleton.jsx';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getEnquiries(),
      getServices(true),
      getTestimonials(true),
      getFAQs(true),
      getStatistics(true),
    ])
      .then(([e, s, t, f, st]) => {
        setCounts({
          enquiries: e.data.length,
          services: s.data.length,
          testimonials: t.data.length,
          faqs: f.data.length,
          statistics: st.data.length,
          newEnquiries: e.data.filter((x) => x.status === 'New').length,
        });
        setRecent(e.data.slice(0, 6));
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    { title: 'Total Enquiries', value: counts.enquiries, icon: MessageSquare, color: '#2563eb', link: '/admin/enquiries' },
    { title: 'Total Services', value: counts.services, icon: Briefcase, color: '#16a34a', link: '/admin/services' },
    { title: 'Total Testimonials', value: counts.testimonials, icon: Star, color: '#ec4899', link: '/admin/testimonials' },
    { title: 'Total FAQs', value: counts.faqs, icon: HelpCircle, color: '#8b5cf6', link: '/admin/faqs' },
  ];

  const max = Math.max(counts.enquiries || 1, counts.services || 1, counts.faqs || 1, counts.statistics || 1);
  const chartData = [
    { label: 'Enquiries', value: counts.enquiries || 0, max },
    { label: 'Services', value: counts.services || 0, max },
    { label: 'FAQs', value: counts.faqs || 0, max },
    { label: 'Stats', value: counts.statistics || 0, max },
  ];
  const skeletonBarHeights = [70, 45, 30, 55];

  return (
    <div className="dashboard-container">
      {/* Top Stat Cards */}
      <div className="stat-cards-grid">
        {statCards.map((card, index) => (
          <Link to={card.link} key={index} className="stat-card">
            <div
              className="stat-card-icon"
              style={{ background: `${card.color}15`, color: card.color }}
            >
              <card.icon size={22} />
            </div>
            <div className="stat-card-info">
              {loading ? (
                <Skel w={48} h={24} style={{ marginBottom: 6 }} />
              ) : (
                <span className="stat-card-value">{card.value ?? 0}</span>
              )}
              <span className="stat-card-title">{card.title}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ============ Dashboard Grid ============ */}
      <div className="dashboard-grid">
        <div className="dashboard-main">
          {/* Performance */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Performance</h3>
              <button className="icon-btn-sm" aria-label="More options">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="performance-content">
              <div className="performance-stat">
                <span className="stat-label">Total Enquiries</span>
                {loading ? (
                  <>
                    <Skel w={90} h={40} r={8} style={{ margin: '4px 0' }} />
                    <Skel w={70} h={14} />
                  </>
                ) : (
                  <>
                    <span className="stat-value">{counts.enquiries || 0}</span>
                    <span className="stat-change positive">+{counts.newEnquiries || 0} new</span>
                  </>
                )}
              </div>

              <div className="bar-chart">
                {chartData.map((item, index) => (
                  <div key={index} className="bar-wrapper">
                    {loading ? (
                      <div className="bar skeleton" style={{ height: `${skeletonBarHeights[index]}%` }} />
                    ) : (
                      <div
                        className="bar"
                        style={{
                          height: `${(item.value / item.max) * 100}%`,
                          background: index === 0 ? '#2563eb' : '#bfdbfe',
                        }}
                      />
                    )}
                    <span className="bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Enquiries */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Recent Enquiries</h3>
              <Link to="/admin/enquiries" className="view-all-link">
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
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        <td><Skel w="70%" h={14} /></td>
                        <td><Skel w="80%" h={14} /></td>
                        <td><Skel w={70} h={22} r={999} /></td>
                        <td><Skel w={80} h={14} /></td>
                        <td><Skel w={70} h={14} /></td>
                      </tr>
                    ))
                  ) : recent.length === 0 ? (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: 30, color: '#64748b' }}>
                        No enquiries yet
                      </td>
                    </tr>
                  ) : (
                    recent.map((e) => (
                      <tr key={e._id}>
                        <td><strong>{e.name}</strong></td>
                        <td>{e.email}</td>
                        <td>{e.service}</td>
                        <td>
                          <span className={`status-badge status-${e.status.replace(/\s/g, '').toLowerCase()}`}>
                            {e.status}
                          </span>
                        </td>
                        <td>{new Date(e.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-side">
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Calendar</h3>
              <span className="today-badge">Today</span>
            </div>
            <div className="calendar-widget">
              <div className="calendar-header">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span>
              </div>
              <div className="calendar-days">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <div key={d} className={`calendar-day ${d === 4 ? 'active' : ''}`}>{d}</div>
                ))}
              </div>
            </div>
          </div>

          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Upcoming</h3>
              <Link to="/admin/enquiries" className="view-all-link">
                See all
              </Link>
            </div>
            <div className="upcoming-list">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="upcoming-item">
                    <Skel w={10} h={10} r={999} style={{ marginTop: 6, flexShrink: 0 }} />
                    <div className="upcoming-info" style={{ gap: 6, flex: 1 }}>
                      <Skel w="60%" h={14} />
                      <Skel w="35%" h={11} />
                    </div>
                  </div>
                ))
              ) : (
                <>
                  {recent.slice(0, 3).map((e, i) => (
                    <div key={i} className="upcoming-item">
                      <div className="upcoming-dot"></div>
                      <div className="upcoming-info">
                        <span className="upcoming-title">{e.name}</span>
                        <span className="upcoming-time">{new Date(e.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                  {recent.length === 0 && (
                    <p style={{ color: '#64748b', fontSize: '0.85rem' }}>No upcoming events</p>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}