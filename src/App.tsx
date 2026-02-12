import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/Auth";
import LoginPage from "./pages/Login";
import CertificatesPage from "./pages/Certificates";
import CoursesPage from "./pages/Courses";
import UsersPage from "./pages/Users";
import CertificatePage from "./pages/CertificatePage";
export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/certificate/:id" element={<CertificatePage />} />

      {/* Protected */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Navigate to="/certificates" replace />} />
        <Route path="/certificates" element={<CertificatesPage />} />
        <Route path="/courses" element={<CoursesPage />} />
        <Route path="/users" element={<UsersPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

