
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { RestaurantGrid } from "@/components/restaurants/RestaurantGrid";
import { RestaurantFilters } from "@/components/restaurants/RestaurantFilters";
import { useDebounce } from "@/hooks/useDebounce";

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  address: string;
}

const ITEMS_PER_PAGE = 6;

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCuisine, setSelectedCuisine] = useState("All");
  const [selectedPriceRange, setSelectedPriceRange] = useState("All");
  const [selectedSort, setSelectedSort] = useState("rating");
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const debouncedSearch = useDebounce(searchQuery);

  useEffect(() => {
    fetchRestaurants();
  }, [debouncedSearch, page, selectedCuisine, selectedPriceRange, selectedSort]);

  const fetchRestaurants = async () => {
    try {
      setIsLoading(true);
      let query = supabase
        .from('restaurants')
        .select(`
          id,
          name,
          cuisine,
          address,
          image_url,
          price_range,
          created_at,
          reviews (rating)
        `);

      // Apply filters
      if (debouncedSearch) {
        query = query.ilike('name', `%${debouncedSearch}%`);
      }
      
      if (selectedCuisine !== "All") {
        query = query.eq('cuisine', selectedCuisine);
      }
      
      if (selectedPriceRange !== "All") {
        query = query.eq('price_range', selectedPriceRange);
      }

      // Only apply database-level sorting for non-rating sorts
      if (selectedSort !== "rating") {
        switch (selectedSort) {
          case "name":
            query = query.order('name');
            break;
          case "newest":
            query = query.order('created_at', { ascending: false });
            break;
        }
      }

      // Apply pagination
      query = query
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      const { data: restaurantsWithRatings, error } = await query;

      if (error) {
        console.error('Error fetching restaurants:', error);
        return;
      }

      const formattedRestaurants = restaurantsWithRatings.map((restaurant) => {
        const ratings = restaurant.reviews || [];
        const averageRating = ratings.length > 0
          ? ratings.reduce((acc: number, review: { rating: number }) => acc + Number(review.rating), 0) / ratings.length
          : 0;

        return {
          id: restaurant.id,
          name: restaurant.name,
          cuisine: restaurant.cuisine,
          rating: Number(averageRating.toFixed(1)),
          imageUrl: restaurant.image_url,
          priceRange: restaurant.price_range,
          address: restaurant.address,
        };
      });

      // Sort by rating if selected (in memory)
      if (selectedSort === "rating") {
        formattedRestaurants.sort((a, b) => b.rating - a.rating);
      }

      setRestaurants(formattedRestaurants);
      setHasMore(restaurantsWithRatings.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error('Error in fetchRestaurants:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExploreClick = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to explore reviews",
        variant: "default",
      });
      navigate('/auth');
    } else {
      navigate('/explore');
    }
  };

  const loadMore = () => {
    if (hasMore) {
      setPage(prev => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm"></div>
        </div>
        
        <div className="relative z-10">
          <Header onSearch={setSearchQuery} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-24 sm:py-32 text-center animate-fade-in">
              <h1 className="text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
                Discover Local Reviews
              </h1>
              <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
                Join our community and explore honest reviews from people in Bangladesh
              </p>
              <div className="space-y-4 sm:space-y-0 sm:space-x-4">
                <Button 
                  onClick={handleExploreClick}
                  size="lg"
                  className="w-full sm:w-auto bg-primary hover:bg-red-600 text-white px-8 py-6 rounded-full font-semibold transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-fade-in delay-200"
                >
                  Start Exploring
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  size="lg"
                  className="w-full sm:w-auto px-8 py-6 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 animate-fade-in delay-300 backdrop-blur-sm"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fade-in">
              Popular Places
            </h2>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto animate-fade-in delay-100">
              Discover highly-rated places with authentic reviews from our local community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl shadow-xl">
                <RestaurantFilters
                  selectedCuisine={selectedCuisine}
                  setSelectedCuisine={setSelectedCuisine}
                  selectedPriceRange={selectedPriceRange}
                  setSelectedPriceRange={setSelectedPriceRange}
                  selectedSort={selectedSort}
                  setSelectedSort={setSelectedSort}
                />
              </div>
            </div>

            <div className="lg:col-span-3">
              <RestaurantGrid
                restaurants={restaurants}
                isLoading={isLoading}
              />
              
              {hasMore && !isLoading && (
                <div className="mt-8 text-center">
                  <Button
                    onClick={loadMore}
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto hover:bg-white/10 transition-colors border-white/20 text-white hover:text-white"
                  >
                    Load More
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-to-b from-gray-900 to-black text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">REVBD</h3>
              <p className="text-gray-400">Connecting people with great local businesses</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Explore</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Popular Places</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Join Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Write Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Add Business</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Create Account</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-200">Contact</h4>
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
