import React from "react";
import { Navigate } from "react-router-dom";

const AdminSettingsPage: React.FC = () => {
  return <Navigate to="/admin/settings/basic" replace />;
};

export default AdminSettingsPage;
