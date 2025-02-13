
import { RestaurantCard } from "./RestaurantCard";
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

interface RestaurantGridProps {
  restaurants: Restaurant[];
  isLoading: boolean;
}

export const RestaurantGrid = ({ restaurants, isLoading }: RestaurantGridProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 bg-white rounded-lg shadow-sm">
        No places found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {restaurants.map((restaurant) => (
        <RestaurantCard key={restaurant.id} {...restaurant} reviews={[]} likes={0} />
      ))}
    </div>
  );
};
