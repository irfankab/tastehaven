import { useState } from "react";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";

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

const ExploreRestaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredRestaurants = MOCK_RESTAURANTS.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onSearch={setSearchQuery} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Explore Restaurants</h1>
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
    </div>
  );
};

export default ExploreRestaurants;
