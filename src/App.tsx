import React from 'react';
import { BrowserRouter, Routes, Route, ScrollRestoration } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Pages
import { HomePage } from './pages/HomePage';
import { EventsPage } from './pages/EventsPage';
import { EventDetailsPage } from './pages/EventDetailsPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { BookingSuccessPage } from './pages/BookingSuccessPage';

// Auth Pages
import { LoginPage } from './pages/Auth/LoginPage';
import { RegisterPage } from './pages/Auth/RegisterPage';
import { OtpVerificationPage } from './pages/Auth/OtpVerificationPage';
import { ForgotPasswordPage } from './pages/Auth/ForgotPasswordPage';

// Dashboards
import { CustomerDashboard } from './pages/Dashboard/CustomerDashboard';
import { OrganizerDashboard } from './pages/Dashboard/OrganizerDashboard';
import { EventCreateEditPage } from './pages/Dashboard/EventCreateEditPage';
import { AdminDashboard } from './pages/Dashboard/AdminDashboard';

// Static
import { AboutPage } from './pages/Static/AboutPage';
import { ContactPage } from './pages/Static/ContactPage';
import { FaqPage } from './pages/Static/FaqPage';
import { TermsPage } from './pages/Static/TermsPage';
import { PrivacyPage } from './pages/Static/PrivacyPage';
import { NotFoundPage } from './pages/Static/NotFoundPage';

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="flex flex-col min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-purple-600 selection:text-white">
              <Navbar />

              <main className="flex-1">
                <Routes>
                  {/* Public Pages */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/events" element={<EventsPage />} />
                  <Route path="/events/:id" element={<EventDetailsPage />} />
                  <Route path="/checkout/:eventId" element={<CheckoutPage />} />
                  <Route path="/booking/success/:bookingId" element={<BookingSuccessPage />} />

                  {/* Auth */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/verify-otp" element={<OtpVerificationPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />

                  {/* Customer Dashboard */}
                  <Route
                    path="/dashboard/customer"
                    element={
                      <ProtectedRoute allowedRoles={['customer', 'organizer', 'admin']}>
                        <CustomerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Organizer Dashboard */}
                  <Route
                    path="/dashboard/organizer"
                    element={
                      <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                        <OrganizerDashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/organizer/events/new"
                    element={
                      <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                        <EventCreateEditPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/organizer/events/edit/:id"
                    element={
                      <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                        <EventCreateEditPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/dashboard/organizer/check-in"
                    element={
                      <ProtectedRoute allowedRoles={['organizer', 'admin']}>
                        <OrganizerDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Admin Dashboard */}
                  <Route
                    path="/dashboard/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  />

                  {/* Static Info Pages */}
                  <Route path="/about" element={<AboutPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/faq" element={<FaqPage />} />
                  <Route path="/terms" element={<TermsPage />} />
                  <Route path="/privacy" element={<PrivacyPage />} />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              <Footer />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
