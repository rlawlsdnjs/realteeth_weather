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
  const [resultsLength, setResultsLength] = useState(results.length);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /* ---------------- 결과 분리 ---------------- */
  const favs = results.filter((r) => r.type === "favorite");
  const nonFavs = results.filter((r) => r.type !== "favorite");

  /* ---------------- 표시할 결과 ---------------- */
  const visibleNonFavItems = nonFavs.slice(0, visibleCount);
  const hasMore = visibleCount < nonFavs.length;
  const totalVisibleItems = favs.length + visibleNonFavItems.length;

  /* ---------------- 결과가 변경되면 visibleCount 리셋 ---------------- */
  if (results.length !== resultsLength) {
    setResultsLength(results.length);
    setVisibleCount(ITEMS_PER_PAGE);
    setSelectedIndex(-1);
  }

  /* ---------------- 스크롤 기반 무한 스크롤 ---------------- */
  useEffect(() => {
    if (!hasMore || !listRef.current) return;

    const listElement = listRef.current;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = listElement;
      // 하단에서 100px 이내에 도달하면 더 로드
      if (scrollHeight - scrollTop - clientHeight < 100) {
        setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
      }
    };

    listElement.addEventListener("scroll", handleScroll);
    return () => listElement.removeEventListener("scroll", handleScroll);
  }, [hasMore]);

  /* ---------------- 로드 더보기 트리거 (IntersectionObserver) ---------------- */
  useEffect(() => {
    if (!hasMore || !loadMoreRef.current || !listRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
        }
      },
      { root: listRef.current, threshold: 0.1 },
    );

    observer.observe(loadMoreRef.current);
    return () => observer.disconnect();
  }, [hasMore]);

  /* ---------------- 키보드로 마지막 근처 도달 시 더 로드 ---------------- */
  const handleLoadMoreOnKeyboard = (newIndex: number) => {
    // 마지막 5개 아이템 근처에 도달하면 더 로드
    if (hasMore && newIndex >= totalVisibleItems - 5) {
      setVisibleCount((prev) => prev + ITEMS_PER_PAGE);
    }
  };

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
    } else if (e.key === "ArrowDown") {
      setOpen(true);
      const newIndex = Math.min(selectedIndex + 1, totalVisibleItems - 1);
      setSelectedIndex(newIndex);
      handleLoadMoreOnKeyboard(newIndex);
    } else if (e.key === "ArrowUp") {
      setOpen(true);
      setSelectedIndex(Math.max(selectedIndex - 1, 0));
    }
  };

  /* ---------------- Command 키보드 핸들링 ---------------- */
  const handleCommandKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      const newIndex = Math.min(selectedIndex + 1, totalVisibleItems - 1);
      setSelectedIndex(newIndex);
      handleLoadMoreOnKeyboard(newIndex);
    } else if (e.key === "ArrowUp") {
      setSelectedIndex(Math.max(selectedIndex - 1, 0));
    }
  };

  const handleBlur = () => {
    // 잠시 대기 후 닫기 (클릭 이벤트가 발생할 시간 확보)
    setTimeout(() => setOpen(false), 150);
  };

  return (
    <Command
      className="relative overflow-visible bg-white border rounded-lg"
      shouldFilter={false}
      loop
      onBlur={handleBlur}
      onKeyDown={handleCommandKeyDown}
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
        <CommandList
          ref={listRef}
          className="absolute left-0 right-0 top-full z-999 mt-1 max-h-[60vh] overflow-y-auto rounded-lg border bg-white shadow-lg"
        >
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
                        <div className="text-xs truncate text-muted-foreground">
                          {place.address_name || place.road_address_name}
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

                // district
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
              })}
            </CommandGroup>
          )}

          {/* 무한 스크롤 트리거 */}
          {hasMore && (
            <div ref={loadMoreRef} className="py-2 text-center">
              <span className="text-xs text-muted-foreground">
                더 불러오는 중...
              </span>
            </div>
          )}
        </CommandList>
      )}
    </Command>
  );
}
