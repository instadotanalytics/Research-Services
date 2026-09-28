import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MessageSquare,
  Mail,
  Star,
  HelpCircle,
  BarChart3,
  TrendingUp,
  MoreVertical,
  Users,
} from 'lucide-react';
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

  /* ============ Stat Cards (6 cards) ============ */
  const statCards = [
    {
      title: 'Total Enquiries',
      value: counts.enquiries,
      icon: MessageSquare,
      color: '#2563eb',
      link: '/admin/enquiries',
    },
    {
      title: 'New Enquiries',
      value: counts.newEnquiries,
      icon: TrendingUp,
      color: '#f59e0b',
      link: '/admin/enquiries',
    },
    {
      title: 'Services',
      value: counts.services,
      icon: Briefcase,
      color: '#16a34a',
      link: '/admin/services',
    },
    {
      title: 'Contact Messages',
      value: counts.messages,
      icon: Mail,
      color: '#8b5cf6',
      link: '/admin/messages',
    },
    {
      title: 'Testimonials',
      value: counts.testimonials,
      icon: Star,
      color: '#ec4899',
      link: '/admin/testimonials',
    },
    {
      title: 'FAQs',
      value: counts.faqs,
      icon: HelpCircle,
      color: '#06b6d4',
      link: '/admin/faqs',
    },
  ];

  /* ============ Bar Chart Data ============ */
  const maxValue = Math.max(
    counts.enquiries || 1,
    counts.services || 1,
    counts.messages || 1,
    counts.faqs || 1,
    counts.statistics || 1
  );

  const chartData = [
    { label: 'Enquiries', value: counts.enquiries || 0 },
    { label: 'Services', value: counts.services || 0 },
    { label: 'Messages', value: counts.messages || 0 },
    { label: 'FAQs', value: counts.faqs || 0 },
    { label: 'Stats', value: counts.statistics || 0 },
  ];

  return (
    <div className="dashboard-container">
      {/* ============ Top Stat Cards ============ */}
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
              <span className="stat-card-value">{card.value ?? 0}</span>
              <span className="stat-card-title">{card.title}</span>
            </div>
          </Link>
        ))}
      </div>

      {/* ============ Dashboard Grid ============ */}
      <div className="dashboard-grid">
        {/* ============ LEFT COLUMN ============ */}
        <div className="dashboard-main">
          {/* Performance Card */}
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
                <span className="stat-value">{counts.enquiries || 0}</span>
                <span className="stat-change positive">
                  +{counts.newEnquiries || 0} new this month
                </span>
              </div>

              <div className="bar-chart">
                {chartData.map((item, index) => (
                  <div key={index} className="bar-wrapper">
                    <div
                      className="bar"
                      style={{
                        height: `${Math.max((item.value / maxValue) * 100, 8)}%`,
                        background: index === 0 ? '#2563eb' : '#bfdbfe',
                      }}
                      title={`${item.label}: ${item.value}`}
                    />
                    <span className="bar-label">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Enquiries Table */}
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
                  {recent.length === 0 ? (
                    <tr>
                      <td
                        colSpan="5"
                        style={{ textAlign: 'center', padding: 30, color: '#64748b' }}
                      >
                        No enquiries yet
                      </td>
                    </tr>
                  ) : (
                    recent.map((e) => (
                      <tr key={e._id}>
                        <td>
                          <strong>{e.name}</strong>
                        </td>
                        <td>{e.email}</td>
                        <td>{e.service}</td>
                        <td>
                          <span
                            className={`status-badge status-${e.status
                              .replace(/\s/g, '')
                              .toLowerCase()}`}
                          >
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

        {/* ============ RIGHT COLUMN ============ */}
        <div className="dashboard-side">
          {/* Calendar Widget */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Calendar</h3>
              <span className="today-badge">Today</span>
            </div>
            <div className="calendar-widget">
              <div className="calendar-header">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
              </div>
              <div className="calendar-days">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((d) => (
                  <div
                    key={d}
                    className={`calendar-day ${d === 4 ? 'active' : ''}`}
                  >
                    {d}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Upcoming List */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Upcoming</h3>
              <Link to="/admin/enquiries" className="view-all-link">
                See all
              </Link>
            </div>
            <div className="upcoming-list">
              {recent.slice(0, 3).map((e, i) => (
                <div key={i} className="upcoming-item">
                  <div className="upcoming-dot" />
                  <div className="upcoming-info">
                    <span className="upcoming-title">{e.name}</span>
                    <span className="upcoming-time">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))}
              {recent.length === 0 && (
                <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                  No upcoming events
                </p>
              )}
            </div>
          </div>

          {/* Quick Stats Widget */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Quick Summary</h3>
            </div>
            <div className="upcoming-list">
              <div className="upcoming-item">
                <div className="upcoming-dot" style={{ background: '#16a34a' }} />
                <div className="upcoming-info">
                  <span className="upcoming-title">
                    {counts.services || 0} Active Services
                  </span>
                  <span className="upcoming-time">All services published</span>
                </div>
              </div>
              <div className="upcoming-item">
                <div className="upcoming-dot" style={{ background: '#8b5cf6' }} />
                <div className="upcoming-info">
                  <span className="upcoming-title">
                    {counts.unreadMessages || 0} Unread Messages
                  </span>
                  <span className="upcoming-time">Contact form messages</span>
                </div>
              </div>
              <div className="upcoming-item">
                <div className="upcoming-dot" style={{ background: '#ec4899' }} />
                <div className="upcoming-info">
                  <span className="upcoming-title">
                    {counts.testimonials || 0} Testimonials
                  </span>
                  <span className="upcoming-time">Published reviews</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}