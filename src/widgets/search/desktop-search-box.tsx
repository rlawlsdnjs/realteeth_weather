import { useState, useEffect, useRef } from "react";
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

  // 결과를 타입별로 그룹화
  const favs = results.filter((r) => r.type === "favorite");
  const nonFavs = results.filter((r) => r.type !== "favorite");

  // 표시할 결과 계산
  const visibleNonFavItems = nonFavs.slice(0, visibleCount);
  const hasMore = visibleCount < nonFavs.length;

  // 결과가 변경되면 visibleCount 초기화
  const resultsKey = results
    .map((r) =>
      r.type === "place"
        ? (r.data as KakaoPlace).id
        : r.type === "favorite"
          ? (r.data as Location).id
          : (r.data as string),
    )
    .join("-");

  useEffect(() => {
    setVisibleCount(ITEMS_PER_PAGE);
  }, [resultsKey]);

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

  const handleSelect = (item: SearchResultItem) => {
    // 검색창에 선택한 값 표시
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      // 한글 조합 중이 아닐 때만
      onSearch();
    } else if (e.key === "Escape") {
      if (searchQuery) {
        onClear();
      } else {
        setOpen(false);
        inputRef.current?.blur();
      }
    } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      // 화살표 키로 결과 탐색 시 리스트 열기
      setOpen(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // 포커스가 Command 영역 밖으로 나갔을 때만 닫기
    const relatedTarget = e.relatedTarget as HTMLElement;
    if (!relatedTarget || !e.currentTarget.contains(relatedTarget)) {
      // 약간의 지연을 줘서 클릭 이벤트가 처리되도록 함
      setTimeout(() => setOpen(false), 150);
    }
  };

  return (
    <Command
      className="relative overflow-visible bg-white border rounded-lg"
      shouldFilter={false}
      loop
      onBlur={handleBlur}
    >
      <div className="flex items-center px-3">
        <Search className="w-4 h-4 mr-2 opacity-50 shrink-0" />
        <input
          ref={inputRef}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="장소, 주소, 즐겨찾기 검색"
          className="flex w-full h-10 py-3 text-sm bg-transparent rounded-md outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
        />
        {searchQuery && (
          <button
            onClick={() => {
              onClear();
              inputRef.current?.focus();
            }}
            className="p-1 transition-colors rounded-full hover:bg-gray-100"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <CommandList className="absolute left-0 right-0 top-full z-[999] mt-1 max-h-[60vh] overflow-y-auto rounded-lg border bg-white shadow-lg">
          {/* 즐겨찾기 그룹 */}
          {favs.length > 0 && (
            <CommandGroup heading="즐겨찾기">
              {favs.map((item, index) => {
                const location = item.data as Location;
                return (
                  <CommandItem
                    key={`fav-${index}`}
                    value={`fav-${location.id}-${index}`}
                    onSelect={() => handleSelect(item)}
                    className="cursor-pointer"
                  >
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 shrink-0" />
                    <div className="flex flex-col flex-1 min-w-0 ml-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {item.favoriteNickname || location.name}
                        </span>
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

          {/* 검색 결과 그룹 */}
          {visibleNonFavItems.length > 0 && (
            <CommandGroup heading={`검색 결과 (${nonFavs.length}개)`}>
              {visibleNonFavItems.map((item, index) => {
                const isFav = isItemFavorite(item);

                if (item.type === "place") {
                  const place = item.data as KakaoPlace;
                  return (
                    <CommandItem
                      key={`place-${index}`}
                      value={`place-${place.id}-${index}`}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      <Building className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div className="flex flex-col flex-1 min-w-0 ml-2">
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
                          className="p-1 transition-colors rounded shrink-0 hover:bg-slate-100"
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
                    </CommandItem>
                  );
                } else if (item.type === "district") {
                  const district = item.data as District;
                  return (
                    <CommandItem
                      key={`district-${index}`}
                      value={`district-${district}-${index}`}
                      onSelect={() => handleSelect(item)}
                      className="cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 ml-2 font-medium truncate">
                        {district}
                      </span>
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => handleStarClick(e, item)}
                          className="p-1 transition-colors rounded shrink-0 hover:bg-slate-100"
                        >
                          <Star className="w-4 h-4 text-muted-foreground" />
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
      )}
    </Command>
  );
}
