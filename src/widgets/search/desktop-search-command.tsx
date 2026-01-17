import { MapPin, Building, Star } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../shared/ui";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import type { SearchResultItem } from "../../features/search/search-results";
import type { KakaoPlace, District, Location } from "../../shared/types";

interface DesktopSearchCommandProps {
  results: SearchResultItem[];
  onSelectResult: (item: SearchResultItem) => void;
  onToggleFavorite?: (item: SearchResultItem, isFavorite: boolean) => void;
}

const ITEMS_PER_PAGE = 20;

export function DesktopSearchCommand({
  results,
  onSelectResult,
  onToggleFavorite,
}: DesktopSearchCommandProps) {
  const { isFavorite } = useFavoritesStore();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const observerTarget = useRef<HTMLDivElement>(null);

  // 결과를 타입별로 그룹화
  const districts = results.filter((r) => r.type === "district");
  const places = results.filter((r) => r.type === "place");
  const favs = results.filter((r) => r.type === "favorite");

  // 결과가 변경되면 visibleCount 초기화
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [results]);

  // 무한 스크롤 구현
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, []);

  const handleStarClick = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      const isCurrentlyFavorite =
        item.type === "favorite" ||
        (item.type === "place" && isFavorite((item.data as KakaoPlace).id));
      onToggleFavorite(item, isCurrentlyFavorite);
    }
  };

  // 표시할 결과 계산
  const totalNonFavItems = [...places, ...districts];
  const visibleNonFavItems = totalNonFavItems.slice(0, visibleCount);
  const hasMore = visibleCount < totalNonFavItems.length;

  return (
    <div className="absolute left-0 right-0 z-50 mt-2 top-full">
      <Command
        className="bg-white border rounded-lg shadow-md"
        shouldFilter={false}
        loop={false}
        onKeyDown={(e) => {
          // 검색창에 입력이 가능하도록 키 이벤트 전파 방지하지 않음
          if (e.key === "Escape") {
            e.stopPropagation();
          }
        }}
      >
        <CommandList className="max-h-[70vh] overflow-y-auto">
          {results.length === 0 && (
            <CommandEmpty>검색 결과가 없습니다</CommandEmpty>
          )}

          {favs.length > 0 && (
            <CommandGroup heading="즐겨찾기">
              {favs.map((item, index) => {
                const location = item.data as Location;
                return (
                  <CommandItem
                    key={`fav-${index}`}
                    value={`fav-${location.id}`}
                    onSelect={() => onSelectResult(item)}
                    className="cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {item.favoriteNickname || location.name}
                        </span>
                        {item.favoriteNickname && (
                          <span className="text-xs truncate text-muted-foreground">
                            {location.name}
                          </span>
                        )}
                      </div>
                      <span className="text-xs truncate text-muted-foreground">
                        {location.address}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {visibleNonFavItems.length > 0 && (
            <CommandGroup heading={`검색 결과 (${totalNonFavItems.length}개)`}>
              {visibleNonFavItems.map((item, index) => {
                if (item.type === "place") {
                  const place = item.data as KakaoPlace;
                  const isPlaceFavorite = isFavorite(place.id);
                  return (
                    <CommandItem
                      key={`place-${index}`}
                      value={`place-${place.id}`}
                      onSelect={() => onSelectResult(item)}
                      className="cursor-pointer"
                    >
                      <Building className="w-4 h-4 text-muted-foreground" />
                      <div className="flex flex-col flex-1 min-w-0">
                        <span className="font-medium truncate">
                          {place.place_name}
                        </span>
                        <span className="text-xs truncate text-muted-foreground">
                          {place.address_name}
                        </span>
                      </div>
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => handleStarClick(e, item)}
                          className="p-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Star
                            className={`h-4 w-4 ${
                              isPlaceFavorite
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-muted-foreground"
                            }`}
                          />
                        </button>
                      )}
                    </CommandItem>
                  );
                } else if (item.type === "district") {
                  const district = item.data as District;
                  return (
                    <CommandItem
                      key={`district-${index}`}
                      value={`district-${district}`}
                      onSelect={() => onSelectResult(item)}
                      className="cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium flex-1">{district}</span>
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => handleStarClick(e, item)}
                          className="p-1 rounded hover:bg-slate-100 transition-colors"
                        >
                          <Star className="h-4 w-4 text-muted-foreground" />
                        </button>
                      )}
                    </CommandItem>
                  );
                }
                return null;
              })}
            </CommandGroup>
          )}

          {/* 무한 스크롤 트리거 */}
          {hasMore && (
            <div ref={observerTarget} className="py-2 text-center">
              <span className="text-xs text-muted-foreground">
                스크롤하여 더보기...
              </span>
            </div>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
