
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Loader2, Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { AddEditMenuItem } from "./AddEditMenuItem";
import { supabase } from "@/integrations/supabase/client";

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
}

interface MenuItemGridProps {
  restaurantId: string;
  isOwner?: boolean;
}

export const MenuItemGrid = ({ restaurantId, isOwner = false }: MenuItemGridProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);

  const fetchMenuItems = async () => {
    try {
      const { data, error } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("category")
        .order("name");

      if (error) throw error;

      setMenuItems(data || []);
      
      // Get unique categories
      const uniqueCategories = Array.from(
        new Set(data?.map((item) => item.category) || [])
      );
      setCategories(uniqueCategories);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEdit = (menuItem?: MenuItem) => {
    setSelectedMenuItem(menuItem || null);
    setIsDialogOpen(true);
  };

  const handleSuccess = () => {
    setIsDialogOpen(false);
    setSelectedMenuItem(null);
    fetchMenuItems();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {isOwner && (
        <div className="flex justify-end">
          <Button onClick={() => handleAddEdit()}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu Item
          </Button>
        </div>
      )}

      {categories.map((category) => (
        <div key={category}>
          <h3 className="text-xl font-semibold mb-4 text-gray-900">
            {category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {menuItems
              .filter((item) => item.category === category)
              .map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{item.name}</CardTitle>
                        {item.description && (
                          <CardDescription>{item.description}</CardDescription>
                        )}
                      </div>
                      {isOwner && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAddEdit(item)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-semibold">
                        ৳{item.price.toFixed(2)}
                      </span>
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}

      {menuItems.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No menu items available.
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <AddEditMenuItem
            restaurantId={restaurantId}
            initialData={selectedMenuItem || undefined}
            onSuccess={handleSuccess}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
