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
import ForumsBoards from "./pages/forums/Boards";
import BoardTopics from "./pages/forums/BoardTopics";
import TopicView from "./pages/forums/TopicView";
import MentorList from "./pages/mentor/MentorList";
import MentorDetail from "./pages/mentor/MentorDetail";
import MentorRequests from "./pages/mentor/MentorRequests";
import MyBookings from "./pages/mentor/MyBookings";
import MatchOnboarding from "./pages/match/MatchOnboarding";
import MatchDiscover from "./pages/match/MatchDiscover";
import MatchProfile from "./pages/match/MatchProfile";
import Marketplace from "./pages/marketplace/Marketplace";
import MarketplaceDetail from "./pages/marketplace/MarketplaceDetail";
import Inbox from "./pages/inbox/Inbox";
import AdminSeed from "./pages/admin/Seed";
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
          <Route path="/forums" element={<ForumsBoards />} />
          <Route path="/forums/:boardKey" element={<BoardTopics />} />
          <Route path="/forums/topic/:id" element={<TopicView />} />
          <Route path="/mentor" element={<MentorList />} />
          <Route path="/mentor/:id" element={<MentorDetail />} />
          <Route path="/mentor/requests" element={<MentorRequests />} />
          <Route path="/mentor/bookings" element={<MyBookings />} />
          <Route path="/match" element={<MatchOnboarding />} />
          <Route path="/match/discover" element={<MatchDiscover />} />
          <Route path="/match/profile/:id" element={<MatchProfile />} />
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
