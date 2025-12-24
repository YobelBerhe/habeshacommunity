import React, { lazy, Suspense, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
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
import BootstrapAuth from "@/components/BootstrapAuth";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const Home = lazy(() => import("./pages/Home"));
const Hub = lazy(() => import("./pages/Hub"));
const ManageCategories = lazy(() => import("./pages/hub/ManageCategories"));

// Onboarding pages
const OnboardingWelcome = lazy(() => import("./pages/onboarding/Welcome"));
const OnboardingInterests = lazy(() => import("./pages/onboarding/Interests"));
const OnboardingPersonal = lazy(() => import("./pages/onboarding/PersonalInfo"));
const SpiritualLayout = lazy(() => import("./pages/spiritual/SpiritualLayout"));
const SpiritualHome = lazy(() => import("./pages/spiritual/SpiritualHome"));
const SpiritualToday = lazy(() => import("./pages/spiritual/Today"));
const SpiritualMore = lazy(() => import("./pages/spiritual/More"));
const BibleReader = lazy(() => import("./pages/spiritual/BibleReader"));
const ReadingPlans = lazy(() => import("./pages/spiritual/ReadingPlans"));
const SpiritualProgress = lazy(() => import("./pages/spiritual/Progress"));
const VerseOfTheDayPage = lazy(() => import("./pages/spiritual/VerseOfTheDay"));
const PlanDetail = lazy(() => import("./pages/spiritual/PlanDetail"));
const BookmarksPage = lazy(() => import("./pages/spiritual/Bookmarks"));
const HighlightsPage = lazy(() => import("./pages/spiritual/Highlights"));
const PrayerRequests = lazy(() => import("./pages/spiritual/PrayerRequests"));
const DailyPrayers = lazy(() => import("./pages/spiritual/DailyPrayers"));
const FastingCalendar = lazy(() => import("./pages/spiritual/FastingCalendar"));
const SaintsCalendar = lazy(() => import("./pages/spiritual/SaintsCalendar"));
const Browse = lazy(() => import("./pages/Browse"));
const SearchResults = lazy(() => import("./pages/SearchResults"));
const Chat = lazy(() => import("./pages/Chat"));
const AuthCallback = lazy(() => import("./pages/AuthCallback"));
const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Reset = lazy(() => import("./pages/auth/Reset"));
const VerifyPhone = lazy(() => import("./pages/auth/VerifyPhone"));
const Saved = lazy(() => import("./pages/account/Saved"));
const Listings = lazy(() => import("./pages/account/Listings"));
const Settings = lazy(() => import("./pages/account/Settings"));
const Payouts = lazy(() => import("./pages/account/Payouts"));
const ForumsBoards = lazy(() => import("./pages/forums/Boards"));
const BoardTopics = lazy(() => import("./pages/forums/BoardTopics"));
const TopicView = lazy(() => import("./pages/forums/TopicView"));
const MentorLayout = lazy(() => import("./pages/mentor/MentorLayout"));
const MentorHome = lazy(() => import("./pages/mentor/MentorHome"));
const MentorProfile = lazy(() => import("./pages/mentor/MentorProfile"));
const MySessions = lazy(() => import("./pages/mentor/MySessions"));
const MentorList = lazy(() => import("./pages/mentor/MentorList"));
const BrowseMentors = lazy(() => import("./pages/mentor/BrowseMentors"));
const SessionsPage = lazy(() => import("./pages/mentor/SessionsPage"));
const BecomeMentor = lazy(() => import("./pages/mentor/BecomeMentor"));
const MentorMore = lazy(() => import("./pages/mentor/MentorMore"));
const MentorOnboarding = lazy(() => import("./pages/mentor/MentorOnboarding"));
const MentorDetail = lazy(() => import("./pages/mentor/MentorDetail"));
const MentorDashboard = lazy(() => import("./pages/mentor/MentorDashboard"));
const MentorRequests = lazy(() => import("./pages/mentor/MentorRequests"));
const MyBookings = lazy(() => import("./pages/mentor/MyBookings"));
const BookingSuccess = lazy(() => import("./pages/mentor/BookingSuccess"));
const BookSession = lazy(() => import("./pages/mentor/BookSession")); // NEW IMPORT
const CommunityLayout = lazy(() => import("./pages/community/CommunityLayout"));
const CommunityHome = lazy(() => import("./pages/community/CommunityHome"));
const EventsPage = lazy(() => import("./pages/community/EventsPage"));
const GroupsPage = lazy(() => import("./pages/community/GroupsPage"));
const CommunityMore = lazy(() => import("./pages/community/CommunityMore"));
const Forums = lazy(() => import("./pages/community/Forums"));
const ForumsNew = lazy(() => import("./pages/community/ForumsNew"));
const BibleGroups = lazy(() => import("./pages/community/BibleGroups"));
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
const MatchLayout = lazy(() => import("./pages/match/MatchLayout"));
const MatchHome = lazy(() => import("./pages/match/MatchHome"));
const MatchOnboarding = lazy(() => import("./pages/match/MatchOnboarding"));
const MatchDiscover = lazy(() => import("./pages/match/Discover"));
const MatchProfile = lazy(() => import("./pages/match/MatchProfile"));
const MatchesList = lazy(() => import("./pages/match/MatchesList"));
const MatchLiked = lazy(() => import("./pages/match/Liked"));
const MatchMore = lazy(() => import("./pages/match/MatchMore"));
const MatchFamilyMode = lazy(() => import("./pages/match/MatchFamilyMode"));
const MatchQuiz = lazy(() => import("./pages/match/MatchQuiz"));
const MatchSuccess = lazy(() => import("./pages/match/MatchSuccess"));
const MatchDates = lazy(() => import("./pages/match/MatchDates"));
const Marketplace = lazy(() => import("./pages/marketplace/Marketplace"));
const MarketplaceHome = lazy(() => import("./pages/marketplace/MarketplaceHome"));
const MarketplaceLayout = lazy(() => import("./pages/marketplace/MarketplaceLayout"));
const BrowseMarketplace = lazy(() => import("./pages/marketplace/BrowseMarketplace"));
const SellingPage = lazy(() => import("./pages/marketplace/SellingPage"));
const SavedListings = lazy(() => import("./pages/marketplace/SavedListings"));
const MarketplaceMore = lazy(() => import("./pages/marketplace/MarketplaceMore"));
const CreateListing = lazy(() => import("./pages/marketplace/CreateListing"));
const MarketplaceDetail = lazy(() => import("./pages/marketplace/MarketplaceDetail"));
const MyListings = lazy(() => import("./pages/marketplace/MyListings"));
const Inbox = lazy(() => import("./pages/inbox/Inbox"));
const AdminSeed = lazy(() => import("./pages/admin/Seed"));
const AdminDashboard = lazy(() => import("./pages/admin/Dashboard"));
const AuditLogs = lazy(() => import("./pages/admin/AuditLogs"));
const DisputeResolution = lazy(() => import("./pages/admin/DisputeResolution"));
const RoleManagement = lazy(() => import("./pages/admin/RoleManagement"));
const SessionRoom = lazy(() => import("./pages/mentor/SessionRoom"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));
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
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const ChurchHome = lazy(() => import("./pages/church/ChurchHome"));
const ChurchList = lazy(() => import("./pages/church/ChurchList"));
const ChurchDetail = lazy(() => import("./pages/church/ChurchDetail"));
const GamificationDashboard = lazy(() => import("./pages/gamification/Dashboard"));
const HealthHome = lazy(() => import("./pages/health/HealthHome"));
const FastingPage = lazy(() => import("./pages/health/Fasting"));
const NutritionPage = lazy(() => import("./pages/health/Nutrition"));
const FitnessPage = lazy(() => import("./pages/health/Fitness"));
const HealthDashboard = lazy(() => import("./pages/health/Dashboard"));
const HealthDashboardMain = lazy(() => import("./pages/health/HealthDashboard"));
const SelectFastingPlan = lazy(() => import("./pages/health/fasting/SelectFastingPlan"));
const FastingTrackerLive = lazy(() => import("./pages/health/fasting/FastingTrackerLive"));
const WeightProgress = lazy(() => import("./pages/health/fasting/WeightProgress"));
const Hydration = lazy(() => import("./pages/health/Hydration"));
const SleepTracker = lazy(() => import("./pages/health/Sleep"));
const FoodLog = lazy(() => import("./pages/health/nutrition/FoodLog"));
const Recipes = lazy(() => import("./pages/health/nutrition/Recipes"));
const ShoppingList = lazy(() => import("./pages/health/nutrition/ShoppingList"));
const Mental = lazy(() => import("./pages/health/Mental"));
const NutritionSimple = lazy(() => import("./pages/health/NutritionSimple"));
const FitnessSimple = lazy(() => import("./pages/health/FitnessSimple"));
const Exercise = lazy(() => import("./pages/health/fitness/Exercise"));
const ExerciseLibrary = lazy(() => import("./pages/health/fitness/ExerciseLibrary"));
const LogWorkout = lazy(() => import("./pages/health/fitness/LogWorkout"));
const TrainWorkout = lazy(() => import("./pages/health/fitness/Train"));
const WorkoutInProgressPage = lazy(() => import("./pages/health/fitness/WorkoutInProgress"));
const EventsList = lazy(() => import('./pages/community/EventsList'));
const EventDetail = lazy(() => import('./pages/community/EventDetail'));
const CreateEvent = lazy(() => import('./pages/community/CreateEvent'));
const EventsDiscover = lazy(() => import('./pages/community/EventsDiscover'));
const Calendars = lazy(() => import('./pages/community/Calendars'));

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
  const hideHeaderRoutes = ['/auth/login', '/auth/register', '/auth/reset', '/auth/callback', '/onboarding', '/hub', '/spiritual', '/match', '/mentor', '/marketplace', '/community'];
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
      <BootstrapAuth />
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
                {/* Onboarding Routes */}
                <Route path="/onboarding/welcome" element={<OnboardingWelcome />} />
                <Route path="/onboarding/interests" element={<OnboardingInterests />} />
                <Route path="/onboarding/personal" element={<OnboardingPersonal />} />
                
                {/* Hub Routes */}
                <Route path="/hub" element={<Hub />} />
                <Route path="/hub/manage-categories" element={<ManageCategories />} />
                
                {/* Main Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<Home />} />
                <Route path="/index" element={<Index />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/search" element={<SearchResults />} />
                <Route path="/chat" element={<Chat />} />
                <Route path="/l/:id" element={<ListingDetail />} />
                
                {/* Spiritual Routes - Nested with Layout */}
                <Route path="/spiritual" element={<SpiritualLayout />}>
                  <Route index element={<Navigate to="/spiritual/today" replace />} />
                  <Route path="today" element={<SpiritualToday />} />
                  <Route path="bible" element={<BibleReader />} />
                  <Route path="plans" element={<ReadingPlans />} />
                  <Route path="plans/:slug" element={<PlanDetail />} />
                  <Route path="more" element={<SpiritualMore />} />
                  <Route path="verse-of-the-day" element={<VerseOfTheDayPage />} />
                  <Route path="bookmarks" element={<BookmarksPage />} />
                  <Route path="highlights" element={<HighlightsPage />} />
                  <Route path="progress" element={<SpiritualProgress />} />
                  <Route path="prayer-requests" element={<PrayerRequests />} />
                  <Route path="daily-prayers" element={<DailyPrayers />} />
                  <Route path="fasting-calendar" element={<FastingCalendar />} />
                  <Route path="saints-calendar" element={<SaintsCalendar />} />
                </Route>
                
                {/* Auth Routes */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/auth/login" element={<Login />} />
                <Route path="/auth/register" element={<Register />} />
                <Route path="/auth/reset" element={<Reset />} />
                <Route path="/auth/verify-phone" element={<VerifyPhone />} />
                
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
                
                {/* Mentor Routes - Nested with Layout */}
                <Route path="/mentor" element={<MentorLayout />}>
                  <Route index element={<Navigate to="/mentor/browse" replace />} />
                  <Route path="browse" element={<BrowseMentors />} />
                  <Route path="sessions" element={<SessionsPage />} />
                  <Route path="become" element={<BecomeMentor />} />
                  <Route path="more" element={<MentorMore />} />
                  <Route path="list" element={<MentorList />} />
                  <Route path="profile/:id" element={<MentorProfile />} />
                  <Route path="book/:id" element={<BookSession />} />
                  <Route path="onboarding" element={<MentorOnboarding />} />
                  <Route path="dashboard" element={<MentorDashboard />} />
                  <Route path="requests" element={<MentorRequests />} />
                  <Route path="bookings" element={<MyBookings />} />
                  <Route path="booking-success" element={<BookingSuccess />} />
                  <Route path="payouts" element={<MentorPayouts />} />
                  <Route path="verify" element={<VerifyProfile />} />
                  <Route path="availability" element={<ManageAvailability />} />
                  <Route path=":id" element={<MentorDetail />} />
                </Route>
                <Route path="/session/:sessionId" element={<SessionRoom />} />
                
                {/* Badges */}
                <Route path="/badges" element={<BadgesInfo />} />
                
                {/* Admin Routes */}
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/verifications" element={<VerificationReview />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/roles" element={<RoleManagement />} />
                <Route path="/admin/disputes" element={<DisputeResolution />} />
                <Route path="/admin/audit-logs" element={<AuditLogs />} />
                <Route path="/admin/metrics" element={<AdminMetrics />} />
                <Route path="/admin/reports" element={<AdminReports />} />
                <Route path="/admin/content" element={<AdminContent />} />
                <Route path="/admin/analytics" element={<AdminAnalytics />} />
                <Route path="/admin/seed" element={<AdminSeed />} />

              {/* Coming Soon fallback */}
              <Route path="/coming-soon" element={<ComingSoon />} />
              
              {/* Match Routes - Nested with Layout */}
              <Route path="/match" element={<MatchFlowGuard><MatchLayout /></MatchFlowGuard>}>
                <Route index element={<Navigate to="/match/discover" replace />} />
                <Route path="home" element={<MatchHome />} />
                <Route path="onboarding" element={<MatchOnboarding />} />
                <Route path="quiz" element={<MatchQuiz />} />
                <Route path="discover" element={<MatchDiscover />} />
                <Route path="matches" element={<MatchesList />} />
                <Route path="liked" element={<MatchLiked />} />
                <Route path="more" element={<MatchMore />} />
                <Route path="profile/:id" element={<MatchProfile />} />
                <Route path="family-mode" element={<MatchFamilyMode />} />
                <Route path="success" element={<MatchSuccess />} />
                <Route path="dates" element={<MatchDates />} />
              </Route>
                
                {/* Marketplace Routes - Nested with Layout */}
                <Route path="/marketplace" element={<MarketplaceLayout />}>
                  <Route index element={<Navigate to="/marketplace/browse" replace />} />
                  <Route path="browse" element={<BrowseMarketplace />} />
                  <Route path="selling" element={<SellingPage />} />
                  <Route path="saved" element={<SavedListings />} />
                  <Route path="more" element={<MarketplaceMore />} />
                  <Route path="create" element={<CreateListing />} />
                  <Route path="my-listings" element={<MyListings />} />
                  <Route path="listing/:id" element={<MarketplaceDetail />} />
                  <Route path=":type/:id" element={<ListingDetail />} />
                  <Route path="products" element={<BrowseMarketplace />} />
                  <Route path="housing" element={<BrowseMarketplace />} />
                  <Route path="jobs" element={<BrowseMarketplace />} />
                  <Route path="services" element={<BrowseMarketplace />} />
                </Route>
                <Route path="/market" element={<Marketplace />} />
                <Route path="/market/:id" element={<MarketplaceDetail />} />
                
                {/* Community Routes - Nested with Layout */}
                <Route path="/community" element={<CommunityLayout />}>
                  <Route index element={<Navigate to="/community/events" replace />} />
                  <Route path="events" element={<EventsPage />} />
                  <Route path="groups" element={<GroupsPage />} />
                  <Route path="forums" element={<Forums />} />
                  <Route path="more" element={<CommunityMore />} />
                  <Route path="events/create" element={<CreateEvent />} />
                  <Route path="events/:id" element={<EventDetail />} />
                  <Route path="events/discover" element={<EventsDiscover />} />
                  <Route path="calendars" element={<Calendars />} />
                  <Route path="groups/:id" element={<Groups />} />
                  <Route path="forums-new" element={<ForumsNew />} />
                  <Route path="bible-groups" element={<BibleGroups />} />
                  <Route path="my-events" element={<EventsList />} />
                  <Route path="my-groups" element={<Groups />} />
                </Route>
                
                {/* Church Finder Routes */}
                <Route path="/churches" element={<ChurchHome />} />
                <Route path="/churches/search" element={<ChurchList />} />
                <Route path="/churches/near-me" element={<ChurchList />} />
                <Route path="/churches/:slug" element={<ChurchDetail />} />
                
                {/* Gamification Route */}
                <Route path="/gamification" element={<GamificationDashboard />} />
                
                {/* Health Routes */}
                <Route path="/health" element={<HealthHome />} />
                <Route path="/health/dashboard" element={<HealthDashboard />} />
                <Route path="/health/fasting" element={<FastingPage />} />
                <Route path="/health/fasting/select" element={<SelectFastingPlan />} />
                <Route path="/health/fasting/tracker" element={<FastingTrackerLive />} />
                <Route path="/health/fasting/progress" element={<WeightProgress />} />
                <Route path="/health/nutrition" element={<NutritionPage />} />
                <Route path="/health/fitness" element={<Exercise />} />
                <Route path="/health/fitness/library" element={<ExerciseLibrary />} />
                <Route path="/health/fitness/log" element={<LogWorkout />} />
                <Route path="/health/fitness/train" element={<TrainWorkout />} />
                <Route path="/health/fitness/workout" element={<WorkoutInProgressPage />} />
                <Route path="/health/eat" element={<FoodLog />} />
                <Route path="/health/barcode-scanner" element={<ComingSoon />} />
                <Route path="/health/recipes" element={<Recipes />} />
                <Route path="/health/sleep" element={<SleepTracker />} />
                <Route path="/health/hydration" element={<Hydration />} />
                <Route path="/health/mental" element={<Mental />} />
                
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
                
                {/* Legal Pages */}
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                
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

