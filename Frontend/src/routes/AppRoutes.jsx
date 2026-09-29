import { Routes, Route, Navigate } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import AdminLayout from '../layouts/AdminLayout.jsx';
import ProtectedRoute from '../components/ProtectedRoute/ProtectedRoute.jsx';

// Public pages
import Home from '../pages/Home/Home.jsx';
import About from '../pages/About/About.jsx';
import Contact from '../pages/Contact/Contact.jsx';

// Legal
import PrivacyPolicy from '../pages/Legal/PrivacyPolicy.jsx';
import Terms from '../pages/Legal/Terms.jsx';
import RefundPolicy from '../pages/Legal/RefundPolicy.jsx';
import Disclaimer from '../pages/Legal/Disclaimer.jsx';

// Admin
import AdminDashboard from '../admin/Dashboard/AdminDashboard.jsx';
import AdminServices from '../admin/Services/AdminServices.jsx';
import AdminEnquiries from '../admin/Enquiries/AdminEnquiries.jsx';
import AdminTestimonials from '../admin/Testimonials/AdminTestimonials.jsx';
import AdminFAQs from '../admin/FAQs/AdminFAQs.jsx';
import AdminStatistics from '../admin/Statistics/AdminStatistics.jsx';

import Services from '../services/Services.jsx';
import ServiceDetails from '../services/ServiceDetails.jsx';
import FAQPage from '../components/FAQ/FAQPage.jsx';
import AdminLogin from '../admin/components/Login/AdminLogin.jsx';
import AdminProfile from '../admin/Profile/AdminProfile.jsx';

export default function AppRoutes() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetails />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<Terms />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
        </Route>

        {/* Admin Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin protected */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="enquiries" element={<AdminEnquiries />} />
          <Route path="testimonials" element={<AdminTestimonials />} />
          <Route path="faqs" element={<AdminFAQs />} />
          <Route path="statistics" element={<AdminStatistics />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}