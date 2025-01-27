import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, MapPin } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "./ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes?: number;
  image_url?: string;
}

interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  address: string;
  reviews?: Review[];
  likes?: number;
}

export const RestaurantCard = ({
  id,
  name,
  cuisine,
  rating,
  imageUrl,
  priceRange,
  address,
  reviews = [],
  likes = 0,
}: RestaurantCardProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [session, setSession] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLikeRestaurant = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like restaurants",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      // Here you would typically update the likes in your database
      setLocalLikes(prev => prev + 1);
      toast({
        title: "Success",
        description: `You liked ${name}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like restaurant. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLikeReview = async (reviewId: number) => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to like reviews",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    try {
      // Here you would typically update the review likes in your database
      setLocalReviews(prevReviews =>
        prevReviews.map(review =>
          review.id === reviewId
            ? { ...review, likes: (review.likes || 0) + 1 }
            : review
        )
      );
      toast({
        title: "Success",
        description: "Thanks for your feedback",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to like review. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleReviewClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign up or log in to write a review",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    setIsReviewOpen(true);
  };

  const menuSections = [
    {
      name: "Appetizers",
      items: [
        { name: "Spring Rolls", price: "$6.99" },
        { name: "Garlic Bread", price: "$4.99" },
      ]
    },
    {
      name: "Main Course",
      items: [
        { name: "Grilled Salmon", price: "$24.99" },
        { name: "Beef Steak", price: "$29.99" },
      ]
    },
    {
      name: "Desserts",
      items: [
        { name: "Chocolate Cake", price: "$8.99" },
        { name: "Ice Cream", price: "$5.99" },
      ]
    }
  ];

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogTrigger asChild>
          <div>
            <div className="h-48 overflow-hidden">
              <img
                src={imageUrl}
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <CardHeader className="p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg group-hover:text-red-600 transition-colors">{name}</h3>
                  <p className="text-sm text-gray-600">{cuisine}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:text-red-600"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLikeRestaurant();
                    }}
                  >
                    <ThumbsUp className="w-4 h-4 mr-1" />
                    <span>{localLikes}</span>
                  </Button>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600">{priceRange}</p>
            </CardHeader>
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogTitle className="text-2xl font-bold">{name}</DialogTitle>
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 text-gray-600 mt-2">
                <MapPin className="w-4 h-4" />
                <p>{address}</p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-xl font-semibold mb-4">Menu</h3>
              <div className="space-y-6">
                {menuSections.map((section, index) => (
                  <div key={index}>
                    <h4 className="text-lg font-medium mb-2">{section.name}</h4>
                    <div className="space-y-2">
                      {section.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex justify-between items-center">
                          <span>{item.name}</span>
                          <span className="text-gray-600">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />

            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold">Reviews</h3>
                <Button onClick={handleReviewClick}>
                  Write a Review
                </Button>
              </div>
              <div className="space-y-4 max-h-[300px] overflow-y-auto">
                {localReviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <span className="font-medium">{review.userName}</span>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="hover:text-red-600"
                          onClick={() => handleLikeReview(review.id)}
                        >
                          <ThumbsUp className="w-4 h-4 mr-1" />
                          <span>{review.likes || 0}</span>
                        </Button>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="ml-1">{review.rating.toFixed(1)}</span>
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                    {review.image_url && (
                      <img
                        src={review.image_url}
                        alt="Review"
                        className="mt-2 rounded-md max-h-40 object-cover"
                      />
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
        <DialogContent>
          <DialogTitle>Write a Review for {name}</DialogTitle>
          <DialogDescription>
            Share your experience and help others make informed decisions
          </DialogDescription>
          <ReviewForm
            restaurantId={id}
            restaurantName={name}
            onClose={() => setIsReviewOpen(false)}
            onReviewSubmitted={(newReview) => {
              setLocalReviews(prev => [...prev, newReview]);
              setIsReviewOpen(false);
              toast({
                title: "Review submitted!",
                description: "Thank you for sharing your experience.",
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};