
import { useState, useEffect } from "react";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  address: string;
}

const ExploreRestaurants = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data: restaurantsData, error: restaurantsError } = await supabase
        .from('restaurants')
        .select(`
          id,
          name,
          cuisine,
          address,
          image_url
        `);

      if (restaurantsError) {
        console.error('Error fetching restaurants:', restaurantsError);
        return;
      }

      // Fetch average ratings for each restaurant
      const restaurantsWithRatings = await Promise.all(
        restaurantsData.map(async (restaurant) => {
          const { data: reviewsData } = await supabase
            .from('reviews')
            .select('rating')
            .eq('restaurant_id', restaurant.id);

          const averageRating = reviewsData && reviewsData.length > 0
            ? reviewsData.reduce((acc, review) => acc + Number(review.rating), 0) / reviewsData.length
            : 0;

          return {
            id: restaurant.id,
            name: restaurant.name,
            cuisine: restaurant.cuisine,
            rating: Number(averageRating.toFixed(1)),
            imageUrl: restaurant.image_url,
            priceRange: "$$", // This could be added to the restaurants table in the future
            address: restaurant.address,
          };
        })
      );

      setRestaurants(restaurantsWithRatings);
    } catch (error) {
      console.error('Error in fetchRestaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header onSearch={setSearchQuery} />
        <div className="flex justify-center items-center h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

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
            <RestaurantCard key={restaurant.id} {...restaurant} reviews={[]} likes={0} />
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
