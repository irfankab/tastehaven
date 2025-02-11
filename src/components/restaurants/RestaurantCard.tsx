
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  likes: number;
}

export interface RestaurantCardProps {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  address: string;
  likes: number;
  reviews: Review[];
}

export const RestaurantCard = ({
  id,
  name,
  cuisine,
  rating,
  imageUrl,
  priceRange,
  address,
  likes,
  reviews,
}: RestaurantCardProps) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const { toast } = useToast();
  
  const handleReviewClick = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation to restaurant details
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to write a review",
        variant: "destructive",
      });
      return;
    }
    setIsReviewModalOpen(true);
  };

  const handleReviewSubmitted = (newReview: Review) => {
    setIsReviewModalOpen(false);
    toast({
      title: "Review Submitted",
      description: "Thank you for your review!",
    });
  };

  return (
    <>
      <Link to={`/restaurant/${id}`} className="block">
        <Card className="overflow-hidden transition-all hover:shadow-lg hover:scale-[1.02]">
          <div className="relative h-48">
            <img
              src={imageUrl || "/placeholder.svg"}
              alt={name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90">
                {priceRange}
              </Badge>
            </div>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold">{name}</h3>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-sm font-medium">{rating.toFixed(1)}</span>
              </div>
            </div>
            <Badge className="mb-2">{cuisine}</Badge>
            <p className="text-sm text-gray-600 mb-4 truncate">{address}</p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <ThumbsUp className="w-4 h-4" />
                <span>{likes} likes</span>
                <span className="mx-2">•</span>
                <span>{reviews.length} reviews</span>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={handleReviewClick}
              >
                <PenSquare className="w-4 h-4 mr-1" />
                Review
              </Button>
            </div>
          </div>
        </Card>
      </Link>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <ReviewForm
            restaurantId={id}
            restaurantName={name}
            onClose={() => setIsReviewModalOpen(false)}
            onReviewSubmitted={handleReviewSubmitted}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
