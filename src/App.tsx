import React, { lazy, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { PageLoader } from "@/components/LoadingStates";
import { SkipLink } from "@/components/SkipLink";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import { UndoBanner } from "@/components/UndoBanner";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { PresenceTracker } from "@/components/PresenceTracker";
import { LiveUpdateStream } from "@/components/LiveUpdateStream";
import { SyncStatus } from "@/components/SyncStatus";
import { InstallBanner } from "@/components/InstallBanner";
import { PerformanceDebug } from "@/components/PerformanceDebug";
import { usePerformanceMonitor } from "@/hooks/usePerformanceMonitor";
import { useAuth } from "@/store/auth";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { MatchFlowGuard } from "@/components/match/MatchFlowGuard";
import { MatchBottomNav } from "@/components/match/MatchBottomNav";
import Header from "@/components/Header";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const Browse = lazy(() => import("./pages/Browse"));
const Chat = lazy(() => import("./pages/Chat"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Reset = lazy(() => import("./pages/auth/Reset"));
const Saved = lazy(() => import("./pages/account/Saved"));
const Listings = lazy(() => import("./pages/account/Listings"));
const Settings = lazy(() => import("./pages/account/Settings"));
const Payouts = lazy(() => import("./pages/account/Payouts"));
const ForumsBoards = lazy(() => import("./pages/forums/Boards"));
const BoardTopics = lazy(() => import("./pages/forums/BoardTopics"));
const TopicView = lazy(() => import("./pages/forums/TopicView"));
const MentorHome = lazy(() => import("./pages/mentor/MentorHome"));
const MentorProfile = lazy(() => import("./pages/mentor/MentorProfile"));
const MySessions = lazy(() => import("./pages/mentor/MySessions"));
const MentorList = lazy(() => import("./pages/mentor/MentorList"));
const MentorOnboarding = lazy(() => import("./pages/mentor/MentorOnboarding"));
const MentorDetail = lazy(() => import("./pages/mentor/MentorDetail"));
const MentorDashboard = lazy(() => import("./pages/mentor/MentorDashboard"));
const MentorRequests = lazy(() => import("./pages/mentor/MentorRequests"));
const MyBookings = lazy(() => import("./pages/mentor/MyBookings"));
const BookingSuccess = lazy(() => import("./pages/mentor/BookingSuccess"));
const BookSession = lazy(() => import("./pages/mentor/BookSession")); // NEW IMPORT
const CommunityHome = lazy(() => import("./pages/community/CommunityHome"));
const Forums = lazy(() => import("./pages/community/Forums"));
const Events = lazy(() => import("./pages/community/Events"));
const Groups = lazy(() => import("./pages/community/Groups"));
const MentorPayouts = lazy(() => import("./pages/mentor/MentorPayouts"));
const VerifyProfile = lazy(() => import("./pages/mentor/VerifyProfile"));
const ManageAvailability = lazy(() => import("./pages/mentor/ManageAvailability"));
const VerificationReview = lazy(() => import("./pages/admin/VerificationReview"));
const BadgesInfo = lazy(() => import("./pages/BadgesInfo"));
const AdminMetrics = lazy(() => import("./pages/admin/Metrics"));
const AdminUsers = lazy(() => import("./pages/admin/Users"));
const AdminReports = lazy(() => import("./pages/admin/Reports"));
const AdminContent = lazy(() => import("./pages/admin/Content"));
const AdminAnalytics = lazy(() => import("./pages/admin/Analytics"));
const MatchHome = lazy(() => import("./pages/match/MatchHome"));
const MatchOnboarding = lazy(() => import("./pages/match/MatchOnboarding"));
const MatchDiscover = lazy(() => import("./pages/match/MatchDiscover"));
const MatchProfile = lazy(() => import("./pages/match/MatchProfile"));
const MatchList = lazy(() => import("./pages/match/MatchList"));
const MatchFamilyMode = lazy(() => import("./pages/match/MatchFamilyMode"));
const MatchQuiz = lazy(() => import("./pages/match/MatchQuiz"));
const MatchSuccess = lazy(() => import("./pages/match/MatchSuccess"));
const MatchDates = lazy(() => import("./pages/match/MatchDates"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));
const MarketplaceHome = lazy(() => import("./pages/marketplace/MarketplaceHome"));
const CreateListing = lazy(() => import("./pages/marketplace/CreateListing"));
const MarketplaceDetail = lazy(() => import("./pages/marketplace/MarketplaceDetail"));
const MyListings = lazy(() => import("./pages/marketplace/MyListings"));
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const AdminSeed = lazy(() => import("./pages/admin/Seed"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const DonateSuccess = lazy(() => import("./pages/donate/Success"));
const DonateCancel = lazy(() => import("./pages/donate/Cancel"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const Profile = lazy(() => import("./pages/dashboard/Profile"));
const DashboardSettings = lazy(() => import("./pages/dashboard/Settings"));
const VideoCall = lazy(() => import("./pages/video/VideoCall"));
const PaymentCheckout = lazy(() => import("./pages/payment/PaymentCheckout"));
const BillingHistory = lazy(() => import("./pages/payment/BillingHistory"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Component to conditionally show header
const HeaderWrapper = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/auth/login', '/auth/register', '/auth/reset', '/auth/callback'];
  const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));
  
  if (shouldHideHeader) return null;
  return <Header />;
};

const App = () => {
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const { undoLastAction, redoLastAction, canUndo, canRedo } = useUndoableAction();
  const { user } = useAuth();
  useServiceWorker();
  usePerformanceMonitor();

  // Ctrl+Z to undo
  useKeyboardShortcut('z', () => {
    if (canUndo) {
      undoLastAction();
    }
  }, { ctrl: true });

  // Ctrl+Y or Ctrl+Shift+Z to redo
  useKeyboardShortcut('y', () => {
    if (canRedo) {
      redoLastAction();
    }
  }, { ctrl: true });

  useKeyboardShortcut('z', () => {
    if (canRedo) {
      redoLastAction();
    }
  }, { ctrl: true, shift: true });

  return (
    <ErrorBoundary>
      <SkipLink />
      <ConnectionStatus />
      <PresenceTracker />
      {user && <SyncStatus />}
      <InstallBanner />
      <PerformanceDebug />
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <UndoBanner
            canUndo={canUndo}
            canRedo={canRedo}
            onUndo={undoLastAction}
            onRedo={redoLastAction}
            onDismiss={() => setShowUndoBanner(false)}
          />
          <BrowserRouter>
            {user && <LiveUpdateStream />}
            <HeaderWrapper />
            <Suspense fallback={<PageLoader />}>
              <Routes>
                {/* Main Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/l/:id" element={<ListingDetail />} />
                
                {/* Auth Routes */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/reset" element={<Reset />} />
                
                {/* Account Routes */}
                <Route path="/account/saved" element={<Saved />} />
                <Route path="/account/listings" element={<Listings />} />
                <Route path="/account/settings" element={<Settings />} />
                <Route path="/account/payouts" element={<Payouts />} />
                
                {/* Dashboard Routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/profile" element={<Profile />} />
                <Route path="/dashboard/settings" element={<DashboardSettings />} />
                
                {/* Forums Routes */}
                <Route path="/forums" element={<ForumsBoards />} />
                <Route path="/forums/:boardKey" element={<BoardTopics />} />
                <Route path="/forums/topic/:id" element={<TopicView />} />
                
                {/* Mentor Routes */}
                <Route path="/mentor" element={<MentorHome />} />
                <Route path="/mentor/list" element={<MentorList />} />
                <Route path="/mentor/profile/:id" element={<MentorProfile />} />
                <Route path="/mentor/sessions" element={<MySessions />} />
                <Route path="/mentor/onboarding" element={<MentorOnboarding />} />
                <Route path="/mentor/dashboard" element={<MentorDashboard />} />
                <Route path="/mentor/requests" element={<MentorRequests />} />
                <Route path="/mentor/bookings" element={<MyBookings />} />
                <Route path="/mentor/booking-success" element={<BookingSuccess />} />
                <Route path="/mentor/payouts" element={<MentorPayouts />} />
                <Route path="/mentor/verify" element={<VerifyProfile />} />
                <Route path="/mentor/availability" element={<ManageAvailability />} />
                <Route path="/mentor/:id" element={<MentorDetail />} />
                <Route path="/mentor/:id/book" element={<BookSession />} /> {/* NEW ROUTE */}
                
                {/* Badges */}
                <Route path="/badges" element={<BadgesInfo />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/verifications" element={<VerificationReview />} />
                <Route path="/admin/metrics" element={<AdminMetrics />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/seed" element={<AdminSeed />} />
                
                {/* Match Routes - Protected with Flow Guard */}
                <Route path="/match/*" element={
                  <MatchFlowGuard>
                    <>
                      <Routes>
                        <Route path="" element={<MatchHome />} />
                        <Route path="home" element={<MatchHome />} />
                        <Route path="onboarding" element={<MatchOnboarding />} />
                        <Route path="quiz" element={<MatchQuiz />} />
                        <Route path="discover" element={<MatchDiscover />} />
                        <Route path="matches" element={<MatchList />} />
                        <Route path="profile/:id" element={<MatchProfile />} />
                        <Route path="family-mode/:id" element={<MatchFamilyMode />} />
                        <Route path="success" element={<MatchSuccess />} />
                        <Route path="dates" element={<MatchDates />} />
                      </Routes>
                      <MatchBottomNav />
                    </>
                  </MatchFlowGuard>
                } />
                
                {/* Marketplace Routes */}
                <Route path="/market" element={<Marketplace />} />
                <Route path="/market/:id" element={<MarketplaceDetail />} />
                <Route path="/marketplace" element={<MarketplaceHome />} />
                <Route path="/marketplace/create" element={<CreateListing />} />
                <Route path="/marketplace/my-listings" element={<MyListings />} />
                <Route path="/marketplace/:type/:id" element={<ListingDetail />} />
                <Route path="/marketplace/products" element={<MarketplaceHome />} />
                <Route path="/marketplace/housing" element={<MarketplaceHome />} />
                <Route path="/marketplace/jobs" element={<MarketplaceHome />} />
                <Route path="/marketplace/services" element={<MarketplaceHome />} />
                
                {/* Community Routes */}
                <Route path="/community" element={<CommunityHome />} />
                <Route path="/community/forums" element={<Forums />} />
                <Route path="/community/events" element={<Events />} />
                <Route path="/community/groups" element={<Groups />} />
                
                {/* Messaging & Video */}
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/video/:id" element={<VideoCall />} />
                
                {/* Payment Routes */}
                <Route path="/payment/checkout" element={<PaymentCheckout />} />
                <Route path="/payment/billing" element={<BillingHistory />} />
                
                {/* Donation Routes */}
                <Route path="/donate/success" element={<DonateSuccess />} />
                <Route path="/donate/cancel" element={<DonateCancel />} />
                
                {/* Notifications */}
                <Route path="/notifications" element={<Notifications />} />
                
                {/* 404 Catch-all - MUST BE LAST */}
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
```

