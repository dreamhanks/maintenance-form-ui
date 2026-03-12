import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { ForceChangePasswordRoute } from "./auth/ForceChangePasswordRoute";

import LoginPage from "./pages/LoginPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
// import FormPage from "./pages/FormPage";
import ProposalListPage from "./pages/ProposalListPage";
import JuchuHanteiListPage from "./pages/JuchuHanteiListPage";
import ShichuListPage from "./pages/ShichuListPage";
import KeiyakuListPage from "./pages/KeiyakuListPage";
import MitsumoriIraishoPage from "./pages/MitsumoriIraishoPage";
// import ConstructionRequestAllInOnePage from "./pages/ConstructionRequestAllInOnePage";
import EizenRequestAllInOnePage from "./pages/EizenRequestAllInOnePage";

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
                <ProposalListPage />
              </ForceChangePasswordRoute>
            }
          />

          <Route
            path="/juchu"
            element={
              <ForceChangePasswordRoute>
                <JuchuHanteiListPage />
              </ForceChangePasswordRoute>
            }
          />

          <Route
            path="/shichu"
            element={
              <ForceChangePasswordRoute>
                <ShichuListPage />
              </ForceChangePasswordRoute>
            }
          />

          <Route
            path="/keiyaku"
            element={
              <ForceChangePasswordRoute>
                <KeiyakuListPage />
              </ForceChangePasswordRoute>
            }
          />

          <Route
            path="/form"
            element={
              <ForceChangePasswordRoute>
                {/* <FormPage /> */}
                <EizenRequestAllInOnePage />
              </ForceChangePasswordRoute>
            }
          />

          <Route
            path="/mitsumori"
            element={
              <ForceChangePasswordRoute>
                <MitsumoriIraishoPage />
              </ForceChangePasswordRoute>
            }
          />
        </Routes>

        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}
