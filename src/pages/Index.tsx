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
    reviews: [
      {
        id: 1,
        userName: "John Doe",
        rating: 4.5,
        comment: "Amazing pasta and great service!",
        date: "2024-03-15"
      },
      {
        id: 2,
        userName: "Sarah Smith",
        rating: 4.0,
        comment: "Authentic Italian flavors, but a bit pricey.",
        date: "2024-03-10"
      }
    ]
  },
  {
    id: 2,
    name: "Sushi Master",
    cuisine: "Japanese",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    priceRange: "$$$",
    reviews: [
      {
        id: 3,
        userName: "Mike Johnson",
        rating: 5.0,
        comment: "Best sushi in town! Fresh and delicious.",
        date: "2024-03-14"
      },
      {
        id: 4,
        userName: "Emily Chen",
        rating: 4.5,
        comment: "Great variety and excellent presentation.",
        date: "2024-03-12"
      }
    ]
  },
  {
    id: 3,
    name: "Burger Heaven",
    cuisine: "American",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1565299543923-37dd37887442",
    priceRange: "$",
    reviews: [
      {
        id: 5,
        userName: "David Wilson",
        rating: 4.0,
        comment: "Juicy burgers and crispy fries!",
        date: "2024-03-13"
      },
      {
        id: 6,
        userName: "Lisa Brown",
        rating: 4.5,
        comment: "Great value for money, generous portions.",
        date: "2024-03-11"
      }
    ]
  }
];

const Index = () => {
  const [isAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = MOCK_RESTAURANTS.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50">
        <header className="relative">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center">
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white animate-fade-in tracking-tight">
                  REVBD
                </h1>
              </div>

              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar onSearch={setSearchQuery} />
              </div>

              <nav className="flex items-center space-x-4">
                <button className="text-white hover:text-gray-200 transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/10">
                  Write a Review
                </button>
                <button className="text-white hover:text-gray-200 transition-all duration-300 px-4 py-2 rounded-full hover:bg-white/10">
                  Log In
                </button>
                <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign Up
                </button>
              </nav>
            </div>

            <div className="py-20 text-center">
              <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in tracking-tight">
                Discover Your Next Favorite Spot
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto mb-8 animate-fade-in delay-100">
                Join our community of food lovers and explore the best dining experiences in your area
              </p>
              <button className="bg-gradient-to-r from-red-600 to-orange-500 text-white px-8 py-3 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-fade-in delay-200">
                Start Exploring
              </button>
            </div>
          </div>
        </header>

        <main className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                Popular Restaurants
              </h3>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover highly-rated restaurants with authentic reviews from our community
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant, index) => (
                <div
                  key={restaurant.id}
                  className="transform hover:-translate-y-2 transition-all duration-300"
                  style={{
                    opacity: 0,
                    animation: `fade-in 0.5s ease-out forwards ${index * 0.1}s`,
                  }}
                >
                  <RestaurantCard {...restaurant} />
                </div>
              ))}
            </div>

            {filteredRestaurants.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                No restaurants found matching your search.
              </div>
            )}
          </div>

          <div className="bg-gradient-to-br from-red-50 to-orange-50 py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Trusted Reviews</h4>
                  <p className="text-gray-600">Real experiences shared by our passionate community</p>
                </div>
                <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Local Gems</h4>
                  <p className="text-gray-600">Discover hidden culinary treasures in your area</p>
                </div>
                <div className="p-6 rounded-xl bg-white/50 backdrop-blur-sm shadow-xl transform hover:-translate-y-1 transition-all duration-300">
                  <h4 className="text-xl font-semibold mb-2 text-gray-900">Photo Gallery</h4>
                  <p className="text-gray-600">Visual stories of amazing dining experiences</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">REVBD</h3>
                <p className="text-gray-400">Connecting food lovers with great restaurants</p>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Explore</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Popular Restaurants</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest Reviews</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Food Categories</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Join Us</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Write Reviews</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Add Restaurant</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Create Account</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-lg font-semibold mb-4">Contact</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Feedback</a></li>
                </ul>
              </div>
            </div>
          </div>
        </footer>
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