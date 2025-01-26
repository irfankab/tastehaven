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
        <header className="bg-gradient-to-r from-red-600 to-orange-500 text-white shadow-lg relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] opacity-10 bg-cover bg-center"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex items-center justify-between h-20">
              <div className="flex items-center">
                <h1 className="text-3xl font-bold text-white animate-fade-in">
                  REVBD
                </h1>
              </div>

              <div className="flex-1 max-w-2xl mx-8">
                <SearchBar onSearch={setSearchQuery} />
              </div>

              <nav className="flex items-center space-x-4">
                <button className="hover:text-gray-200 transition-colors px-4 py-2 rounded-full hover:bg-white/10">
                  Write a Review
                </button>
                <button className="hover:text-gray-200 transition-colors px-4 py-2 rounded-full hover:bg-white/10">
                  Log In
                </button>
                <button className="bg-white text-red-600 px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
                  Sign Up
                </button>
              </nav>
            </div>
          </div>
        </header>

        <main>
          <div className="relative py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12 animate-fade-in">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">
                  Discover Amazing Restaurants
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Explore the best dining experiences with authentic reviews from food lovers like you
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
                {filteredRestaurants.map((restaurant, index) => (
                  <div
                    key={restaurant.id}
                    className="transform hover:-translate-y-1 transition-all duration-300"
                    style={{
                      animationDelay: `${index * 100}ms`,
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
          </div>
        </main>

        <footer className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-12 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">About REVBD</h3>
                <p className="text-white/80">
                  Discover and share the best dining experiences in your area.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      Write a Review
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      Restaurant Owners
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-white/80 hover:text-white transition-colors">
                      Mobile App
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-4">Connect With Us</h3>
                <div className="flex space-x-4">
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Twitter
                  </a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Facebook
                  </a>
                  <a href="#" className="text-white/80 hover:text-white transition-colors">
                    Instagram
                  </a>
                </div>
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