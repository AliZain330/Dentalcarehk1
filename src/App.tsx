import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { BookingProvider } from "@/context/BookingContext";
import { OrdersProvider } from "@/context/OrdersContext";
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
import ServiceListPage from "@/pages/ServiceListPage";
import ServiceDetailPage from "@/pages/ServiceDetailPage";
import DoctorListPage from "@/pages/DoctorListPage";
import DoctorDetailPage from "@/pages/DoctorDetailPage";
import TimeSlotPage from "@/pages/TimeSlotPage";
import BookingConfirmPage from "@/pages/BookingConfirmPage";
import PaymentPage from "@/pages/PaymentPage";
import PaymentSuccessPage from "@/pages/PaymentSuccessPage";
import OrderDetailPage from "@/pages/OrderDetailPage";
import CancelOrderPage from "@/pages/CancelOrderPage";
import ReviewPage from "@/pages/ReviewPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <FavoritesProvider>
        <BookingProvider>
          <OrdersProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/verification" element={<VerificationPage />} />

                  {/* Payment success (no bottom nav) */}
                  <Route path="/booking/success" element={<PaymentSuccessPage />} />

                  {/* Main app */}
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

                    {/* Booking flow */}
                    <Route path="/booking/services/:id" element={<ServiceListPage />} />
                    <Route path="/booking/service-detail/:instId/:svcId" element={<ServiceDetailPage />} />
                    <Route path="/booking/doctors/:instId/:svcId" element={<DoctorListPage />} />
                    <Route path="/booking/doctor-detail/:instId/:svcId/:docId" element={<DoctorDetailPage />} />
                    <Route path="/booking/time/:instId/:svcId/:docId" element={<TimeSlotPage />} />
                    <Route path="/booking/confirm/:instId/:svcId/:docId" element={<BookingConfirmPage />} />
                    <Route path="/booking/payment/:instId/:svcId/:docId" element={<PaymentPage />} />

                    {/* Orders */}
                    <Route path="/order/:orderId" element={<OrderDetailPage />} />
                    <Route path="/order/:orderId/cancel" element={<CancelOrderPage />} />
                    <Route path="/order/:orderId/review" element={<ReviewPage />} />
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </OrdersProvider>
        </BookingProvider>
      </FavoritesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
