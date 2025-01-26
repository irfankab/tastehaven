import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Star, MessageSquare } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ReviewForm } from "./ReviewForm";

interface Review {
  id: number;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

interface RestaurantCardProps {
  id: number;
  name: string;
  cuisine: string;
  rating: number;
  imageUrl: string;
  priceRange: string;
  reviews?: Review[];
}

export const RestaurantCard = ({
  id,
  name,
  cuisine,
  rating,
  imageUrl,
  priceRange,
  reviews = [],
}: RestaurantCardProps) => {
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  return (
    <>
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
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{priceRange}</p>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="mt-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Latest Reviews ({reviews.length})
                    </span>
                  </div>
                  <div className="space-y-3">
                    {reviews.slice(0, 2).map((review) => (
                      <div key={review.id} className="border-b border-gray-100 pb-3 last:border-0">
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-sm font-medium">{review.userName}</span>
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm">{review.rating.toFixed(1)}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{review.comment}</p>
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
    </>
  );
};