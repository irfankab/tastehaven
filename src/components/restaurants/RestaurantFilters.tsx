
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface RestaurantFiltersProps {
  selectedCuisine: string;
  setSelectedCuisine: (cuisine: string) => void;
  selectedPriceRange: string;
  setSelectedPriceRange: (range: string) => void;
  selectedSort: string;
  setSelectedSort: (sort: string) => void;
}

export const RestaurantFilters = ({
  selectedCuisine,
  setSelectedCuisine,
  selectedPriceRange,
  setSelectedPriceRange,
  selectedSort,
  setSelectedSort,
}: RestaurantFiltersProps) => {
  const cuisines = ["All", "Italian", "Chinese", "Indian", "Japanese", "Bengali"];
  const priceRanges = ["All", "$", "$$", "$$$", "$$$$"];
  const sortOptions = [
    { value: "rating", label: "Rating (High to Low)" },
    { value: "name", label: "Name (A-Z)" },
    { value: "newest", label: "Newest First" },
  ];

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <div>
        <h3 className="text-lg font-semibold mb-3">Cuisine Type</h3>
        <div className="flex flex-wrap gap-2">
          {cuisines.map((cuisine) => (
            <Button
              key={cuisine}
              variant={selectedCuisine === cuisine ? "default" : "outline"}
              onClick={() => setSelectedCuisine(cuisine)}
              size="sm"
            >
              {cuisine}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Price Range</h3>
        <div className="flex flex-wrap gap-2">
          {priceRanges.map((range) => (
            <Button
              key={range}
              variant={selectedPriceRange === range ? "default" : "outline"}
              onClick={() => setSelectedPriceRange(range)}
              size="sm"
            >
              {range}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Sort By</h3>
        <RadioGroup value={selectedSort} onValueChange={setSelectedSort}>
          {sortOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem value={option.value} id={option.value} />
              <Label htmlFor={option.value}>{option.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </div>
  );
};
