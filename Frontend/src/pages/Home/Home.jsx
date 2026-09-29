import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, Award, Users, Building2, FileText, BookOpen, Search, GraduationCap,
  ClipboardList, ClipboardCheck, PenLine, BarChart3, Settings, PackageCheck, ShieldCheck,
  Target, UserCheck, Clock, Plus, Minus, ChevronLeft, ChevronRight, Newspaper, Database,
  Lightbulb, School, Landmark, FlaskConical, FolderOpen, MessageCircle,
} from 'lucide-react';
import SEO from '../../components/SEO.jsx';
import { getTestimonials, getFAQs } from '../../services/contentApi.js';
import herobanner from '../../assets/herobanner.png';
import herobanner2 from '../../assets/herobanner2.png';
import heroimg from '../../assets/heroimg.png';
import { getServices } from '../../services/serviceApi.js';
import ServiceCard from '../../components/ServiceCard/ServiceCard.jsx';
import './Home.css';

const heroStats = [
  { icon: FolderOpen, value: '500+', label: 'Research Projects Supported' },
  { icon: FileText, value: '200+', label: 'Research Papers Assisted' },
  { icon: GraduationCap, value: '100+', label: 'Scholars Supported' },
  { icon: Building2, value: '50+', label: 'Academic Institutions' },
];

const defaultServices = [
  { _id: 's1', icon: 'FileText', title: 'Dissertation Writing', shortDescription: 'Well-researched and professionally written dissertations tailored to your needs.' },
  { _id: 's2', icon: 'PenLine', title: 'Research Paper Writing', shortDescription: 'High-quality research papers with proper structure and referencing.' },
  { _id: 's3', icon: 'Newspaper', title: 'Research Paper Publication Assistance', shortDescription: 'Guidance for journal selection, formatting and submission support.' },
  { _id: 's4', icon: 'BookOpen', title: 'Thesis Writing', shortDescription: 'In-depth thesis support with strong research and analysis.' },
  { _id: 's5', icon: 'UserCheck', title: 'Synopsis Writing', shortDescription: 'Well-structured synopsis for your research proposal.' },
  { _id: 's6', icon: 'Database', title: 'Data Collection & Analysis', shortDescription: 'Accurate data collection, analysis and meaningful insights.' },
  { _id: 's7', icon: 'Users', title: 'Faculty Development Program (FDP)', shortDescription: 'Customized FDP programs for faculty and institutions.' },
  { _id: 's8', icon: 'Lightbulb', title: 'Research Proposal Writing', shortDescription: 'Professional research proposals for funding and academic projects.' },
  { _id: 's9', icon: 'School', title: 'College & School Academic Writing', shortDescription: 'Assignments, projects, reports and academic content support.' },
];

const whyUs = [
  { icon: Award, title: 'Experienced Support', desc: 'Skilled professionals with domain expertise.' },
  { icon: Target, title: 'Structured Approach', desc: '