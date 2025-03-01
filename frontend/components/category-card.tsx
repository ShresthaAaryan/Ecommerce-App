import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Category } from "@/lib/types";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/categories/${category.slug}`}>
      <Card className="overflow-hidden border-none shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={category.image}
            alt={category.name}
            className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
            <h3 className="text-white font-medium">{category.name}</h3>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default CategoryCard;