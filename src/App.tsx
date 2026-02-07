import { useState } from "react";
import LoginPage from "./pages/Login";
import CertificatesPage from "./pages/Certificates";
import { tokenStore } from "./api/http";

export default function App() {
  const [auth, setAuth] = useState(!!tokenStore.access);

  if (!auth) {
    return <LoginPage onSuccess={() => setAuth(true)} />;
  }

  return <CertificatesPage />;
}
