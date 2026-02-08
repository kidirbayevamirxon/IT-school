import { Navigate, Route, Routes } from "react-router-dom";
import AuthLayout from "./pages/Auth";
import LoginPage from "./pages/Login";
import CertificatesPage from "./pages/Certificates";
import CoursesPage from "./pages/Courses";
import UsersPage from "./pages/Users";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

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
