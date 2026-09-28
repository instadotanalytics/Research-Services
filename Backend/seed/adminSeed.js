import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import Service from '../models/Service.js';
import FAQ from '../models/FAQ.js';
import Statistic from '../models/Statistic.js';
import Testimonial from '../models/Testimonial.js';
import SiteSetting from '../models/SiteSetting.js';
import connectDB from '../config/db.js';

dotenv.config();

const services = [
  {
    title: 'Dissertation Writing',
    slug: 'dissertation-writing',
    shortDescription:
      'Structured expert guidance for your dissertation at every stage — from topic selection to final submission.',
    description:
      'Our dissertation writing support provides comprehensive academic guidance to research scholars pursuing Master\'s and Doctoral degrees. We assist with topic refinement, literature review structure, research methodology design, data interpretation, chapter development and academic formatting — all while ensuring the work remains your own original contribution.',
    features: [
      'Topic selection & refinement guidance',
      'Structured chapter-wise assistance',
      'Literature review support',
      'Methodology design assistance',
      'Formatting and referencing guidance',
    ],
    benefits: [
      'Structured, stage-wise support',
      'Personalized feedback on your work',
      'Time-efficient academic workflow',
      'Improved academic writing quality',
    ],
    process: [
      { step: 'Requirement Discussion', description: 'Understand your topic, stage and deadlines.' },
      { step: 'Planning', description: 'Create a chapter-wise roadmap with deliverables.' },
      { step: 'Guided Writing Support', description: 'Assist with structure, content and formatting.' },
      { step: 'Review & Refinement', description: 'Iterative reviews based on supervisor feedback.' },
    ],
    audience: ['Master\'s Students', 'PhD Scholars', 'Research Fellows'],
    faqs: [
      { question: 'Is the work original?', answer: 'Yes. Our support focuses on guidance and structure — the final content is created with your original research inputs.' },
      { question: 'Do you follow university guidelines?', answer: 'Yes, we align with your university\'s formatting and submission norms.' },
    ],
    icon: 'GraduationCap',
    ctaText: 'Get Dissertation Assistance',
    order: 1,
  },
  {
    title: 'Research Paper Writing',
    slug: 'research-paper-writing',
    shortDescription: 'Professional academic guidance for structuring and writing high-quality research papers.',
    description:
      'We assist researchers in structuring, writing and refining research papers for academic conferences and journals. Our support includes abstract structuring, literature synthesis, methodology articulation, results presentation and academic language polishing.',
    features: ['Abstract & introduction support', 'Literature synthesis guidance', 'Methodology articulation', 'Results & discussion structuring', 'Language refinement'],
    benefits: ['Improved clarity and structure', 'Alignment with journal formats', 'Faster writing workflow'],
    process: [
      { step: 'Consultation', description: 'Discuss research objectives and target venue.' },
      { step: 'Structuring', description: 'Develop paper outline and section strategy.' },
      { step: 'Writing Support', description: 'Assist with each section content flow.' },
      { step: 'Refinement', description: 'Polish language, formatting and citations.' },
    ],
    audience: ['Researchers', 'PhD Scholars', 'Faculty Members'],
    faqs: [
      { question: 'Do you guarantee acceptance?', answer: 'No. We provide publication-focused writing assistance; acceptance depends on peer review.' },
    ],
    icon: 'FileText',
    ctaText: 'Get Paper Writing Support',
    order: 2,
  },
  {
    title: 'Research Paper Publication Assistance',
    slug: 'research-paper-publication',
    shortDescription: 'Guidance on selecting appropriate journals and preparing manuscripts for submission.',
    description:
      'We provide ethical publication assistance — helping you identify suitable peer-reviewed journals, format manuscripts to journal guidelines, prepare cover letters and navigate submission workflows. We do not guarantee publication.',
    features: ['Journal identification guidance', 'Manuscript formatting', 'Cover letter preparation', 'Submission process support'],
    benefits: ['Better journal fit', 'Format compliance', 'Reduced submission errors'],
    process: [
      { step: 'Paper Review', description: 'Assess paper scope and quality.' },
      { step: 'Journal Matching', description: 'Suggest suitable peer-reviewed journals.' },
      { step: 'Formatting', description: 'Format per journal guidelines.' },
      { step: 'Submission Guidance', description: 'Assist with submission workflow.' },
    ],
    audience: ['Researchers', 'PhD Scholars', 'Faculty'],
    faqs: [
      { question: 'Do you guarantee publication?', answer: 'No. We assist with the submission process. Acceptance is determined by the journal\'s peer review.' },
    ],
    icon: 'Send',
    ctaText: 'Request Publication Assistance',
    order: 3,
  },
  {
    title: 'Thesis Writing',
    slug: 'thesis-writing',
    shortDescription: 'Comprehensive academic guidance for thesis development across all disciplines.',
    description:
      'Our thesis writing support provides structured academic guidance — helping you build each chapter with clarity and academic rigor while keeping the work authentic to your research.',
    features: ['Chapter-wise guidance', 'Academic language refinement', 'Referencing assistance', 'Formatting support'],
    benefits: ['Better academic clarity', 'Consistent structure', 'Time-efficient process'],
    process: [
      { step: 'Discussion', description: 'Understand thesis scope and stage.' },
      { step: 'Roadmap', description: 'Build chapter-wise plan.' },
      { step: 'Guidance', description: 'Support writing and structuring.' },
      { step: 'Review', description: 'Refine language and format.' },
    ],
    audience: ['Master\'s Students', 'PhD Scholars'],
    faqs: [
      { question: 'Can you help with any subject?', answer: 'We support a wide range of academic disciplines.' },
    ],
    icon: 'BookOpen',
    ctaText: 'Get Thesis Support',
    order: 4,
  },
  {
    title: 'Synopsis Writing',
    slug: 'synopsis-writing',
    shortDescription: 'Expert guidance for crafting a strong research synopsis or proposal for approval.',
    description:
      'We help you structure a clear, well-organized research synopsis with proper research objectives, hypotheses, methodology and significance — aligned with your institution\'s requirements.',
    features: ['Research objective framing', 'Methodology structuring', 'Literature outline', 'Formatting guidance'],
    benefits: ['Clear research direction', 'Better approval readiness', 'Structured presentation'],
    process: [
      { step: 'Topic Discussion', description: 'Understand research domain.' },
      { step: 'Structure', description: 'Develop synopsis framework.' },
      { step: 'Draft Support', description: 'Assist with each section.' },
      { step: 'Final Review', description: 'Refinement and formatting.' },
    ],
    audience: ['Master\'s Students', 'PhD Aspirants'],
    faqs: [{ question: 'Do you follow university formats?', answer: 'Yes, we align with your institution\'s synopsis format.' }],
    icon: 'ClipboardList',
    ctaText: 'Get Synopsis Assistance',
    order: 5,
  },
  {
    title: 'Data Collection & Analysis',
    slug: 'data-collection-analysis',
    shortDescription: 'Support with data collection strategy and statistical analysis using industry-standard tools.',
    description:
      'We assist with research data collection planning and statistical analysis using tools like SPSS, R, Python, Excel and more. We help you interpret results clearly and prepare them for your thesis or paper.',
    features: ['Data collection strategy', 'Statistical analysis (SPSS, R, Python)', 'Data visualization', 'Result interpretation'],
    benefits: ['Accurate analysis', 'Clear visualizations', 'Better interpretation'],
    process: [
      { step: 'Requirement', description: 'Understand data and research questions.' },
      { step: 'Planning', description: 'Define analysis approach.' },
      { step: 'Analysis', description: 'Perform statistical analysis.' },
      { step: 'Reporting', description: 'Interpret and present results.' },
    ],
    audience: ['Researchers', 'PhD Scholars', 'Students'],
    faqs: [{ question: 'Which tools do you use?', answer: 'SPSS, R, Python, Excel, Stata and more, based on your research design.' }],
    icon: 'BarChart3',
    ctaText: 'Request Data Analysis',
    order: 6,
  },
  {
    title: 'Faculty Development Program (FDP)',
    slug: 'faculty-development-program',
    shortDescription: 'Structured FDP support for faculty members and academic institutions.',
    description:
      'We provide structured assistance for Faculty Development Programs — including content preparation, session planning, documentation and reporting — aligned with institutional and UGC norms.',
    features: ['FDP content preparation', 'Session planning', 'Documentation support', 'Reporting assistance'],
    benefits: ['Structured FDP delivery', 'Compliance readiness', 'Time savings'],
    process: [
      { step: 'Requirement', description: 'Understand FDP scope and objectives.' },
      { step: 'Planning', description: 'Design sessions and content.' },
      { step: 'Execution Support', description: 'Assist with logistics and material.' },
      { step: 'Documentation', description: 'Prepare reports and records.' },
    ],
    audience: ['Faculty Members', 'Colleges', 'Universities'],
    faqs: [{ question: 'Do you support UGC-aligned FDPs?', answer: 'Yes, we align with UGC and institutional guidelines.' }],
    icon: 'Users',
    ctaText: 'Request FDP Support',
    order: 7,
  },
  {
    title: 'Research Proposal Writing',
    slug: 'research-proposal-writing',
    shortDescription: 'Expert guidance for research proposals for grants, fellowships and institutional approval.',
    description:
      'We assist with structuring research proposals for grants, fellowships and academic approvals — covering objectives, methodology, budget outline, timeline and expected outcomes.',
    features: ['Proposal structuring', 'Methodology design', 'Budget outline guidance', 'Timeline preparation'],
    benefits: ['Clear proposal structure', 'Better approval readiness', 'Aligned documentation'],
    process: [
      { step: 'Discussion', description: 'Understand funding body and scope.' },
      { step: 'Drafting', description: 'Structure the proposal sections.' },
      { step: 'Review', description: 'Refine content and format.' },
      { step: 'Submission Guidance', description: 'Assist with submission.' },
    ],
    audience: ['Researchers', 'Faculty', 'PhD Scholars'],
    faqs: [{ question: 'Do you guarantee grants?', answer: 'No. We assist with proposal preparation; funding decisions are made by the grant body.' }],
    icon: 'Lightbulb',
    ctaText: 'Get Proposal Support',
    order: 8,
  },
  {
    title: 'College & School Academic Writing',
    slug: 'academic-writing',
    shortDescription: 'Academic writing support for colleges, schools and educational institutions.',
    description:
      'We support schools, colleges and institutions with academic documentation — including reports, project guidelines, curriculum documents, accreditation files and more.',
    features: ['Academic documentation', 'Curriculum documents', 'Accreditation file support', 'Report preparation'],
    benefits: ['Professional documentation', 'Time savings', 'Consistent quality'],
    process: [
      { step: 'Requirement', description: 'Understand institutional needs.' },
      { step: 'Planning', description: 'Define document scope.' },
      { step: 'Drafting', description: 'Prepare structured content.' },
      { step: 'Delivery', description: 'Final review and handover.' },
    ],
    audience: ['Colleges', 'Schools', 'Institutions'],
    faqs: [{ question: 'Can you handle bulk documentation?', answer: 'Yes, we support bulk academic documentation projects.' }],
    icon: 'School',
    ctaText: 'Request Academic Support',
    order: 9,
  },
];

const seedData = async () => {
  try {
    await connectDB();

    // Admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@research.com';
    const adminExists = await Admin.findOne({ email: adminEmail });
    if (!adminExists) {
      await Admin.create({
        name: 'Super Admin',
        email: adminEmail,
        password: process.env.ADMIN_PASSWORD || 'Admin@12345',
        role: 'superadmin',
      });
      console.log(`✅ Admin created: ${adminEmail}`);
    } else {
      console.log('ℹ️  Admin already exists');
    }

    // Services
    if ((await Service.countDocuments()) === 0) {
      await Service.insertMany(services);
      console.log(`✅ ${services.length} services seeded`);
    }

    // FAQs
    if ((await FAQ.countDocuments()) === 0) {
      await FAQ.insertMany([
        { question: 'What types of research support do you provide?', answer: 'We provide dissertation, thesis, research paper, synopsis, data analysis, proposal writing, FDP and academic writing support.', order: 1 },
        { question: 'Is your work confidential?', answer: 'Yes. All interactions and documents are kept strictly confidential.', order: 2 },
        { question: 'Do you guarantee publication?', answer: 'No. We provide publication assistance. Acceptance is determined by journals through peer review.', order: 3 },
        { question: 'How do I get started?', answer: 'Submit an enquiry through our contact form or WhatsApp. Our team will reach out within 24 hours.', order: 4 },
        { question: 'Do you follow university guidelines?', answer: 'Yes, we align with your institution\'s formats, referencing styles and submission norms.', order: 5 },
      ]);
      console.log('✅ FAQs seeded');
    }

    // Statistics
    if ((await Statistic.countDocuments()) === 0) {
      await Statistic.insertMany([
        { title: 'Research Projects Supported', value: '500+', icon: 'Award', order: 1 },
        { title: 'Research Papers Assisted', value: '200+', icon: 'FileText', order: 2 },
        { title: 'Scholars Supported', value: '100+', icon: 'Users', order: 3 },
        { title: 'Academic Institutions', value: '50+', icon: 'Building2', order: 4 },
      ]);
      console.log('✅ Statistics seeded');
    }

    // Testimonials
    if ((await Testimonial.countDocuments()) === 0) {
      await Testimonial.insertMany([
        {
          name: 'Rahul Sharma',
          designation: 'PhD Scholar',
          institution: 'Delhi University',
          review: 'The structured guidance helped me organize my dissertation chapters clearly. The team was professional and responsive throughout.',
          rating: 5,
          order: 1,
        },
        {
          name: 'Dr. Priya Nair',
          designation: 'Assistant Professor',
          institution: 'Christ College',
          review: 'Very helpful support for our FDP documentation. Well-organized and aligned with UGC requirements.',
          rating: 5,
          order: 2,
        },
        {
          name: 'Amit Verma',
          designation: 'M.Tech Student',
          institution: 'NIT Trichy',
          review: 'Data analysis support was excellent. The team explained the statistical interpretation clearly.',
          rating: 5,
          order: 3,
        },
        {
          name: 'Dr. Kavita Iyer',
          designation: 'Research Guide',
          institution: 'Mumbai University',
          review: 'A reliable partner for research paper structuring and journal formatting guidance.',
          rating: 4,
          order: 4,
        },
      ]);
      console.log('✅ Testimonials seeded');
    }

    // Settings
    if ((await SiteSetting.countDocuments()) === 0) {
      await SiteSetting.create({});
      console.log('✅ Default site settings created');
    }

    console.log('\n🎉 Seed completed successfully!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();