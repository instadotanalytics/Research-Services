import './Skeleton.css';

// Single shimmering block
export function Skeleton({ w = '100%', h = 16, r = 6, style, className = '' }) {
    return (
        <span
            className={`skeleton ${className}`}
            style={{ width: w, height: h, borderRadius: r, ...style }}
        />
    );
}

// Placeholder <tr> rows for any admin table. Use inside <tbody>.
// The last column is the "Actions" kebab, so it's drawn small.
export function TableSkeletonRows({ rows = 6, cols = 5 }) {
    return [...Array(rows)].map((_, i) => (
        <tr key={i}>
            {[...Array(cols)].map((_, c) => (
                <td key={c} style={c === cols - 1 ? { textAlign: 'right' } : undefined}>
                    {c === cols - 1 ? (
                        <Skeleton w={24} h={24} r={6} style={{ marginLeft: 'auto' }} />
                    ) : (
                        <Skeleton w={c === 0 ? '55%' : c % 2 ? '70%' : '45%'} h={14} />
                    )}
                </td>
            ))}
        </tr>
    ));
}