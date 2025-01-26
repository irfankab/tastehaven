import { useState } from "react";
import { Link } from "react-router-dom";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { SearchBar } from "@/components/restaurants/SearchBar";

const MOCK_RESTAURANTS = [
  {
    id: 1,
    name: "The Italian Place",
    cuisine: "Italian",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    priceRange: "$$",
    likes: 24,
    reviews: [
      {
        id: 1,
        userName: "John Doe",
        rating: 4.5,
        comment: "Amazing pasta and great service!",
        date: "2024-03-15",
        likes: 5
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
    likes: 42,
    reviews: [
      {
        id: 2,
        userName: "Mike Johnson",
        rating: 5.0,
        comment: "Best sushi in town! Fresh and delicious.",
        date: "2024-03-14",
        likes: 8
      }
    ]
  },
  {
    id: 3,
    name: "Burger Haven",
    cuisine: "American",
    rating: 4.2,
    imageUrl: "https://images.unsplash.com/photo-1565299543923-37dd37887442",
    priceRange: "$",
    likes: 18,
    reviews: [
      {
        id: 3,
        userName: "David Wilson",
        rating: 4.0,
        comment: "Juicy burgers and crispy fries!",
        date: "2024-03-13",
        likes: 4
      }
    ]
  },
  {
    id: 4,
    name: "Taco Fiesta",
    cuisine: "Mexican",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    priceRange: "$$",
    likes: 31,
    reviews: [
      {
        id: 4,
        userName: "Maria Garcia",
        rating: 4.5,
        comment: "Authentic Mexican flavors! Love the street tacos.",
        date: "2024-03-12",
        likes: 6
      }
    ]
  },
  {
    id: 5,
    name: "Thai Spice",
    cuisine: "Thai",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b",
    priceRange: "$$",
    likes: 28,
    reviews: [
      {
        id: 5,
        userName: "Sarah Lee",
        rating: 5.0,
        comment: "Perfect spice levels and great variety!",
        date: "2024-03-11",
        likes: 7
      }
    ]
  },
  {
    id: 6,
    name: "Mediterranean Delight",
    cuisine: "Mediterranean",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947",
    priceRange: "$$",
    likes: 22,
    reviews: [
      {
        id: 6,
        userName: "Alex Brown",
        rating: 4.5,
        comment: "Fresh ingredients and amazing hummus!",
        date: "2024-03-10",
        likes: 5
      }
    ]
  },
  {
    id: 7,
    name: "Curry House",
    cuisine: "Indian",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    priceRange: "$$",
    likes: 35,
    reviews: [
      {
        id: 7,
        userName: "Raj Patel",
        rating: 4.5,
        comment: "Authentic Indian flavors, great naan bread!",
        date: "2024-03-09",
        likes: 9
      }
    ]
  },
  {
    id: 8,
    name: "The Steakhouse",
    cuisine: "American",
    rating: 4.9,
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    priceRange: "$$$$",
    likes: 45,
    reviews: [
      {
        id: 8,
        userName: "James Smith",
        rating: 5.0,
        comment: "Best steaks in town, amazing service!",
        date: "2024-03-08",
        likes: 12
      }
    ]
  },
  {
    id: 9,
    name: "Dim Sum Paradise",
    cuisine: "Chinese",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    priceRange: "$$",
    likes: 29,
    reviews: [
      {
        id: 9,
        userName: "Lucy Chen",
        rating: 4.5,
        comment: "Authentic dim sum experience!",
        date: "2024-03-07",
        likes: 7
      }
    ]
  },
  {
    id: 10,
    name: "French Bistro",
    cuisine: "French",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1452378174528-3090a4bba7b2",
    priceRange: "$$$",
    likes: 38,
    reviews: [
      {
        id: 10,
        userName: "Sophie Martin",
        rating: 5.0,
        comment: "Feels like Paris! Amazing atmosphere.",
        date: "2024-03-06",
        likes: 10
      }
    ]
  },
  {
    id: 11,
    name: "BBQ Ranch",
    cuisine: "American",
    rating: 4.4,
    imageUrl: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    priceRange: "$$",
    likes: 32,
    reviews: [
      {
        id: 11,
        userName: "Tom Baker",
        rating: 4.5,
        comment: "Great BBQ, friendly staff!",
        date: "2024-03-05",
        likes: 8
      }
    ]
  },
  {
    id: 12,
    name: "Seafood Harbor",
    cuisine: "Seafood",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4",
    priceRange: "$$$",
    likes: 41,
    reviews: [
      {
        id: 12,
        userName: "Emma Wilson",
        rating: 4.5,
        comment: "Fresh seafood, great ocean view!",
        date: "2024-03-04",
        likes: 11
      }
    ]
  },
  {
    id: 13,
    name: "Vegan Delight",
    cuisine: "Vegan",
    rating: 4.3,
    imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c",
    priceRange: "$$",
    likes: 25,
    reviews: [
      {
        id: 13,
        userName: "Olivia Green",
        rating: 4.5,
        comment: "Creative vegan dishes, love it!",
        date: "2024-03-03",
        likes: 6
      }
    ]
  },
  {
    id: 14,
    name: "Korean BBQ House",
    cuisine: "Korean",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1565299543923-37dd37887442",
    priceRange: "$$$",
    likes: 47,
    reviews: [
      {
        id: 14,
        userName: "Jin Kim",
        rating: 5.0,
        comment: "Authentic Korean BBQ experience!",
        date: "2024-03-02",
        likes: 13
      }
    ]
  },
  {
    id: 15,
    name: "Pizza Paradise",
    cuisine: "Italian",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38",
    priceRange: "$$",
    likes: 33,
    reviews: [
      {
        id: 15,
        userName: "Marco Romano",
        rating: 4.5,
        comment: "Best Neapolitan pizza in town!",
        date: "2024-03-01",
        likes: 9
      }
    ]
  },
  {
    id: 16,
    name: "Greek Taverna",
    cuisine: "Greek",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b",
    priceRange: "$$",
    likes: 36,
    reviews: [
      {
        id: 16,
        userName: "Nick Stavros",
        rating: 5.0,
        comment: "Amazing gyros and moussaka!",
        date: "2024-02-29",
        likes: 10
      }
    ]
  },
  {
    id: 17,
    name: "Ramen Shop",
    cuisine: "Japanese",
    rating: 4.7,
    imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947",
    priceRange: "$$",
    likes: 39,
    reviews: [
      {
        id: 17,
        userName: "Yuki Tanaka",
        rating: 5.0,
        comment: "Best ramen in the city!",
        date: "2024-02-28",
        likes: 12
      }
    ]
  },
  {
    id: 18,
    name: "Brazilian Steakhouse",
    cuisine: "Brazilian",
    rating: 4.8,
    imageUrl: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9",
    priceRange: "$$$",
    likes: 44,
    reviews: [
      {
        id: 18,
        userName: "Carlos Silva",
        rating: 5.0,
        comment: "Amazing churrasco experience!",
        date: "2024-02-27",
        likes: 14
      }
    ]
  },
  {
    id: 19,
    name: "Spanish Tapas",
    cuisine: "Spanish",
    rating: 4.5,
    imageUrl: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d",
    priceRange: "$$",
    likes: 31,
    reviews: [
      {
        id: 19,
        userName: "Ana Rodriguez",
        rating: 4.5,
        comment: "Authentic tapas, great sangria!",
        date: "2024-02-26",
        likes: 8
      }
    ]
  },
  {
    id: 20,
    name: "Vietnamese Pho",
    cuisine: "Vietnamese",
    rating: 4.6,
    imageUrl: "https://images.unsplash.com/photo-1501286353178-1ec881214838",
    priceRange: "$",
    likes: 34,
    reviews: [
      {
        id: 20,
        userName: "Tran Nguyen",
        rating: 5.0,
        comment: "Best pho in town, very authentic!",
        date: "2024-02-25",
        likes: 9
      }
    ]
  }
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = MOCK_RESTAURANTS.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <header className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/75"></div>
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
              <button className="text-white bg-black/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-full">
                Write a Review
              </button>
              <Link 
                to="/auth" 
                className="text-white bg-black/20 hover:bg-white/20 transition-all duration-300 px-4 py-2 rounded-full"
              >
                Log In
              </Link>
              <Link 
                to="/auth?mode=signup" 
                className="bg-primary text-white px-6 py-2 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg"
              >
                Sign Up
              </Link>
            </nav>
          </div>

          <div className="py-20 text-center">
            <h2 className="text-5xl font-bold text-white mb-6 animate-fade-in tracking-tight drop-shadow-lg">
              Discover Your Next Favorite Spot
            </h2>
            <p className="text-xl text-white max-w-2xl mx-auto mb-8 animate-fade-in delay-100 drop-shadow-md">
              Join our community of food lovers and explore the best dining experiences in your area
            </p>
            <button className="bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-xl animate-fade-in delay-200">
              Start Exploring
            </button>
          </div>
        </div>
      </header>

      <main className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Restaurants
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover highly-rated restaurants with authentic reviews from our community
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} {...restaurant} />
            ))}
          </div>

          {filteredRestaurants.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
              No restaurants found matching your search.
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12">
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
};

export default Index;