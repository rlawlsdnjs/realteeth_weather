import { useState, useEffect, useRef, useMemo } from "react";
import { MapPin, Building, Star, X, Search } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../shared/ui";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import type { SearchResultItem } from "../../features/search/search-results";
import type { KakaoPlace, District, Location } from "../../shared/types";

interface DesktopSearchBoxProps {
  searchQuery: string;
  results: SearchResultItem[];
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onSelectResult: (item: SearchResultItem) => void;
  onToggleFavorite?: (item: SearchResultItem, isFavorite: boolean) => void;
}

const ITEMS_PER_PAGE = 20;

export function DesktopSearchBox({
  searchQuery,
  results,
  onSearchChange,
  onSearch,
  onClear,
  onSelectResult,
  onToggleFavorite,
}: DesktopSearchBoxProps) {
  const { isFavoriteByAddress } = useFavoritesStore();

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [open, setOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  /* ---------------- 결과 분리 ---------------- */
  const favs = results.filter((r) => r.type === "favorite");
  const nonFavs = results.filter((r) => r.type !== "favorite");

  /* ---------------- 결과 키 (리마운트 트리거) ---------------- */
  const resultsKey = useMemo(
    () =>
      results
        .map((r) =>
          r.type === "place"
            ? (r.data as KakaoPlace).id
            : r.type === "favorite"
              ? (r.data as Location).id
              : (r.data as string),
        )
        .join("-"),
    [results],
  );

  /* ---------------- 표시할 결과 ---------------- */
  const visibleNonFavItems = nonFavs.slice(0, visibleCount);
  const hasMore = visibleCount < nonFavs.length;

  /* ---------------- 무한 스크롤 ---------------- */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { threshold: 0.1 },
    );

    const target = observerTarget.current;
    if (target) observer.observe(target);

    return () => {
      if (target) observer.unobserve(target);
    };
  }, []);

  /* ---------------- 즐겨찾기 처리 ---------------- */
  const isItemFavorite = (item: SearchResultItem): boolean => {
    if (item.type === "favorite") return true;
    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      const address = place.address_name || place.road_address_name;
      return isFavoriteByAddress(address);
    }
    return false;
  };

  const handleStarClick = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();
    if (!onToggleFavorite) return;

    const isFav = isItemFavorite(item);
    onToggleFavorite(item, isFav);
  };

  /* ---------------- 선택 ---------------- */
  const handleSelect = (item: SearchResultItem) => {
    let name = "";

    if (item.type === "place") {
      name = (item.data as KakaoPlace).place_name;
    } else if (item.type === "favorite") {
      name = item.favoriteNickname || (item.data as Location).name;
    } else {
      name = item.data as District;
    }

    onSearchChange(name);
    onSelectResult(item);
    setOpen(false);
  };

  /* ---------------- 키보드 ---------------- */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      onSearch();
    } else if (e.key === "Escape") {
      if (searchQuery) {
        onClear();
      } else {
        setOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      setOpen(true);
    }
  };

  /* ---------------- Blur ---------------- */
  const handleBlur = (e: React.FocusEvent) => {
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      setTimeout(() => setOpen(false), 150);
    }
  };

  return (
    <Command
      key={resultsKey} // 🔥 결과 변경 시 전체 리마운트
      className="relative overflow-visible bg-white border rounded-lg"
      shouldFilter={false}
      loop
      onBlur={handleBlur}
    >
      {/* 검색 입력 */}
      <div className="flex items-center px-3">
        <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="장소, 주소, 즐겨찾기 검색"
          className="flex w-full h-10 py-3 text-sm bg-transparent outline-none"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="p-1 rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 opacity-60" />
          </button>
        )}
      </div>

      {/* 결과 리스트 */}
      {open && results.length > 0 && (
        <CommandList className="absolute left-0 right-0 top-full z-[999] mt-1 max-h-[60vh] overflow-y-auto rounded-lg border bg-white shadow-lg">
          {/* 즐겨찾기 */}
          {favs.length > 0 && (
            <CommandGroup heading="즐겨찾기">
              {favs.map((item, i) => {
                const location = item.data as Location;
                return (
                  <CommandItem
                    key={`fav-${location.id}-${i}`}
                    onSelect={() => handleSelect(item)}
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <div className="min-w-0 ml-2">
                      <div className="font-medium truncate">
                        {item.favoriteNickname || location.name}
                      </div>
                      <div className="text-xs truncate text-muted-foreground">
                        {location.address}
                      </div>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {/* 검색 결과 */}
          {visibleNonFavItems.length > 0 && (
            <CommandGroup heading={`검색 결과 (${nonFavs.length}개)`}>
              {visibleNonFavItems.map((item, i) => {
                if (item.type === "place") {
                  const place = item.data as KakaoPlace;
                  const isFav = isItemFavorite(item);

                  return (
                    <CommandItem
                      key={`place-${place.id}-${i}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <Building className="w-4 h-4 opacity-60" />
                      <div className="flex-1 min-w-0 ml-2">
                        <div className="font-medium truncate">
                          {place.place_name}
                        </div>
                        <div className="text-xs truncate opacity-60">
                          {place.address_name}
                        </div>
                      </div>

                      {onToggleFavorite && (
                        <button
                          onClick={(e) => handleStarClick(e, item)}
                          className="p-1 rounded hover:bg-slate-100"
                        >
                          <Star
                            className={`w-4 h-4 ${
                              isFav
                                ? "text-yellow-400 fill-yellow-400"
                                : "opacity-50"
                            }`}
                          />
                        </button>
                      )}
                    </CommandItem>
                  );
                }

                if (item.type === "district") {
                  return (
                    <CommandItem
                      key={`district-${item.data}-${i}`}
                      onSelect={() => handleSelect(item)}
                    >
                      <MapPin className="w-4 h-4 opacity-60" />
                      <span className="ml-2 font-medium truncate">
                        {item.data as District}
                      </span>
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
                스크롤하여 더보기…
              </span>
            </div>
          )}
        </CommandList>
      )}
    </Command>
  );
}
