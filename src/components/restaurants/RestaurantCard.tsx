import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageSquare, ThumbsUp, Image } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ReviewForm } from "./ReviewForm";

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
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
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
  reviews = [],
  likes = 0,
}: RestaurantCardProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [localLikes, setLocalLikes] = useState(likes);
  const [localReviews, setLocalReviews] = useState(reviews);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLikeRestaurant = () => {
    setLocalLikes(prev => prev + 1);
    toast({
      title: "Restaurant liked!",
      description: `You liked ${name}`,
    });
  };

  const handleLikeReview = (reviewId: number) => {
    setLocalReviews(prevReviews =>
      prevReviews.map(review =>
        review.id === reviewId
          ? { ...review, likes: (review.likes || 0) + 1 }
          : review
      )
    );
    toast({
      title: "Review liked!",
      description: "Thanks for your feedback",
    });
  };

  return (
    <Card className="overflow-hidden group cursor-pointer hover:shadow-lg transition-all duration-300">
      <Dialog open={isReviewOpen} onOpenChange={setIsReviewOpen}>
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
            <CardContent className="p-4 pt-0">
              <div className="mt-4">
                <div className="flex items-center gap-2 mb-3">
                  <MessageSquare className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Latest Reviews ({localReviews.length})
                  </span>
                </div>
                <div className="space-y-3">
                  {localReviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0">
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-sm font-medium">{review.userName}</span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="hover:text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleLikeReview(review.id);
                            }}
                          >
                            <ThumbsUp className="w-4 h-4 mr-1" />
                            <span>{review.likes || 0}</span>
                          </Button>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      {review.image_url && (
                        <div className="mt-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button 
                                variant="ghost" 
                                className="p-0 h-20 w-20 relative overflow-hidden rounded-md hover:opacity-90"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedImage(review.image_url);
                                }}
                              >
                                <img 
                                  src={review.image_url} 
                                  alt="Review" 
                                  className="w-full h-full object-cover"
                                />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[600px] p-0">
                              <img 
                                src={review.image_url} 
                                alt="Review" 
                                className="w-full h-auto"
                              />
                            </DialogContent>
                          </Dialog>
                        </div>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </div>
        </DialogTrigger>
        <DialogContent>
          <ReviewForm
            restaurantId={id}
            restaurantName={name}
            onClose={() => setIsReviewOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </Card>
  );
};