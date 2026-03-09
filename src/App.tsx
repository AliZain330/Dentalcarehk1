import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import OrdersPage from "@/pages/OrdersPage";
import ReportsPage from "@/pages/ReportsPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import VerificationPage from "@/pages/VerificationPage";
import InstitutionsPage from "@/pages/InstitutionsPage";
import InstitutionDetailPage from "@/pages/InstitutionDetailPage";
import CouponsPage from "@/pages/CouponsPage";
import ReferralPage from "@/pages/ReferralPage";
import SavedInstitutionsPage from "@/pages/SavedInstitutionsPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <FavoritesProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Auth routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/verification" element={<VerificationPage />} />

              {/* Main app routes with bottom nav */}
              <Route element={<AppLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/institutions" element={<InstitutionsPage />} />
                <Route path="/institution/:id" element={<InstitutionDetailPage />} />
                <Route path="/coupons" element={<CouponsPage />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route path="/saved-institutions" element={<SavedInstitutionsPage />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </FavoritesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
