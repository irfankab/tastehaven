
import { MenuItemGrid } from "./MenuItemGrid";

interface MenuItemsProps {
  restaurantId: string;
}

export const MenuItems = ({ restaurantId }: MenuItemsProps) => {
  return <MenuItemGrid restaurantId={restaurantId} />;
};
