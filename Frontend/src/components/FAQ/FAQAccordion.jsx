import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import './FAQ.css';

export default function FAQAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);

  if (!faqs.length) return null;

  return (
    <div className="faq-list">
      {faqs.map((f, i) => (
        <div key={f._id || i} className={`faq-item ${open === i ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => setOpen(open === i ? null : i)}>
            <span>{f.question}</span>
            <ChevronDown size={20} className="faq-chevron" />
          </button>
          <div className="faq-answer">
            <p>{f.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}