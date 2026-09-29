import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    X,
    Loader2,
    MessageSquare,
    Briefcase,
    Star,
    HelpCircle,
    BarChart3,
    CornerDownLeft,
    ChevronRight,
} from 'lucide-react';
import { getEnquiries } from '../../services/enquiryApi.js';
import { getServices } from '../../services/serviceApi.js';
import { getTestimonials, getFAQs, getStatistics } from '../../services/contentApi.js';
import './AdminSearch.css';

const CACHE_MS = 60_000;
const MAX_PER_GROUP = 4;

const clip = (s, n = 90) => {
    const t = String(s ?? '').replace(/\s+/g, ' ').trim();
    return t.length > n ? `${t.slice(0, n - 1)}…` : t;
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

/* What to search in each collection, and where a click should go */
const GROUPS = [
    {
        key: 'enquiries',
        label: 'Enquiries',
        icon: MessageSquare,
        route: '/admin/enquiries',
        color: '#2563eb',
        bg: '#eff6ff',
        fields: ['name', 'email', 'phone', 'service', 'institution', 'message'],
        title: (i) => i.name,
        sub: (i) => [i.service, i.email].filter(Boolean).join(' · '),
        meta: (i) => i.status,
    },
    {
        key: 'services',
        label: 'Services',
        icon: Briefcase,
        route: '/admin/services',
        color: '#16a34a',
        bg: '#f0fdf4',
        fields: ['title', 'slug', 'shortDescription', 'description'],
        title: (i) => i.title,
        sub: (i) => clip(i.shortDescription),
        meta: (i) => (i.status === false ? 'Disabled' : ''),
    },
    {
        key: 'testimonials',
        label: 'Testimonials',
        icon: Star,
        route: '/admin/testimonials',
        color: '#ec4899',
        bg: '#fdf2f8',
        fields: ['name', 'designation', 'institution', 'review'],
        title: (i) => i.name,
        sub: (i) => [i.designation, i.institution].filter(Boolean).join(' · '),
        meta: (i) => (i.status === false ? 'Disabled' : ''),
    },
    {
        key: 'faqs',
        label: 'FAQs',
        icon: HelpCircle,
        route: '/admin/faqs',
        color: '#8b5cf6',
        bg: '#f5f3ff',
        fields: ['question', 'answer'],
        title: (i) => i.question,
        sub: (i) => clip(i.answer),
        meta: (i) => (i.status === false ? 'Disabled' : ''),
    },
    {
        key: 'statistics',
        label: 'Statistics',
        icon: BarChart3,
        route: '/admin/statistics',
        color: '#f59e0b',
        bg: '#fffbeb',
        fields: ['title', 'value'],
        title: (i) => i.title,
        sub: (i) => (i.value ? `Value: ${i.value}` : ''),
        meta: (i) => (i.status === false ? 'Disabled' : ''),
    },
];

/* Wraps matched words in <mark> */
function Highlight({ text, terms }) {
    const s = String(text ?? '');
    if (!terms.length || !s) return s;
    const re = new RegExp(`(${terms.map(escapeRe).join('|')})`, 'gi');
    return s
        .split(re)
        .map((part, i) => (i % 2 === 1 ? <mark key={i}>{part}</mark> : part));
}

export default function AdminSearch() {
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const listRef = useRef(null);
    const loadedAt = useRef(0);

    const [query, setQuery] = useState('');
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [active, setActive] = useState(0);
    const [data, setData] = useState({
        enquiries: [],
        services: [],
        testimonials: [],
        faqs: [],
        statistics: [],
    });

    /* ---------- load (cached) ---------- */
    const ensureData = async () => {
        if (Date.now() - loadedAt.current < CACHE_MS) return;
        setLoading(true);
        const res = await Promise.allSettled([
            getEnquiries(),
            getServices(true),
            getTestimonials(true),
            getFAQs(true),
            getStatistics(true),
        ]);
        const pick = (r) =>
            r.status === 'fulfilled' && Array.isArray(r.value?.data) ? r.value.data : [];
        setData({
            enquiries: pick(res[0]),
            services: pick(res[1]),
            testimonials: pick(res[2]),
            faqs: pick(res[3]),
            statistics: pick(res[4]),
        });
        loadedAt.current = Date.now();
        setLoading(false);
    };

    /* ---------- open / close ---------- */
    const openSearch = () => {
        setOpen(true);
        ensureData();
    };

    const close = () => {
        setOpen(false);
        setQuery('');
        inputRef.current?.blur();
    };

    const openFromTrigger = () => {
        openSearch();
        setTimeout(() => inputRef.current?.focus(), 60);
    };

    /* Escape closes */
    useEffect(() => {
        if (!open) return undefined;
        const onKey = (e) => e.key === 'Escape' && close();
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [open]);

    /* Lets CSS hide the floating menu button while searching */
    useEffect(() => {
        document.body.classList.toggle('search-open', open);
        return () => document.body.classList.remove('search-open');
    }, [open]);

    /* ---------- search ---------- */
    const { terms, groups, flat } = useMemo(() => {
        const t = query.toLowerCase().split(/\s+/).filter(Boolean);
        if (!t.length) return { terms: t, groups: [], flat: [] };

        let offset = 0;
        const found = GROUPS.map((g) => {
            const hits = (data[g.key] || []).filter((item) => {
                const hay = g.fields.map((f) => String(item[f] ?? '').toLowerCase()).join(' \n ');
                return t.every((word) => hay.includes(word));
            });

            // items whose main title matches come first
            hits.sort(
                (a, b) =>
                    Number(!String(g.title(a) ?? '').toLowerCase().includes(t[0])) -
                    Number(!String(g.title(b) ?? '').toLowerCase().includes(t[0]))
            );

            return { ...g, total: hits.length, hits: hits.slice(0, MAX_PER_GROUP) };
        })
            .filter((g) => g.total > 0)
            .map((g) => {
                const items = g.hits.map((item, i) => ({
                    id: `${g.key}-${item._id ?? i}`,
                    index: offset + i,
                    item,
                    group: g,
                }));
                offset += items.length;
                return { ...g, items };
            });

        return { terms: t, groups: found, flat: found.flatMap((g) => g.items) };
    }, [query, data]);

    useEffect(() => setActive(0), [query]);

    useEffect(() => {
        listRef.current
            ?.querySelector('[data-active="true"]')
            ?.scrollIntoView({ block: 'nearest' });
    }, [active]);

    const go = (route) => {
        navigate(route);
        close();
    };

    const onKeyDown = (e) => {
        if (!flat.length) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setActive((a) => (a + 1) % flat.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setActive((a) => (a - 1 + flat.length) % flat.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const target = flat[active];
            if (target) go(target.group.route);
        }
    };

    const hasQuery = terms.length > 0;

    return (
        <>
            {open && <div className="search-backdrop" onClick={close} aria-hidden="true" />}

            <div className={`search-wrap ${open ? 'is-open' : ''}`}>
                <div className="search-row">
                    <div className="topbar-search">
                        <Search size={16} className="search-icon" />
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="Search anything..."
                            aria-label="Search"
                            autoComplete="off"
                            value={query}
                            onFocus={openSearch}
                            onChange={(e) => setQuery(e.target.value)}
                            onKeyDown={onKeyDown}
                        />
                        {query && (
                            <button
                                type="button"
                                className="search-clear"
                                aria-label="Clear search"
                                onClick={() => {
                                    setQuery('');
                                    inputRef.current?.focus();
                                }}
                            >
                                <X size={12} />
                            </button>
                        )}
                    </div>
                    {open && (
                        <button type="button" className="search-cancel" onClick={close}>
                            Cancel
                        </button>
                    )}
                </div>

                {open && (
                    <div className="search-panel">
                        <div className="search-scroll" ref={listRef}>
                            {/* --- nothing typed yet: quick jump chips --- */}
                            {!hasQuery && (
                                <div className="search-hint">
                                    <p>Search enquiries, services, testimonials, FAQs and statistics.</p>
                                    <div className="search-chips">
                                        {GROUPS.map((g) => (
                                            <button
                                                key={g.key}
                                                type="button"
                                                className="search-chip"
                                                onClick={() => go(g.route)}
                                            >
                                                <g.icon size={14} style={{ color: g.color }} />
                                                {g.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* --- loading --- */}
                            {hasQuery && loading && flat.length === 0 && (
                                <div className="search-state">
                                    <Loader2 size={18} className="spin" /> Searching…
                                </div>
                            )}

                            {/* --- no results --- */}
                            {hasQuery && !loading && flat.length === 0 && (
                                <div className="search-state">
                                    No results for <strong>“{query.trim()}”</strong>
                                </div>
                            )}

                            {/* --- results --- */}
                            {groups.map((g) => (
                                <div key={g.key} className="search-group">
                                    <div className="search-group-title">
                                        {g.label}
                                        <span>{g.total}</span>
                                    </div>

                                    {g.items.map(({ id, index, item }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            data-active={index === active}
                                            className={`search-item ${index === active ? 'active' : ''}`}
                                            onMouseEnter={() => setActive(index)}
                                            onClick={() => go(g.route)}
                                        >
                                            <span
                                                className="search-item-icon"
                                                style={{ background: g.bg, color: g.color }}
                                            >
                                                <g.icon size={16} />
                                            </span>
                                            <span className="search-item-main">
                                                <span className="search-item-title">
                                                    <Highlight text={g.title(item)} terms={terms} />
                                                </span>
                                                {g.sub(item) && (
                                                    <span className="search-item-sub">
                                                        <Highlight text={g.sub(item)} terms={terms} />
                                                    </span>
                                                )}
                                            </span>
                                            {g.meta(item) && <span className="search-item-meta">{g.meta(item)}</span>}
                                            <ChevronRight size={16} className="search-item-arrow" />
                                        </button>
                                    ))}

                                    {g.total > g.items.length && (
                                        <button type="button" className="search-more" onClick={() => go(g.route)}>
                                            +{g.total - g.items.length} more in {g.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="search-foot">
                            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
                            <span><kbd><CornerDownLeft size={10} /></kbd> open</span>
                            <span><kbd>esc</kbd> close</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Phone only: icon that opens the full-width search */}
            <button
                type="button"
                className="icon-btn search-trigger"
                onClick={openFromTrigger}
                aria-label="Open search"
            >
                <Search size={18} />
            </button>
        </>
    );
}