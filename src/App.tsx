import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import Chat from "./pages/Chat";
import AuthCallback from "./pages/AuthCallback";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import Saved from "./pages/account/Saved";
import Listings from "./pages/account/Listings";
import Settings from "./pages/account/Settings";
import Payouts from "./pages/account/Payouts";
import ForumsBoards from "./pages/forums/Boards";
import BoardTopics from "./pages/forums/BoardTopics";
import TopicView from "./pages/forums/TopicView";
import MentorList from "./pages/mentor/MentorList";
import MentorOnboarding from "./pages/mentor/MentorOnboarding";
import MentorDetail from "./pages/mentor/MentorDetail";
import MentorDashboard from "./pages/mentor/MentorDashboard";
import MentorRequests from "./pages/mentor/MentorRequests";
import MyBookings from "./pages/mentor/MyBookings";
import BookingSuccess from "./pages/mentor/BookingSuccess";
import MentorPayouts from "./pages/mentor/MentorPayouts";
import VerifyProfile from "./pages/mentor/VerifyProfile";
import ManageAvailability from "./pages/mentor/ManageAvailability";
import VerificationReview from "./pages/admin/VerificationReview";
import BadgesInfo from "./pages/BadgesInfo";
import AdminMetrics from "./pages/admin/Metrics";
import MatchOnboarding from "./pages/match/MatchOnboarding";
import MatchDiscover from "./pages/match/MatchDiscover";
import MatchProfile from "./pages/match/MatchProfile";
import MatchList from "./pages/match/MatchList";
import MatchFamilyMode from "./pages/match/MatchFamilyMode";
import MatchQuiz from "./pages/match/MatchQuiz";
import MatchSuccess from "./pages/match/MatchSuccess";
import MatchDates from "./pages/match/MatchDates";
import Marketplace from "./pages/marketplace/Marketplace";
import MarketplaceDetail from "./pages/marketplace/MarketplaceDetail";
import Inbox from "./pages/inbox/Inbox";
import AdminSeed from "./pages/admin/Seed";
import AdminDashboard from "./pages/admin/Dashboard";
import GlobalMap from "./components/GlobalMap";
import DonateSuccess from "./pages/donate/Success";
import DonateCancel from "./pages/donate/Cancel";
import ListingDetail from "./pages/ListingDetail";
import Notifications from "./pages/Notifications";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <GlobalMap modalOpen={false} />
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
