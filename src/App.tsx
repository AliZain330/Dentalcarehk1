import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { BookingProvider } from "@/context/BookingContext";
import { OrdersProvider } from "@/context/OrdersContext";
import { ConsultationProvider } from "@/context/ConsultationContext";
import { CouponProvider } from "@/context/CouponContext";
import { ReferralProvider } from "@/context/ReferralContext";
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
import ReferralRecordsPage from "@/pages/ReferralRecordsPage";
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
import OnlineDoctorListPage from "@/pages/OnlineDoctorListPage";
import OnlineDoctorDetailPage from "@/pages/OnlineDoctorDetailPage";
import ConsultationRequestPage from "@/pages/ConsultationRequestPage";
import ConsultationConfirmPage from "@/pages/ConsultationConfirmPage";
import ConsultationPaymentPage from "@/pages/ConsultationPaymentPage";
import ConsultationSuccessPage from "@/pages/ConsultationSuccessPage";
import ConsultationOrderDetailPage from "@/pages/ConsultationOrderDetailPage";
import ConsultationChatPage from "@/pages/ConsultationChatPage";
import VideoConsultationPage from "@/pages/VideoConsultationPage";
import ConsultationReviewPage from "@/pages/ConsultationReviewPage";
import ReportDetailPage from "@/pages/ReportDetailPage";
import PersonalInfoPage from "@/pages/PersonalInfoPage";
import AccountSecurityPage from "@/pages/AccountSecurityPage";
import ChangePasswordPage from "@/pages/ChangePasswordPage";
import ChangeMobilePage from "@/pages/ChangeMobilePage";
import ChangeEmailPage from "@/pages/ChangeEmailPage";
import LoginDevicesPage from "@/pages/LoginDevicesPage";
import MyFavoritesPage from "@/pages/MyFavoritesPage";
import MyReviewsPage from "@/pages/MyReviewsPage";
import CustomerServicePage from "@/pages/CustomerServicePage";
import FAQPage from "@/pages/FAQPage";
import ComplaintPage from "@/pages/ComplaintPage";
import SettingsPage from "@/pages/SettingsPage";
import PrivacyPolicyPage from "@/pages/PrivacyPolicyPage";
import UserAgreementPage from "@/pages/UserAgreementPage";
import AiTriagePage from "@/pages/AiTriagePage";
import NotFound from "./pages/NotFound";
import { InstitutionProvider } from "@/institution/context/InstitutionContext";
import InstitutionLayout from "@/institution/components/InstitutionLayout";
import InstitutionRegisterPage from "@/institution/pages/InstitutionRegisterPage";
import InstitutionCredentialsPage from "@/institution/pages/InstitutionCredentialsPage";
import InstitutionDashboardPage from "@/institution/pages/InstitutionDashboardPage";
import InstitutionInfoPage from "@/institution/pages/InstitutionInfoPage";
import InstitutionServicesPage from "@/institution/pages/InstitutionServicesPage";
import InstitutionDoctorsPage from "@/institution/pages/InstitutionDoctorsPage";
import InstitutionOrdersPage from "@/institution/pages/InstitutionOrdersPage";
import InstitutionStatsPage from "@/institution/pages/InstitutionStatsPage";
import InstitutionMarketingPage from "@/institution/pages/InstitutionMarketingPage";
import InstitutionFinancePage from "@/institution/pages/InstitutionFinancePage";
import InstitutionReviewsPage from "@/institution/pages/InstitutionReviewsPage";
import DoctorLayout from "@/doctor/DoctorLayout";
import DoctorActivationPage from "@/doctor/pages/DoctorActivationPage";
import DoctorLoginPage from "@/doctor/pages/DoctorLoginPage";
import DoctorProfileCompletionPage from "@/doctor/pages/DoctorProfileCompletionPage";
import DoctorOrdersPage from "@/doctor/pages/DoctorOrdersPage";
import DoctorSchedulePage from "@/doctor/pages/DoctorSchedulePage";
import DoctorReviewsPage from "@/doctor/pages/DoctorReviewsPage";
import DoctorEarningsPage from "@/doctor/pages/DoctorEarningsPage";
import DoctorProfilePage from "@/doctor/pages/DoctorProfilePage";
import DoctorServiceSettingsPage from "@/doctor/pages/DoctorServiceSettingsPage";
import DoctorClinicOrderDetailPage from "@/doctor/pages/DoctorClinicOrderDetailPage";
import DoctorConsultOrderDetailPage from "@/doctor/pages/DoctorConsultOrderDetailPage";
import DoctorConsultChatPage from "@/doctor/pages/DoctorConsultChatPage";
import DoctorVideoConsultPage from "@/doctor/pages/DoctorVideoConsultPage";
import DoctorDiagnosisReportPage from "@/doctor/pages/DoctorDiagnosisReportPage";
import DoctorPersonalInfoPage from "@/doctor/pages/DoctorPersonalInfoPage";
import DoctorAccountSecurityPage from "@/doctor/pages/DoctorAccountSecurityPage";
import DoctorOrderHistoryPage from "@/doctor/pages/DoctorOrderHistoryPage";
import DoctorSupportPage from "@/doctor/pages/DoctorSupportPage";
import DoctorSettingsPage from "@/doctor/pages/DoctorSettingsPage";
import { DoctorProvider } from "@/doctor/context/DoctorContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <FavoritesProvider>
        <BookingProvider>
          <OrdersProvider>
            <ConsultationProvider>
              <CouponProvider>
                <ReferralProvider>
                  <InstitutionProvider>
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
                        <Route path="/consultation/success" element={<ConsultationSuccessPage />} />

                        {/* Consultation chat & video (full screen) */}
                        <Route path="/consultation/chat/:orderId" element={<ConsultationChatPage />} />
                        <Route path="/consultation/video/:orderId" element={<VideoConsultationPage />} />

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
                          <Route path="/referral/records" element={<ReferralRecordsPage />} />
                          <Route path="/saved-institutions" element={<SavedInstitutionsPage />} />

                          {/* Personal Center */}
                          <Route path="/personal-info" element={<PersonalInfoPage />} />
                          <Route path="/account-security" element={<AccountSecurityPage />} />
                          <Route path="/account/change-password" element={<ChangePasswordPage />} />
                          <Route path="/account/change-mobile" element={<ChangeMobilePage />} />
                          <Route path="/account/change-email" element={<ChangeEmailPage />} />
                          <Route path="/account/devices" element={<LoginDevicesPage />} />
                          <Route path="/my-favorites" element={<MyFavoritesPage />} />
                          <Route path="/my-reviews" element={<MyReviewsPage />} />
                          <Route path="/customer-service" element={<CustomerServicePage />} />
                          <Route path="/customer-service/faq" element={<FAQPage />} />
                          <Route path="/customer-service/complaint" element={<ComplaintPage />} />
                          <Route path="/settings" element={<SettingsPage />} />
                          <Route path="/settings/privacy-policy" element={<PrivacyPolicyPage />} />
                          <Route path="/settings/user-agreement" element={<UserAgreementPage />} />

                          {/* In-clinic booking flow */}
                          <Route path="/booking/services/:id" element={<ServiceListPage />} />
                          <Route path="/booking/service-detail/:instId/:svcId" element={<ServiceDetailPage />} />
                          <Route path="/booking/doctors/:instId/:svcId" element={<DoctorListPage />} />
                          <Route path="/booking/doctor-detail/:instId/:svcId/:docId" element={<DoctorDetailPage />} />
                          <Route path="/booking/time/:instId/:svcId/:docId" element={<TimeSlotPage />} />
                          <Route path="/booking/confirm/:instId/:svcId/:docId" element={<BookingConfirmPage />} />
                          <Route path="/booking/payment/:instId/:svcId/:docId" element={<PaymentPage />} />

                          {/* In-clinic orders */}
                          <Route path="/order/:orderId" element={<OrderDetailPage />} />
                          <Route path="/order/:orderId/cancel" element={<CancelOrderPage />} />
                          <Route path="/order/:orderId/review" element={<ReviewPage />} />

                          {/* Online consultation flow */}
                          <Route path="/consultation/doctors" element={<OnlineDoctorListPage />} />
                          <Route path="/consultation/doctor/:docId" element={<OnlineDoctorDetailPage />} />
                          <Route path="/consultation/request/:docId" element={<ConsultationRequestPage />} />
                          <Route path="/consultation/confirm/:docId" element={<ConsultationConfirmPage />} />
                          <Route path="/consultation/payment/:docId" element={<ConsultationPaymentPage />} />
                          <Route path="/consultation/order/:orderId" element={<ConsultationOrderDetailPage />} />
                          <Route path="/consultation/order/:orderId/review" element={<ConsultationReviewPage />} />

                          {/* Reports */}
                          <Route path="/report/:reportId" element={<ReportDetailPage />} />
                          <Route path="/ai-triage" element={<AiTriagePage />} />
                        </Route>

                        {/* Institution PC Backend */}
                        <Route path="/institution" element={<InstitutionLayout />}>
                          <Route path="register" element={<InstitutionRegisterPage />} />
                          <Route path="credentials" element={<InstitutionCredentialsPage />} />
                          <Route path="dashboard" element={<InstitutionDashboardPage />} />
                          <Route path="info" element={<InstitutionInfoPage />} />
                          <Route path="services" element={<InstitutionServicesPage />} />
                          <Route path="doctors" element={<InstitutionDoctorsPage />} />
                          <Route path="orders" element={<InstitutionOrdersPage />} />
                          <Route path="stats" element={<InstitutionStatsPage />} />
                          <Route path="marketing" element={<InstitutionMarketingPage />} />
                          <Route path="finance" element={<InstitutionFinancePage />} />
                          <Route path="reviews" element={<InstitutionReviewsPage />} />
                        </Route>

                        {/* Dentist App */}
                        <Route path="/doctor/activation" element={<DoctorActivationPage />} />
                        <Route path="/doctor/login" element={<DoctorLoginPage />} />
                        <Route path="/doctor/profile-completion" element={<DoctorProvider><DoctorProfileCompletionPage /></DoctorProvider>} />
                        <Route path="/doctor/consult/:orderId/chat" element={<DoctorProvider><DoctorConsultChatPage /></DoctorProvider>} />
                        <Route path="/doctor/consult/:orderId/video" element={<DoctorProvider><DoctorVideoConsultPage /></DoctorProvider>} />
                        <Route path="/doctor/consult/:orderId/report" element={<DoctorProvider><DoctorDiagnosisReportPage /></DoctorProvider>} />
                        <Route element={<DoctorProvider><DoctorLayout /></DoctorProvider>}>
                          <Route path="/doctor/orders" element={<DoctorOrdersPage />} />
                          <Route path="/doctor/orders/clinic/:orderId" element={<DoctorClinicOrderDetailPage />} />
                          <Route path="/doctor/orders/consult/:orderId" element={<DoctorConsultOrderDetailPage />} />
                          <Route path="/doctor/schedule" element={<DoctorSchedulePage />} />
                          <Route path="/doctor/reviews" element={<DoctorReviewsPage />} />
                          <Route path="/doctor/earnings" element={<DoctorEarningsPage />} />
                          <Route path="/doctor/profile" element={<DoctorProfilePage />} />
                          <Route path="/doctor/personal-info" element={<DoctorPersonalInfoPage />} />
                          <Route path="/doctor/account-security" element={<DoctorAccountSecurityPage />} />
                          <Route path="/doctor/order-history" element={<DoctorOrderHistoryPage />} />
                          <Route path="/doctor/support" element={<DoctorSupportPage />} />
                          <Route path="/doctor/settings" element={<DoctorSettingsPage />} />
                          <Route path="/doctor/service-settings" element={<DoctorServiceSettingsPage />} />
                        </Route>

                        <Route path="*" element={<NotFound />} />
                      </Routes>
                    </BrowserRouter>
                  </TooltipProvider>
                  </InstitutionProvider>
                </ReferralProvider>
              </CouponProvider>
            </ConsultationProvider>
          </OrdersProvider>
        </BookingProvider>
      </FavoritesProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
