import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  MessageSquare,
  Star,
  HelpCircle,
  BarChart3,
  ArrowUpRight,
  ChevronRight,
} from 'lucide-react';
import { getEnquiries } from '../../services/enquiryApi.js';
import { getServices } from '../../services/serviceApi.js';
import { getTestimonials, getFAQs, getStatistics } from '../../services/contentApi.js';
import { Skeleton as Skel } from '../../components/Skeleton/Skeleton.jsx';
import { withMinDelay } from '../../utils/minDelay.js';
import GoogleCalendar from './GoogleCalendar.jsx';
import './AdminDashboard.css';

/* Blue-family shades, dark -> light, so it stays on-theme */
const STATUS_COLORS = {
  new: '#1e3a8a',
  contacted: '#2563eb',
  inprogress: '#60a5fa',
  completed: '#93c5fd',
  closed: '#cbd5e1',
};
const statusColor = (s) =>
  STATUS_COLORS[String(s || '').toLowerCase().replace(/\s/g, '')] || '#94a3b8';

const initials = (name) =>
  !name
    ? '?'
    : name
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

export default function AdminDashboard() {
  const [data, setData] = useState({
    enquiries: [],
    services: [],
    testimonials: [],
    faqs: [],
    statistics: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    withMinDelay(
      Promise.all([
        getEnquiries(),
        getServices(true),
        getTestimonials(true),
        getFAQs(true),
        getStatistics(true),
      ])
    )
      .then(([e, s, t, f, st]) => {
        setData({
          enquiries: e.data,
          services: s.data,
          testimonials: t.data,
          faqs: f.data,
          statistics: st.data,
        });
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  /* ---------- derived numbers ---------- */
  const counts = {
    enquiries: data.enquiries.length,
    services: data.services.length,
    testimonials: data.testimonials.length,
    faqs: data.faqs.length,
    statistics: data.statistics.length,
    newEnquiries: data.enquiries.filter((x) => x.status === 'New').length,
  };
  const recent = data.enquiries.slice(0, 6);

  const statusBreakdown = useMemo(() => {
    const total = data.enquiries.length;
    const map = {};
    data.enquiries.forEach((e) => {
      map[e.status] = (map[e.status] || 0) + 1;
    });
    return Object.entries(map)
      .map(([label, count]) => ({
        label,
        count,
        pct: Math.round((count / total) * 100),
        color: statusColor(label),
      }))
      .sort((a, b) => b.count - a.count);
  }, [data.enquiries]);

  /* every service is listed (even with 0 enquiries) so the card is always full */
  const topServices = useMemo(() => {
    const counted = {};
    data.enquiries.forEach((e) => {
      if (e.service) counted[e.service] = (counted[e.service] || 0) + 1;
    });
    const names = new Set([...data.services.map((s) => s.title), ...Object.keys(counted)]);
    const list = [...names]
      .filter(Boolean)
      .map((name) => ({ name, count: counted[name] || 0 }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
      .slice(0, 5);
    const max = Math.max(...list.map((s) => s.count), 1);
    return list.map((s) => ({ ...s, pct: (s.count / max) * 100 }));
  }, [data.enquiries, data.services]);

  const latestTestimonials = useMemo(
    () =>
      [...data.testimonials]
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
        .slice(0, 3),
    [data.testimonials]
  );
  const avgRating = data.testimonials.length
    ? (
      data.testimonials.reduce((sum, t) => sum + (Number(t.rating) || 0), 0) /
      data.testimonials.length
    ).toFixed(1)
    : null;

  const contentOverview = [
    { label: 'Services', items: data.services, link: '/admin/services' },
    { label: 'Testimonials', items: data.testimonials, link: '/admin/testimonials' },
    { label: 'FAQs', items: data.faqs, link: '/admin/faqs' },
    { label: 'Statistics', items: data.statistics, link: '/admin/statistics' },
  ].map((c) => ({
    ...c,
    total: c.items.length,
    active: c.items.filter((i) => i.status !== false).length,
  }));
  const totalContent = contentOverview.reduce((s, c) => s + c.total, 0);
  const liveContent = contentOverview.reduce((s, c) => s + c.active, 0);

  const statCards = [
    { title: 'Total Enquiries', value: counts.enquiries, icon: MessageSquare, color: '#2563eb', link: '/admin/enquiries' },
    { title: 'Total Services', value: counts.services, icon: Briefcase, color: '#16a34a', link: '/admin/services' },
    { title: 'Total Testimonials', value: counts.testimonials, icon: Star, color: '#ec4899', link: '/admin/testimonials' },
    { title: 'Total FAQs', value: counts.faqs, icon: HelpCircle, color: '#8b5cf6', link: '/admin/faqs' },
  ];

  const quickLinks = [
    { label: 'Services', count: counts.services, icon: Briefcase, to: '/admin/services' },
    { label: 'Testimonials', count: counts.testimonials, icon: Star, to: '/admin/testimonials' },
    { label: 'FAQs', count: counts.faqs, icon: HelpCircle, to: '/admin/faqs' },
    { label: 'Statistics', count: counts.statistics, icon: BarChart3, to: '/admin/statistics' },
  ];

  const max = Math.max(counts.enquiries || 1, counts.services || 1, counts.faqs || 1, counts.statistics || 1);
  const chartData = [
    { label: 'Enquiries', value: counts.enquiries, max },
    { label: 'Services', value: counts.services, max },
    { label: 'FAQs', value: counts.faqs, max },
    { label: 'Stats', value: counts.statistics, max },
  ];
  const skeletonBarHeights = [70, 45, 30, 55];

  return (
    <div className="dashboard-container">
      {/* ============ Stat cards ============ */}
      <div className="stat-cards-grid">
        {statCards.map((card) => (
          <Link to={card.link} key={card.title} className="stat-card">
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

      <div className="dashboard-grid">
        {/* ================= MAIN COLUMN ================= */}
        <div className="dashboard-main">
          {/* ---- Performance ---- */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Performance</h3>
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
                    <span className="stat-value">{counts.enquiries}</span>
                    <span className="stat-change positive">+{counts.newEnquiries} new</span>
                  </>
                )}
              </div>

              <div className="bar-chart">
                {chartData.map((item, index) => (
                  <div key={item.label} className="bar-wrapper">
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

          {/* ---- Recent Enquiries ---- */}
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

        {/* ================= SIDE COLUMN ================= */}
        <div className="dashboard-side">
          <GoogleCalendar />

          {/* ---- Enquiry status ---- */}
          <div className="dash-card-section">
            <div className="dash-section-header">
              <h3>Enquiry Status</h3>
              <Link to="/admin/enquiries" className="view-all-link">
                Manage
              </Link>
            </div>

            {loading ? (
              <>
                <Skel w="100%" h={12} r={999} style={{ marginBottom: 16 }} />
                <Skel w="80%" h={14} style={{ marginBottom: 10 }} />
                <Skel w="65%" h={14} />
              </>
            ) : statusBreakdown.length === 0 ? (
              <p className="empty-note">No enquiries yet.</p>
            ) : (
              <>
                <div className="status-stack">
                  {statusBreakdown.map((s) => (
                    <span
                      key={s.label}
                      style={{ width: `${s.pct}%`, background: s.color }}
                      title={`${s.label}: ${s.count}`}
                    />
                  ))}
                </div>
                <ul className="status-legend">
                  {statusBreakdown.map((s) => (
                    <li key={s.label}>
                      <i style={{ background: s.color }} />
                      <span className="legend-label">{s.label}</span>
                      <b>{s.count}</b>
                      <em>{s.pct}%</em>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          {/* ---- Quick access (stretches to fill the column) ---- */}
          <div className="dash-card-section quick-card">
            <div className="dash-section-header">
              <h3>Quick Access</h3>
            </div>
            <div className="quick-grid">
              {quickLinks.map((q) => (
                <Link key={q.label} to={q.to} className="quick-tile">
                  <span className="quick-icon">
                    <q.icon size={18} />
                  </span>
                  <ArrowUpRight size={15} className="quick-arrow" />
                  <span className="quick-label">{q.label}</span>
                  <span className="quick-count">{loading ? '—' : `${q.count} items`}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM ROW ================= */}
      <div className="dashboard-bottom">
        {/* ---- Top requested services ---- */}
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Top Requested Services</h3>
            <Link to="/admin/services" className="view-all-link">
              Services
            </Link>
          </div>
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skel key={i} w="100%" h={14} style={{ marginBottom: 16 }} />
            ))
          ) : topServices.length === 0 ? (
            <p className="empty-note">Add services to see how often each one is requested.</p>
          ) : (
            <ul className="rank-list">
              {topServices.map((s, i) => (
                <li key={s.name}>
                  <div className="rank-top">
                    <span className="rank-name">
                      <b>{i + 1}</b>
                      {s.name}
                    </span>
                    <span className="rank-count">{s.count}</span>
                  </div>
                  <div className="rank-track">
                    <span style={{ width: `${s.pct}%` }} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ---- Latest testimonials ---- */}
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Latest Testimonials</h3>
            {avgRating ? (
              <span className="rating-pill">
                <Star size={12} fill="currentColor" /> {avgRating} avg
              </span>
            ) : (
              <Link to="/admin/testimonials" className="view-all-link">
                View
              </Link>
            )}
          </div>
          {loading ? (
            [...Array(3)].map((_, i) => (
              <Skel key={i} w="100%" h={44} r={10} style={{ marginBottom: 12 }} />
            ))
          ) : latestTestimonials.length === 0 ? (
            <p className="empty-note">No testimonials yet.</p>
          ) : (
            <div className="mini-testimonials">
              {latestTestimonials.map((t) => (
                <div key={t._id} className="mini-testimonial">
                  <div className="mini-avatar">{initials(t.name)}</div>
                  <div className="mini-body">
                    <div className="mini-head">
                      <strong>{t.name}</strong>
                      <span className="mini-stars">
                        {'★'.repeat(Number(t.rating) || 0)}
                        <s>{'★'.repeat(5 - (Number(t.rating) || 0))}</s>
                      </span>
                    </div>
                    {t.institution && <span className="mini-inst">{t.institution}</span>}
                    <p>{t.review}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ---- Content overview (theme blue only) ---- */}
        <div className="dash-card-section">
          <div className="dash-section-header">
            <h3>Content Overview</h3>
          </div>
          {loading ? (
            [...Array(4)].map((_, i) => (
              <Skel key={i} w="100%" h={14} style={{ marginBottom: 18 }} />
            ))
          ) : (
            <>
              <ul className="content-list">
                {contentOverview.map((c) => (
                  <li key={c.label}>
                    <Link to={c.link} className="content-row">
                      <div className="content-top">
                        <span>{c.label}</span>
                        <span className="content-count">
                          <b>{c.active}</b> / {c.total} live
                          <ChevronRight size={14} />
                        </span>
                      </div>
                      <div className="rank-track">
                        <span
                          style={{ width: `${c.total ? (c.active / c.total) * 100 : 0}%` }}
                        />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="content-foot">
                <span>Published items</span>
                <b>
                  {liveContent} of {totalContent}
                </b>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}