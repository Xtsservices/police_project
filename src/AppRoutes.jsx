import { Routes, Route } from "react-router-dom";
// import ProtectedRoute from "./components/ProtectedRoute";
import LayoutWrapper from "./components/commonComponents/LayoutWrapper";
import NotFound from "./components/commonComponents/NotFound ";
import Dashboard from "./components/dashboard/Dashboard";
import ProtectedRoute from "./components/protected/ProtectedRoute";
import LoginRegister from "./components/auth/LoginRegister";
import SuperAdminPatients from "./components/dashboard/superAdminPatients/SuperAdminPatients";
import SuperadminHospitalsList from "./components/dashboard/hospitals/SuperadminHospitalsList";
import HospitalAdminDashboard from "./components/hospitalAdmin/HospitalAdminDashboard";
import HospitalAdminPatients from "./components/hospitalAdmin/hospitalAdminPatients/HospitalAdminPatients";
import UserProfile from "./components/commonComponents/UserProfile";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LoginRegister />} />

      {/* superAdmin and hospital adminroutes */}
      <Route element={<LayoutWrapper />}>
        <Route
          path="/SuperAdmin/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SuperAdmin/hospitals"
          element={
            <ProtectedRoute>
              <SuperadminHospitalsList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SuperAdmin/patients"
          element={
            <ProtectedRoute>
              <SuperAdminPatients />
            </ProtectedRoute>
          }
        />

        {/* ========profile======= */}
        <Route path="/userProfile" element={<UserProfile />} />

        {/* hospitaladmin */}

        <Route
          path="/hospitaladmin/dashboard"
          element={
            <ProtectedRoute>
              <HospitalAdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hospitaladmin/patients"
          element={
            <ProtectedRoute>
              <HospitalAdminPatients />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
