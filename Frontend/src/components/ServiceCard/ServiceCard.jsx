import { Link } from 'react-router-dom';
import { ArrowRight, GraduationCap, FileText, Send, BookOpen, ClipboardList, BarChart3, Users, Lightbulb, School } from 'lucide-react';
import './ServiceCard.css';

const iconMap = {
  GraduationCap, FileText, Send, BookOpen, ClipboardList, BarChart3, Users, Lightbulb, School,
};

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || FileText;
  return (
    <div className="service-card">
      <div className="service-card-icon">
        <Icon size={26} />
      </div>
      <h3>{service.title}</h3>
      <p>{service.shortDescription}</p>
      <Link to={`/services/${service.slug}`} className="service-card-link">
        Learn More <ArrowRight size={16} />
      </Link>
    </div>
  );
}   