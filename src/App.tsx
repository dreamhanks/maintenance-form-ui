import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import { ProtectedRoute } from "./auth/ProtectedRoute";

// import FormPage from "./pages/FormPage";
import ProposalListPage from "./pages/ProposalListPage";
import JuchuHanteiListPage from "./pages/JuchuHanteiListPage";
import ShichuListPage from "./pages/ShichuListPage";
import KeiyakuListPage from "./pages/KeiyakuListPage";
import MitsumoriIraishoPage from "./pages/MitsumoriIraishoPage";
// import ConstructionRequestAllInOnePage from "./pages/ConstructionRequestAllInOnePage";
import EizenRequestAllInOnePage from "./pages/EizenRequestAllInOnePage";
import UnauthorizedPage from "./pages/UnauthorizedPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProposalListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/juchu"
            element={
              <ProtectedRoute>
                <JuchuHanteiListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/shichu"
            element={
              <ProtectedRoute>
                <ShichuListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/keiyaku"
            element={
              <ProtectedRoute>
                <KeiyakuListPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form"
            element={
              <ProtectedRoute>
                <EizenRequestAllInOnePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/form/:id"
            element={
              <ProtectedRoute>
                <EizenRequestAllInOnePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mitsumori/:formRecordId"
            element={
              <ProtectedRoute>
                <MitsumoriIraishoPage />
              </ProtectedRoute>
            }
          />
        </Routes>

        <ToastContainer />
      </AuthProvider>
    </BrowserRouter>
  );
}
