import { useState } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { SearchBar } from "@/components/restaurants/SearchBar";
import { ArrowRight, Star, MessageCircle } from "lucide-react";

const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "The Italian Place",
    cuisine: "Italian",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    priceRange: "$$",
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: "Japanese",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    priceRange: "$$$",
  },
  {
    id: 3,
    name: "Burger Heaven",
    cuisine: "American",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1565299543923-37dd37887442",
    priceRange: "$",
  },
];

const Index = () => {
  const [isAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = MOCK_RESTAURANTS.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-red-50 to-orange-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] opacity-5"></div>
        <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
          <div className="w-full max-w-md mb-12 animate-fade-in">
            <div className="text-center mb-6">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
                REVBD
              </h1>
              <p className="text-lg font-semibold text-gray-800">Create an account to start reviewing</p>
              <p className="text-sm text-gray-600 mt-2">Join our community of food enthusiasts</p>
            </div>
            <AuthForm />
          </div>
          
          <div className="text-center mb-8 animate-fade-in">
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your trusted platform for authentic restaurant reviews and ratings
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-in animation-delay-100">
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto rounded-full bg-red-100">
                <Star className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="font-semibold mb-2">Rate Restaurants</h3>
              <p className="text-gray-600 text-sm">Share your dining experiences</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-16 h-16 mb-4 mx-auto rounded-full bg-orange-100">
                <MessageCircle className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Write Reviews</h3>
              <p className="text-gray-600 text-sm">Help others discover great food</p>
            </div>
          </div>

          <div className="mt-12 text-center space-y-4 animate-fade-in animation-delay-300">
            <p className="text-gray-600">Browse trending restaurants below</p>
            <ArrowRight className="mx-auto text-red-500 animate-bounce" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4 animate-fade-in">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
            Discover Great Restaurants
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore and review the best dining spots in your area
          </p>
        </div>
        <div className="max-w-xl mx-auto animate-fade-in animation-delay-100">
          <SearchBar onSearch={setSearchQuery} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in animation-delay-200">
          {filteredRestaurants.map((restaurant) => (
            <RestaurantCard key={restaurant.id} {...restaurant} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
