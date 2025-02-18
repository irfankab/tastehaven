
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { ReviewForm } from "@/components/restaurants/ReviewForm";
import { MenuItems } from "@/components/restaurants/MenuItems";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, MapPin, ThumbsUp, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "react-error-boundary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  image_url?: string;
  likes: number;
  user: {
    username: string;
  };
}

interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  address: string;
  image_url: string;
  rating: number;
  reviews: Review[];
}

const RestaurantDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchRestaurant = async () => {
      try {
        if (!id) {
          navigate("/explore");
          return;
        }

        const { data: restaurantData, error: restaurantError } = await supabase
          .from("restaurants")
          .select("*")
          .eq("id", id)
          .maybeSingle();

        if (restaurantError) throw restaurantError;
        if (!restaurantData) {
          toast({
            title: "Restaurant not found",
            description: "The restaurant you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate("/explore");
          return;
        }

        const { data: reviewsData, error: reviewsError } = await supabase
          .from("reviews")
          .select(`
            id,
            rating,
            comment,
            created_at,
            image_url,
            profiles (
              username
            )
          `)
          .eq("restaurant_id", id);

        if (reviewsError) throw reviewsError;

        const formattedReviews = reviewsData.map((review) => ({
          id: review.id,
          userName: review.profiles?.username || "Anonymous",
          rating: review.rating,
          comment: review.comment,
          date: new Date(review.created_at).toLocaleDateString(),
          image_url: review.image_url,
          likes: 0,
          user: {
            username: review.profiles?.username || "Anonymous"
          }
        }));

        const averageRating = formattedReviews.length > 0
          ? Number((formattedReviews.reduce((acc, review) => acc + review.rating, 0) / formattedReviews.length).toFixed(1))
          : 0;

        setRestaurant({
          ...restaurantData,
          reviews: formattedReviews,
          rating: averageRating
        });
      } catch (error: any) {
        console.error("Error fetching restaurant:", error);
        toast({
          title: "Error",
          description: "Failed to load restaurant details",
          variant: "destructive",
        });
        navigate("/explore");
      } finally {
        setIsLoading(false);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    fetchRestaurant();
  }, [id, navigate, toast]);

  const handleReviewSubmitted = (newReview: Review) => {
    setRestaurant(prev => {
      if (!prev) return prev;
      const updatedReviews = [...prev.reviews, newReview];
      const newRating = updatedReviews.length > 0
        ? Number((updatedReviews.reduce((acc, review) => acc + review.rating, 0) / updatedReviews.length).toFixed(1))
        : 0;
      return {
        ...prev,
        reviews: updatedReviews,
        rating: newRating
      };
    });
    setIsReviewModalOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <p className="text-center text-gray-500">Restaurant not found</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<div>Something went wrong. Please try again.</div>}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 mt-16">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="relative h-64">
                {imageLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                <img
                  src={restaurant.image_url || "/placeholder.svg"}
                  alt={restaurant.name}
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    imageLoading ? 'opacity-0' : 'opacity-100'
                  }`}
                  onLoad={() => setImageLoading(false)}
                  onError={(e) => {
                    e.currentTarget.src = "/placeholder.svg";
                    setImageLoading(false);
                  }}
                />
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{restaurant.name}</h1>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                    <span className="text-xl font-semibold">
                      {restaurant.rating}
                    </span>
                  </div>
                </div>

                <Tabs defaultValue="menu" className="mt-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="menu">Menu</TabsTrigger>
                    <TabsTrigger value="reviews">Reviews</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="menu" className="mt-6">
                    <MenuItems restaurantId={restaurant.id} />
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="mt-6">
                    <div className="mb-6">
                      {session ? (
                        <Button
                          onClick={() => setIsReviewModalOpen(true)}
                          className="w-full sm:w-auto bg-primary hover:bg-red-600 text-white shadow-lg"
                        >
                          Write a Review
                        </Button>
                      ) : (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <p className="text-gray-600 text-center">Please <a href="/auth" className="text-primary hover:text-red-600">sign in</a> to write a review</p>
                        </div>
                      )}
                    </div>

                    {restaurant.reviews.length === 0 ? (
                      <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {restaurant.reviews.map((review) => (
                          <div key={review.id} className="border-b pb-6">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-semibold text-primary">@{review.user.username}</p>
                                <p className="text-sm text-gray-500">{review.date}</p>
                              </div>
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span>{review.rating}</span>
                              </div>
                            </div>
                            <p className="text-gray-700 mb-4">{review.comment}</p>
                            {review.image_url && (
                              <img
                                src={review.image_url}
                                alt="Review"
                                className="rounded-lg max-h-48 object-cover"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            )}
                            <div className="flex items-center gap-2 mt-4 text-gray-500">
                              <ThumbsUp className="w-4 h-4" />
                              <span>{review.likes} likes</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>

        <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <ReviewForm
              restaurantId={restaurant.id}
              restaurantName={restaurant.name}
              onClose={() => setIsReviewModalOpen(false)}
              onReviewSubmitted={handleReviewSubmitted}
            />
          </DialogContent>
        </Dialog>
      </div>
    </ErrorBoundary>
  );
};

export default RestaurantDetails;
