import { Star, MapPin, Building } from "lucide-react";
import type { SearchResultItem } from "./search-results";
import type { Location, KakaoPlace, District } from "../../shared/types";

interface MobileSearchResultItemProps {
  item: SearchResultItem;
  onSelect: (item: SearchResultItem) => void;
  onToggleFavorite: (item: SearchResultItem) => void;
  isFavorite: boolean;
}

export function MobileSearchResultItem({
  item,
  onSelect,
  onToggleFavorite,
  isFavorite,
}: MobileSearchResultItemProps) {
  if (item.type === "district") {
    return (
      <div className="flex items-center gap-3 px-4 py-3 transition-colors bg-white hover:bg-slate-50">
        <div
          onClick={() => onSelect(item)}
          className="flex items-center flex-1 min-w-0 gap-3 cursor-pointer"
        >
          <div className="p-2 rounded-full bg-slate-100">
            <MapPin className="w-5 h-5 text-slate-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.data as District}</p>
            <p className="text-sm text-slate-500">행정구역</p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className="p-2 rounded-lg hover:bg-slate-100 shrink-0"
        >
          <Star className="w-5 h-5 text-slate-400" />
        </button>
      </div>
    );
  }

  if (item.type === "favorite") {
    const location = item.data as Location;
    return (
      <div className="flex items-center gap-3 px-4 py-3 transition-colors bg-white hover:bg-slate-50">
        <div
          onClick={() => onSelect(item)}
          className="flex items-center flex-1 min-w-0 gap-3 cursor-pointer"
        >
          <div className="p-2 bg-yellow-100 rounded-full">
            <Star className="w-5 h-5 text-yellow-600 fill-yellow-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{item.favoriteNickname}</p>
            <p className="text-sm truncate text-slate-500">
              {location.address}
            </p>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(item);
          }}
          className="p-2 rounded-lg hover:bg-slate-100 shrink-0"
        >
          <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </button>
      </div>
    );
  }

  // place type
  const place = item.data as KakaoPlace;
  return (
    <div className="flex items-center gap-3 px-4 py-3 transition-colors bg-white hover:bg-slate-50">
      <div
        onClick={() => onSelect(item)}
        className="flex items-center flex-1 min-w-0 gap-3 cursor-pointer"
      >
        <div className="p-2 rounded-full bg-slate-100">
          <Building className="w-5 h-5 text-slate-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{place.place_name}</p>
          <p className="text-sm truncate text-slate-500">
            {place.address_name}
          </p>
          {place.category_name && (
            <p className="text-xs truncate text-slate-400">
              {place.category_name}
            </p>
          )}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleFavorite(item);
        }}
        className="p-2 rounded-lg hover:bg-slate-100 shrink-0"
      >
        <Star
          className={`w-5 h-5 ${
            isFavorite ? "fill-yellow-400 text-yellow-400" : "text-slate-400"
          }`}
        />
      </button>
    </div>
  );
}
