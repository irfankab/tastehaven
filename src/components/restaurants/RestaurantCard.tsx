import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp } from "lucide-react";

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
  name,
  cuisine,
  rating,
  imageUrl,
  priceRange,
  address,
  likes,
  reviews,
}: RestaurantCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div className="relative h-48">
        <img
          src={imageUrl}
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
            <span className="text-sm font-medium">{rating}</span>
          </div>
        </div>
        <Badge className="mb-2">{cuisine}</Badge>
        <p className="text-sm text-gray-600 mb-4">{address}</p>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <ThumbsUp className="w-4 h-4" />
            <span>{likes} likes</span>
          </div>
          <span>{reviews.length} reviews</span>
        </div>
      </div>
    </Card>
  );
};