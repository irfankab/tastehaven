import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, Upload, Loader } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReviewFormProps {
  restaurantId: string;
  restaurantName: string;
  onClose: () => void;
  onReviewSubmitted: (review: any) => void;
}

export const ReviewForm = ({ 
  restaurantId, 
  restaurantName, 
  onClose, 
  onReviewSubmitted 
}: ReviewFormProps) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();

  const validateForm = () => {
    if (!rating) {
      toast({
        title: "Error",
        description: "Please provide a rating",
        variant: "destructive",
      });
      return false;
    }
    if (!comment.trim()) {
      toast({
        title: "Error",
        description: "Please provide a comment",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "Image size should be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      setSelectedImage(file);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        toast({
          title: "Error",
          description: "Please sign in to submit a review",
          variant: "destructive",
        });
        return;
      }

      let imageUrl = null;
      if (selectedImage) {
        const fileExt = selectedImage.name.split('.').pop();
        const filePath = `${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('restaurant-images')
          .upload(filePath, selectedImage);

        if (uploadError) {
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const { data: { publicUrl } } = supabase.storage
          .from('restaurant-images')
          .getPublicUrl(filePath);

        imageUrl = publicUrl;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();

      const { error: insertError, data: reviewData } = await supabase
        .from('reviews')
        .insert({
          restaurant_id: restaurantId,
          user_id: user.id,
          rating,
          comment,
          image_url: imageUrl
        })
        .select()
        .single();

      if (insertError) {
        toast({
          title: "Error",
          description: "Failed to submit review. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const reviewToReturn = {
        id: reviewData.id,
        userName: profile?.username || user.email?.split('@')[0] || 'Anonymous',
        rating: reviewData.rating,
        comment: reviewData.comment,
        date: reviewData.created_at,
        image_url: reviewData.image_url,
        likes: 0
      };

      onReviewSubmitted(reviewToReturn);
      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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

      <div className="flex items-center gap-4">
        <input
          type="file"
          accept="image/*"
          id="image-upload"
          className="hidden"
          onChange={handleImageSelect}
        />
        <label
          htmlFor="image-upload"
          className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-4 h-4" />
          {selectedImage ? selectedImage.name : "Add a photo"}
        </label>
      </div>

      {imagePreview && (
        <div className="relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="max-h-40 rounded-md object-cover"
          />
          <button
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
            onClick={() => {
              setSelectedImage(null);
              setImagePreview(null);
            }}
          >
            ×
          </button>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={onClose} type="button">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="relative"
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              <span className="ml-2">Submitting...</span>
            </>
          ) : (
            "Submit Review"
          )}
        </Button>
      </div>
    </form>
  );
};