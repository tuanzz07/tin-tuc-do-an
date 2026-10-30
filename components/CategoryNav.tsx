'use client';

import React from 'react';
import { CATEGORIES } from '@/lib/feeds-config';
import { FoodCategory } from '@/lib/types';
import { 
  Flame, 
  ChefHat, 
  MapPin, 
  Star, 
  Coffee, 
  Salad, 
  UtensilsCrossed 
} from 'lucide-react';

interface CategoryNavProps {
  activeCategory: FoodCategory;
  onSelectCategory: (category: FoodCategory) => void;
  categoryCounts?: Record<string, number>;
}

const ICONS: Record<string, React.ReactNode> = {
  all: <Flame className="w-4 h-4 text-orange-500" />,
  recipes: <ChefHat className="w-4 h-4 text-emerald-500" />,
  places: <MapPin className="w-4 h-4 text-rose-500" />,
  reviews: <Star className="w-4 h-4 text-amber-500" />,
  drinks: <Coffee className="w-4 h-4 text-amber-700" />,
  healthy: <Salad className="w-4 h-4 text-green-500" />,
  vietnam: <UtensilsCrossed className="w-4 h-4 text-red-500" />
};

export const CategoryNav: React.FC<CategoryNavProps> = ({
  activeCategory,
  onSelectCategory,
  categoryCounts = {}
}) => {
  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2">
      <div className="flex items-center gap-2 min-w-max pb-1">
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id;
          const count = categoryCounts[cat.id];

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs sm:text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-500/25 scale-[1.02]'
                  : 'bg-card/70 hover:bg-card text-muted-foreground hover:text-foreground border border-border/60 hover:border-border'
              }`}
            >
              <span className="flex-shrink-0">{ICONS[cat.id]}</span>
              <span>{cat.vietnameseName}</span>
              {typeof count === 'number' && count > 0 && (
                <span
                  className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
