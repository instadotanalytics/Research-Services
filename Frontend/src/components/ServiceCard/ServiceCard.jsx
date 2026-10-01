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
    <Link
      to={to}
      className={`svc-card ${img ? '' : 'no-img'}`}
      aria-label={service.title}
    >
      <div className="svc-card-media">
        {img ? (
          <img src={img} alt="" loading="lazy" />
        ) : (
          <span className="svc-card-fallback">
            <Icon size={46} strokeWidth={1.5} />
          </span>
        )}
      </div>

      <div className="svc-card-body">
        <span className="svc-card-badge"><Icon size={20} /></span>
        <h3 className="svc-card-title">{service.title}</h3>
        <p>{service.shortDescription}</p>
        <span className="svc-card-link">
          Learn more <ArrowUpRight size={15} />
        </span>
      </div>
    </Link>
  );
}