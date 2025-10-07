import React, { lazy, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLoader } from "@/components/LoadingStates";
import { SkipLink } from "@/components/SkipLink";
import { useKeyboardShortcut } from "@/hooks/useKeyboardShortcut";
import { useUndoableAction } from "@/hooks/useUndoableAction";
import { UndoBanner } from "@/components/UndoBanner";
import { ConnectionStatus } from "@/components/ConnectionStatus";
import { PresenceTracker } from "@/components/PresenceTracker";
import { LiveUpdateStream } from "@/components/LiveUpdateStream";
import { SyncStatus } from "@/components/SyncStatus";
import { useAuth } from "@/store/auth";
import { useServiceWorker } from "@/hooks/useServiceWorker";

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
const MentorList = lazy(() => import("./pages/mentor/MentorList"));
const MentorOnboarding = lazy(() => import("./pages/mentor/MentorOnboarding"));
const MentorDetail = lazy(() => import("./pages/mentor/MentorDetail"));
const MentorDashboard = lazy(() => import("./pages/mentor/MentorDashboard"));
const MentorRequests = lazy(() => import("./pages/mentor/MentorRequests"));
const MyBookings = lazy(() => import("./pages/mentor/MyBookings"));
const BookingSuccess = lazy(() => import("./pages/mentor/BookingSuccess"));
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
const MatchOnboarding = lazy(() => import("./pages/match/MatchOnboarding"));
const MatchDiscover = lazy(() => import("./pages/match/MatchDiscover"));
const MatchProfile = lazy(() => import("./pages/match/MatchProfile"));
const MatchList = lazy(() => import("./pages/match/MatchList"));
const MatchFamilyMode = lazy(() => import("./pages/match/MatchFamilyMode"));
const MatchQuiz = lazy(() => import("./pages/match/MatchQuiz"));
const MatchSuccess = lazy(() => import("./pages/match/MatchSuccess"));
const MatchDates = lazy(() => import("./pages/match/MatchDates"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));
const MarketplaceDetail = lazy(() => import("./pages/marketplace/MarketplaceDetail"));
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const AdminSeed = lazy(() => import("./pages/admin/Seed"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const DonateSuccess = lazy(() => import("./pages/donate/Success"));
const DonateCancel = lazy(() => import("./pages/donate/Cancel"));
const ListingDetail = lazy(() => import("./pages/ListingDetail"));
const Notifications = lazy(() => import("./pages/Notifications"));

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

const App = () => {
  const [showUndoBanner, setShowUndoBanner] = useState(false);
  const { undoLastAction, redoLastAction, canUndo, canRedo } = useUndoableAction();
  const { user } = useAuth();
  useServiceWorker();

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
            <Suspense fallback={<PageLoader />}>
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/l/:id" element={<ListingDetail />} />
              <Route path="/auth/callback" element={<AuthCallback />} />
              <Route path="/auth/login" element={<Login />} />
              <Route path="/auth/register" element={<Register />} />
              <Route path="/auth/reset" element={<Reset />} />
              <Route path="/account/saved" element={<Saved />} />
              <Route path="/account/listings" element={<Listings />} />
              <Route path="/account/settings" element={<Settings />} />
              <Route path="/account/payouts" element={<Payouts />} />
              <Route path="/forums" element={<ForumsBoards />} />
              <Route path="/forums/:boardKey" element={<BoardTopics />} />
              <Route path="/forums/topic/:id" element={<TopicView />} />
              <Route path="/mentor" element={<MentorList />} />
              <Route path="/mentor/onboarding" element={<MentorOnboarding />} />
              <Route path="/mentor/dashboard" element={<MentorDashboard />} />
              <Route path="/mentor/:id" element={<MentorDetail />} />
              <Route path="/mentor/requests" element={<MentorRequests />} />
              <Route path="/mentor/bookings" element={<MyBookings />} />
              <Route path="/mentor/booking-success" element={<BookingSuccess />} />
              <Route path="/mentor/payouts" element={<MentorPayouts />} />
              <Route path="/mentor/verify" element={<VerifyProfile />} />
              <Route path="/mentor/availability" element={<ManageAvailability />} />
              <Route path="/badges" element={<BadgesInfo />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/verifications" element={<VerificationReview />} />
              <Route path="/admin/metrics" element={<AdminMetrics />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/content" element={<AdminContent />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              <Route path="/match" element={<MatchDiscover />} />
              <Route path="/match/discover" element={<MatchDiscover />} />
              <Route path="/match/onboarding" element={<MatchOnboarding />} />
              <Route path="/match/profile/:id" element={<MatchProfile />} />
              <Route path="/match/matches" element={<MatchList />} />
              <Route path="/match/family-mode/:id" element={<MatchFamilyMode />} />
              <Route path="/match/quiz" element={<MatchQuiz />} />
              <Route path="/match/success" element={<MatchSuccess />} />
              <Route path="/match/dates" element={<MatchDates />} />
              <Route path="/market" element={<Marketplace />} />
              <Route path="/market/:id" element={<MarketplaceDetail />} />
              <Route path="/inbox" element={<Inbox />} />
              <Route path="/admin/seed" element={<AdminSeed />} />
              <Route path="/donate/success" element={<DonateSuccess />} />
              <Route path="/donate/cancel" element={<DonateCancel />} />
              <Route path="/notifications" element={<Notifications />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
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
