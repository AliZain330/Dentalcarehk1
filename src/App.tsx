import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import AppLayout from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import OrdersPage from "@/pages/OrdersPage";
import ReportsPage from "@/pages/ReportsPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ForgotPasswordPage from "@/pages/ForgotPasswordPage";
import VerificationPage from "@/pages/VerificationPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Auth routes (no bottom nav) */}
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
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
