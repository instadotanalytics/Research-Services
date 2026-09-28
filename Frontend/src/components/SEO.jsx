import { useEffect } from 'react';

export default function SEO({ title, description, canonical, image, type = 'website' }) {
  useEffect(() => {
    const siteUrl = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';
    const fullTitle = title ? `${title} | ResearchEdge` : 'ResearchEdge - Research & Academic Services';
    document.title = fullTitle;

    const setMeta = (name, content, attr = 'name') => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${name}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, name);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('description', description || 'Professional research and academic support services.');
    setMeta('og:title', fullTitle, 'property');
    setMeta('og:description', description || 'Professional research and academic support services.', 'property');
    setMeta('og:type', type, 'property');
    setMeta('og:url', canonical || siteUrl, 'property');
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', fullTitle);
    setMeta('twitter:description', description || '');
    if (image) {
      setMeta('og:image', image, 'property');
      setMeta('twitter:image', image);
    }

    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', canonical || siteUrl);
  }, [title, description, canonical, image, type]);

  return null;
}