import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

const API_KEY = import.meta.env.VITE_GOOGLE_API_KEY;
const CAL_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID;
const CONFIGURED = Boolean(API_KEY && CAL_ID);
const CAL_URL = 'https://calendar.google.com/calendar/u/0/r';

const ymd = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

function normalize(ev) {
    const allDay = Boolean(ev.start?.date);
    return {
        id: ev.id,
        title: (ev.summary || '').trim(),
        allDay,
        start: new Date(ev.start?.dateTime || `${ev.start?.date}T00:00:00`),
        end: new Date(ev.end?.dateTime || `${ev.end?.date}T00:00:00`),
        link: ev.htmlLink,
    };
}

const endpoint = (params) =>
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CAL_ID)}/events?${new URLSearchParams(
        { key: API_KEY, singleEvents: 'true', orderBy: 'startTime', ...params }
    )}`;

/* Turns Google's error into a message that says what to fix */
function explain(err) {
    const { status, reason } = err || {};
    if (status === undefined) return 'Network error. Check your internet connection.';
    if (status === 404)
        return 'Calendar not found. VITE_GOOGLE_CALENDAR_ID must be a calendar ID (your Gmail address or ...@group.calendar.google.com), not a service-account email.';
    if (status === 400)
        return 'The API key looks invalid. Check VITE_GOOGLE_API_KEY.';
    if (status === 403) {
        if (/accessNotConfigured|SERVICE_DISABLED/i.test(reason))
            return 'Google Calendar API is not enabled for this key’s project.';
        return 'Access denied. Make the calendar public (See all event details) and allow this site in the key’s referrer restrictions.';
    }
    return `Google returned an error (${status}).`;
}

export default function GoogleCalendar() {
    const [now, setNow] = useState(new Date());
    const [events, setEvents] = useState([]);
    const [status, setStatus] = useState(CONFIGURED ? 'loading' : 'idle');
    const [errorMsg, setErrorMsg] = useState('');

    /* keeps the tile correct after midnight, no refresh needed */
    useEffect(() => {
        const t = setInterval(() => setNow(new Date()), 60_000);
        return () => clearInterval(t);
    }, []);

    const todayKey = ymd(now);

    /* today + upcoming events from Google Calendar */
    useEffect(() => {
        if (!CONFIGURED) return undefined;
        const controller = new AbortController();
        setStatus('loading');

        fetch(
            endpoint({
                timeMin: startOfDay(new Date()).toISOString(),
                maxResults: '25',
            }),
            { signal: controller.signal }
        )
            .then(async (r) => {
                if (r.ok) return r.json();
                let reason = '';
                try {
                    const body = await r.json();
                    reason = body?.error?.errors?.[0]?.reason || body?.error?.status || '';
                } catch {
                    /* ignore */
                }
                throw { status: r.status, reason };
            })
            .then((json) => {
                setEvents(
                    (json.items || [])
                        .map(normalize)
                        .filter((ev) => ev.title) // hide events without a title
                );
                setStatus('ok');
            })
            .catch((err) => {
                if (err?.name === 'AbortError') return;
                console.warn('Google Calendar:', err);
                setErrorMsg(explain(err));
                setStatus('error');
            });

        return () => controller.abort();
    }, [todayKey]);

    const isToday = (ev) => {
        const last = ev.allDay ? new Date(ev.end.getTime() - 1) : ev.end;
        return ymd(startOfDay(ev.start)) <= todayKey && ymd(last) >= todayKey;
    };

    const todayEvents = events.filter(isToday);
    const upcoming = events.filter((ev) => !isToday(ev) && ymd(ev.start) > todayKey);
    const list = (todayEvents.length ? todayEvents : upcoming).slice(0, 3);

    const heading = todayEvents.length
        ? `${todayEvents.length} event${todayEvents.length > 1 ? 's' : ''} today`
        : upcoming.length
            ? 'Nothing today · Next up'
            : 'No events today';

    const timeLabel = (ev) => {
        if (ev.allDay) return 'All day';
        const t = ev.start.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
        return isToday(ev)
            ? t
            : `${ev.start.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · ${t}`;
    };

    return (
        <div className="dash-card-section datecard">
            {/* ---------- square date tile ---------- */}
            <a
                className="date-tile"
                href={CAL_URL}
                target="_blank"
                rel="noreferrer"
                title="Open Google Calendar"
            >
                <span className="date-tile-month">
                    {now.toLocaleDateString('en-US', { month: 'short' })}
                </span>
                <span className="date-tile-day">{now.getDate()}</span>
                <span className="date-tile-week">
                    {now.toLocaleDateString('en-US', { weekday: 'long' })}
                </span>
            </a>

            {/* ---------- schedule ---------- */}
            <div className="date-info">
                <div className="date-info-head">
                    <h3>Schedule</h3>
                </div>

                {!CONFIGURED && (
                    <p className="date-hint">
                        Connect Google Calendar to see your events. Add <code>VITE_GOOGLE_API_KEY</code> and{' '}
                        <code>VITE_GOOGLE_CALENDAR_ID</code> in <code>Frontend/.env</code>.
                    </p>
                )}

                {CONFIGURED && status === 'error' && (
                    <p className="date-hint date-hint-error">{errorMsg}</p>
                )}

                {CONFIGURED && status !== 'error' && (
                    <>
                        <div className="date-sub">{status === 'loading' ? 'Loading…' : heading}</div>
                        {list.map((ev) => (
                            <a
                                key={ev.id + ev.start}
                                href={ev.link}
                                target="_blank"
                                rel="noreferrer"
                                className="gcal-event"
                            >
                                <span className="gcal-event-bar" />
                                <span className="gcal-event-body">
                                    <span className="gcal-event-title">{ev.title}</span>
                                    <span className="gcal-event-time">
                                        <Clock size={11} />
                                        {timeLabel(ev)}
                                    </span>
                                </span>
                            </a>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}