import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ReviewFormProps {
  restaurantId: number;
  restaurantName: string;
  onClose: () => void;
}

export const ReviewForm = ({ restaurantId, restaurantName, onClose }: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send this to your backend
    const review = {
      restaurantId,
      rating,
      comment,
      date: new Date().toISOString(),
    };

    console.log("Submitted review:", review);
    
    toast({
      title: "Review submitted!",
      description: "Thank you for sharing your experience.",
    });
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">Review {restaurantName}</h3>
      
      <div className="flex items-center space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-8 h-8 cursor-pointer transition-all duration-200 ${
              star <= (hoveredStar || rating)
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
            onClick={() => setRating(star)}
          />
        ))}
      </div>

      <Textarea
        placeholder="Share your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="min-h-[100px]"
      />

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={!rating || !comment}>
          Submit Review
        </Button>
      </div>
    </form>
  );
};