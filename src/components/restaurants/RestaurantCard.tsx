
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, PenSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
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
}: RestaurantCardProps) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchReviews();
    fetchLikes();
    checkIfLiked();
  }, [id]);

  const fetchReviews = async () => {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        rating,
        comment,
        created_at,
        profiles (username)
      `)
      .eq('restaurant_id', id)
      .order('created_at', { ascending: false })
      .limit(2);

    if (error) {
      console.error('Error fetching reviews:', error);
      return;
    }

    const formattedReviews = data.map(review => ({
      id: review.id,
      userName: review.profiles?.username || 'Anonymous',
      rating: review.rating,
      comment: review.comment,
      date: new Date(review.created_at).toLocaleDateString(),
      likes: 0
    }));

    setReviews(formattedReviews);
  };

  const fetchLikes = async () => {
    const { count, error } = await supabase
      .from('restaurant_likes')
      .select('*', { count: 'exact', head: true })
      .eq('restaurant_id', id);

    if (error) {
      console.error('Error fetching likes:', error);
      return;
    }

    setLikesCount(count || 0);
  };

  const checkIfLiked = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    const { data, error } = await supabase
      .from('restaurant_likes')
      .select('id')
      .eq('restaurant_id', id)
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error checking like status:', error);
      return;
    }

    setIsLiked(!!data);
  };

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to like restaurants",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isLiked) {
        await supabase
          .from('restaurant_likes')
          .delete()
          .eq('restaurant_id', id)
          .eq('user_id', session.user.id);
        setLikesCount(prev => prev - 1);
      } else {
        await supabase
          .from('restaurant_likes')
          .insert({
            restaurant_id: id,
            user_id: session.user.id
          });
        setLikesCount(prev => prev + 1);
      }
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status",
        variant: "destructive",
      });
    }
  };
  
  const handleReviewClick = async (e: React.MouseEvent) => {
    e.preventDefault();
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
    fetchReviews(); // Refresh reviews after submission
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
            
            {/* Reviews Section */}
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-700 mb-2">Recent Reviews</div>
              <div className="space-y-3 max-h-32 overflow-y-auto">
                {reviews.map((review) => (
                  <div key={review.id} className="text-sm border-b pb-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{review.userName}</span>
                      <div className="flex items-center">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400 mr-1" />
                        <span>{review.rating}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 mt-1 line-clamp-2">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500 text-sm text-center">No reviews yet</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1 text-sm text-gray-500"
                onClick={handleLikeClick}
              >
                <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-primary text-primary' : ''}`} />
                <span>{likesCount} likes</span>
                <span className="mx-2">•</span>
                <span>{reviews.length} reviews</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="ml-2"
                onClick={handleReviewClick}
              >
                <PenSquare className="w-4 h-4 mr-1" />
                Write a Review
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
