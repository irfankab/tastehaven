import { useState } from "react";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { SearchBar } from "@/components/restaurants/SearchBar";
import { ArrowRight } from "lucide-react";

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
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">
                  REVBD
                </h1>
              </div>

              {/* Search Bar */}
              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar onSearch={setSearchQuery} />
              </div>

              {/* Navigation */}
              <nav className="flex items-center space-x-4">
                <button className="hover:text-gray-200 transition-colors">Write a Review</button>
                <button className="hover:text-gray-200 transition-colors">Log In</button>
                <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Sign Up
                </button>
              </nav>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main>
          <div className="relative bg-gradient-to-br from-red-50 to-orange-50">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] opacity-5"></div>
            <div className="relative z-10 p-6">
              <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Popular Restaurants</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} {...restaurant} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
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