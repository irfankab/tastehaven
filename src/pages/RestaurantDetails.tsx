import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ReviewForm } from "@/components/restaurants/ReviewForm";
import { Card } from "@/components/ui/card";
import { Star, MapPin, ChevronLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image_url: string | null;
  likes: number;
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  address: string;
  reviews: Review[];
}

const RestaurantDetails = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchRestaurantDetails();
  }, [id]);

  const fetchRestaurantDetails = async () => {
    try {
      const { data: restaurantData, error: restaurantError } = await supabase
        .from('restaurants')
        .select('*')
        .eq('id', id)
        .single();

      if (restaurantError) throw restaurantError;

      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select(`
          id,
          rating,
          comment,
          image_url,
          created_at,
          profiles (
            username,
            avatar_url
          )
        `)
        .eq('restaurant_id', id)
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      const reviews = reviewsData.map((review) => ({
        id: review.id,
        userName: review.profiles?.username || 'Anonymous',
        rating: review.rating,
        comment: review.comment,
        date: new Date(review.created_at).toLocaleDateString(),
        image_url: review.image_url,
        likes: 0
      }));

      setRestaurant({
        id: restaurantData.id,
        name: restaurantData.name,
        cuisine: restaurantData.cuisine,
        rating: reviews.length > 0 
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
          : 0,
        imageUrl: restaurantData.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4',
        priceRange: '$$',
        address: restaurantData.address,
        reviews
      });
    } catch (error) {
      console.error('Error fetching restaurant details:', error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReviewSubmitted = (newReview: Review) => {
    if (restaurant) {
      setRestaurant({
        ...restaurant,
        reviews: [newReview, ...restaurant.reviews],
        rating: (restaurant.rating * restaurant.reviews.length + newReview.rating) / (restaurant.reviews.length + 1)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-xl text-gray-600 mb-4">Restaurant not found</p>
        <Link to="/">
          <Button>Go Back Home</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-900">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Restaurants
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={restaurant.imageUrl}
              alt={restaurant.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{restaurant.name}</h1>
              <div className="flex items-center gap-4 text-lg">
                <span className="flex items-center">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                  {restaurant.rating.toFixed(1)}
                </span>
                <span>•</span>
                <span>{restaurant.cuisine}</span>
                <span>•</span>
                <span>{restaurant.priceRange}</span>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 mt-1" />
                <p className="text-lg">{restaurant.address}</p>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="lg">Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[600px]">
                  <ReviewForm
                    restaurantId={restaurant.id}
                    restaurantName={restaurant.name}
                    onClose={() => {}}
                    onReviewSubmitted={handleReviewSubmitted}
                  />
                </DialogContent>
              </Dialog>
            </div>

            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Reviews ({restaurant.reviews.length})</h2>
              <div className="space-y-6">
                {restaurant.reviews.map((review) => (
                  <Card key={review.id} className="p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <p className="font-semibold">{review.userName}</p>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, index) => (
                            <Star
                              key={index}
                              className={`w-4 h-4 ${
                                index < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-sm text-gray-500 ml-2">
                            {review.date}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                    {review.image_url && (
                      <img
                        src={review.image_url}
                        alt="Review"
                        className="mt-4 rounded-lg max-h-48 object-cover"
                      />
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetails;