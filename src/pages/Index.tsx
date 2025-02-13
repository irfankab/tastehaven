import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RestaurantCard } from "@/components/restaurants/RestaurantCard";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
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

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const { data: restaurantsWithRatings, error } = await supabase
        .from('restaurants')
        .select(`
          id,
          name,
          cuisine,
          address,
          image_url,
          reviews (rating)
        `)
        .limit(6);

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
          priceRange: "$$",
          address: restaurant.address,
        };
      });

      setRestaurants(formattedRestaurants);
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

  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      <div className="relative">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2000')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/75"></div>
        </div>
        
        <div className="relative z-10">
          <Header onSearch={setSearchQuery} />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-20 text-center">
              <h1 className="text-5xl font-bold text-white mb-6 animate-fade-in tracking-tight drop-shadow-lg">
                Discover Local Reviews
              </h1>
              <p className="text-xl text-white max-w-2xl mx-auto mb-8 animate-fade-in delay-100 drop-shadow-md">
                Join our community and explore honest reviews from people in Bangladesh
              </p>
              <div className="space-x-4">
                <Button 
                  onClick={handleExploreClick}
                  className="bg-primary text-white px-8 py-6 rounded-full font-semibold hover:bg-red-700 transition-all duration-300 shadow-xl animate-fade-in delay-200"
                >
                  Start Exploring
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => navigate('/auth')}
                  className="px-8 py-6 rounded-full font-semibold bg-white/10 text-white hover:bg-white/20 transition-all duration-300 shadow-xl animate-fade-in delay-300"
                >
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="relative bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Popular Places
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover highly-rated places with authentic reviews from our local community
            </p>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard key={restaurant.id} {...restaurant} reviews={[]} likes={0} />
              ))}
            </div>
          )}

          {!isLoading && filteredRestaurants.length === 0 && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
              No places found matching your search.
            </div>
          )}
        </div>
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">REVBD</h3>
              <p className="text-gray-400">Connecting people with great local businesses</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Explore</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Popular Places</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Latest Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Join Us</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Write Reviews</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Add Business</a></li>
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
