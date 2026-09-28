import mongoose from 'mongoose';

const siteSettingSchema = new mongoose.Schema(
  {
    companyName: { type: String, default: 'ResearchEdge Academic Services' },
    tagline: { type: String, default: 'Empowering Research. Supporting Academic Excellence.' },
    logo: { type: String, default: '' },
    email: { type: String, default: 'info@research.com' },
    phone: { type: String, default: '+91 98765 43210' },
    whatsapp: { type: String, default: '+91 98765 43210' },
    address: { type: String, default: 'India' },
    businessHours: { type: String, default: 'Mon - Sat: 9:00 AM - 7:00 PM' },
    socialLinks: {
      facebook: { type: String, default: '' },
      twitter: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
    },
    footerText: {
      type: String,
      default: 'Professional research and academic support services for students, researchers, scholars and educational institutions.',
    },
    seo: {
      defaultTitle: { type: String, default: 'ResearchEdge - Research & Academic Services' },
      defaultDescription: { type: String, default: 'Professional research and academic support services.' },
      keywords: { type: String, default: 'research support, academic writing, thesis writing, dissertation' },
    },
  },
  { timestamps: true }
);

const SiteSetting = mongoose.model('SiteSetting', siteSettingSchema);
export default SiteSetting;