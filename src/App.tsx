import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Profile from "@/pages/Profile";
import Messages from "@/pages/Messages";
import Friends from "@/pages/Friends";
import ExploreRestaurants from "@/pages/ExploreRestaurants";
import RestaurantDetails from "@/pages/RestaurantDetails";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/profile/:id?" element={<Profile />} />
        <Route path="/messages" element={<Messages />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/explore" element={<ExploreRestaurants />} />
        <Route path="/restaurant/:id" element={<RestaurantDetails />} />
      </Routes>
      <Toaster />
    </Router>
  );
}

export default App;