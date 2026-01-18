import { MapPin, Building, Star } from "lucide-react";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import type { SearchResultItem } from "../../features/search/search-results";
import type { KakaoPlace, District, Location } from "../../shared/types";

interface DesktopSearchResultsProps {
  results: SearchResultItem[];
  onSelectResult: (item: SearchResultItem) => void;
  onToggleFavorite?: (item: SearchResultItem, isFavorite: boolean) => void;
  onEscape?: () => void;
}

export interface DesktopSearchResultsRef {
  focusFirst: () => void;
  handleKeyDown: (e: React.KeyboardEvent) => boolean;
}

const ITEMS_PER_PAGE = 20;

export const DesktopSearchResults = forwardRef<
  DesktopSearchResultsRef,
  DesktopSearchResultsProps
>(({ results, onSelectResult, onToggleFavorite, onEscape }, ref) => {
  const { isFavorite, isFavoriteByAddress } = useFavoritesStore();
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 결과를 타입별로 그룹화
  const favs = results.filter((r) => r.type === "favorite");
  const nonFavs = results.filter((r) => r.type !== "favorite");

  // 표시할 결과 계산
  const visibleNonFavItems = nonFavs.slice(0, visibleCount);
  const allVisibleItems = [...favs, ...visibleNonFavItems];
  const hasMore = visibleCount < nonFavs.length;

  // 결과가 변경되면 초기화
  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedIndex(0);
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

  // 선택된 항목이 보이도록 스크롤
  useEffect(() => {
    const selectedElement = itemRefs.current[selectedIndex];
    if (selectedElement) {
      selectedElement.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [selectedIndex]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent): boolean => {
      if (allVisibleItems.length === 0) return false;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < allVisibleItems.length - 1 ? prev + 1 : 0,
          );
          return true;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev > 0 ? prev - 1 : allVisibleItems.length - 1,
          );
          return true;
        case "Enter":
          e.preventDefault();
          if (allVisibleItems[selectedIndex]) {
            onSelectResult(allVisibleItems[selectedIndex]);
          }
          return true;
        case "Escape":
          e.preventDefault();
          onEscape?.();
          return true;
        default:
          return false;
      }
    },
    [allVisibleItems, selectedIndex, onSelectResult, onEscape],
  );

  const focusFirst = useCallback(() => {
    setSelectedIndex(0);
  }, []);

  useImperativeHandle(ref, () => ({
    focusFirst,
    handleKeyDown,
  }));

  const handleStarClick = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      let isCurrentlyFavorite = false;
      if (item.type === "favorite") {
        isCurrentlyFavorite = true;
      } else if (item.type === "place") {
        const place = item.data as KakaoPlace;
        const address = place.address_name || place.road_address_name;
        isCurrentlyFavorite = isFavoriteByAddress(address);
      }
      onToggleFavorite(item, isCurrentlyFavorite);
    }
  };

  const isItemFavorite = (item: SearchResultItem): boolean => {
    if (item.type === "favorite") return true;
    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      const address = place.address_name || place.road_address_name;
      return isFavoriteByAddress(address);
    }
    return false;
  };

  if (results.length === 0) {
    return (
      <div
        className="absolute left-0 right-0 z-50 mt-2 top-full"
        onMouseDown={(e) => e.preventDefault()}
      >
        <div className="p-4 text-sm text-center bg-white border rounded-lg shadow-md text-muted-foreground">
          검색 결과가 없습니다
        </div>
      </div>
    );
  }

  let itemIndex = 0;

  return (
    <div
      className="absolute left-0 right-0 z-50 mt-2 top-full"
      onMouseDown={(e) => e.preventDefault()}
    >
      <div
        ref={listRef}
        className="bg-white border rounded-lg shadow-md max-h-[70vh] overflow-y-auto"
      >
        {/* 즐겨찾기 그룹 */}
        {favs.length > 0 && (
          <div className="p-1">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              즐겨찾기
            </div>
            {favs.map((item, i) => {
              const currentIndex = itemIndex++;
              const location = item.data as Location;
              const isSelected = selectedIndex === currentIndex;

              return (
                <div
                  key={`fav-${i}`}
                  ref={(el) => (itemRefs.current[currentIndex] = el)}
                  onClick={() => onSelectResult(item)}
                  onMouseEnter={() => setSelectedIndex(currentIndex)}
                  className={`flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-colors ${
                    isSelected
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-slate-100"
                  }`}
                >
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
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
                </div>
              );
            })}
          </div>
        )}

        {/* 검색 결과 그룹 */}
        {visibleNonFavItems.length > 0 && (
          <div className="p-1">
            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
              검색 결과 ({nonFavs.length}개)
            </div>
            {visibleNonFavItems.map((item, i) => {
              const currentIndex = itemIndex++;
              const isSelected = selectedIndex === currentIndex;
              const isFav = isItemFavorite(item);

              if (item.type === "place") {
                const place = item.data as KakaoPlace;
                return (
                  <div
                    key={`place-${i}`}
                    ref={(el) => (itemRefs.current[currentIndex] = el)}
                    onClick={() => onSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <Building className="w-4 h-4 text-muted-foreground shrink-0" />
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
                        className="p-1 rounded hover:bg-slate-200 transition-colors shrink-0"
                      >
                        <Star
                          className={`h-4 w-4 ${
                            isFav
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    )}
                  </div>
                );
              } else if (item.type === "district") {
                const district = item.data as District;
                return (
                  <div
                    key={`district-${i}`}
                    ref={(el) => (itemRefs.current[currentIndex] = el)}
                    onClick={() => onSelectResult(item)}
                    onMouseEnter={() => setSelectedIndex(currentIndex)}
                    className={`flex items-center gap-2 px-2 py-2 rounded-sm cursor-pointer transition-colors ${
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-slate-100"
                    }`}
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                    <span className="flex-1 font-medium truncate">
                      {district}
                    </span>
                    {onToggleFavorite && (
                      <button
                        onClick={(e) => handleStarClick(e, item)}
                        className="p-1 rounded hover:bg-slate-200 transition-colors shrink-0"
                      >
                        <Star className="h-4 w-4 text-muted-foreground" />
                      </button>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}

        {/* 무한 스크롤 트리거 */}
        {hasMore && (
          <div ref={observerTarget} className="py-2 text-center">
            <span className="text-xs text-muted-foreground">
              스크롤하여 더보기...
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

DesktopSearchResults.displayName = "DesktopSearchResults";
