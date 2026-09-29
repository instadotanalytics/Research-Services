
import { useId, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import './FAQ.css';

export default function FAQAccordion({ faqs = [] }) {
  const [open, setOpen] = useState(null);
  const baseId = useId();
  const reduce = useReducedMotion();

  if (!faqs.length) return null;

  return (
    <div className="faq-list">
      {faqs.map((f, i) => {
        const key = f._id || i;
        const isOpen = open === key;
        const questionId = `${baseId}-q-${i}`;
        const answerId = `${baseId}-a-${i}`;

        return (
          <div key={key} className={`faq-item${isOpen ? ' open' : ''}`}>
            <h3 className="faq-heading">
              <button
                type="button"
                id={questionId}
                className="faq-question"
                aria-expanded={isOpen}
                aria-controls={answerId}
                onClick={() => setOpen(isOpen ? null : key)}
              >
                <span className="faq-num" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="faq-q-text">{f.question}</span>
                <span className="faq-toggle" aria-hidden="true">
                  {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                </span>
              </button>
            </h3>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  className="faq-answer"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.24, ease: 'easeOut' }}
                >
                  <p>{f.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}