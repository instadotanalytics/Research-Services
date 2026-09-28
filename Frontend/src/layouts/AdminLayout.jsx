import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/components/AdminSidebar.jsx';
import AdminTopbar from '../admin/components/AdminTopbar.jsx';
import './AdminLayout.css';

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <AdminSidebar />
      <div className="admin-main">
        <AdminTopbar />
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}