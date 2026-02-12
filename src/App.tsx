import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ForceChangePasswordRoute } from "./auth/ForceChangePasswordRoute";

import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import FormPage from "./pages/FormPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* must be logged in */}
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePasswordPage />
              </ProtectedRoute>
            }
          />

          {/* must be logged in AND mustChangePassword = false */}
          <Route
            path="/"
            element={
              <ForceChangePasswordRoute>
                <FormPage />
              </ForceChangePasswordRoute>
            }
          />
        </Routes>

        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}
