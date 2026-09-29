import { Link } from 'react-router-dom';
import { ArrowUpRight, FileText } from 'lucide-react';
import { iconMap } from '../../utils/serviceIcons.js';
import { optimizeImage } from '../../utils/cloudinary.js';
import './ServiceCard.css';

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || FileText;
  const to = service.slug ? `/services/${service.slug}` : '/services';
  const img = optimizeImage(service.image, 700);

  return (
    <Link to={to} className="svc-card" aria-label={service.title}>
      <div className={`svc-card-media ${img ? '' : 'no-img'}`}>
        {img ? (
          <img src={img} alt="" loading="lazy" />
        ) : (
          <Icon size={46} strokeWidth={1.5} className="svc-card-fallback-icon" />
        )}
        {img && (
          <span className="svc-card-badge"><Icon size={16} /></span>
        )}
        <div className="svc-card-fade" />
        <h3 className="svc-card-title">{service.title}</h3>
      </div>

      <div className="svc-card-body">
        <p>{service.shortDescription}</p>
        <span className="svc-card-arrow" aria-hidden="true">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  );
}