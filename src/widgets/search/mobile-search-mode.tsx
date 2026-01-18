import { useState, useEffect, useRef } from "react";
import { Search as SearchIcon, MapPin, ChevronLeft } from "lucide-react";
import { SearchInput } from "../../features/search/search-input";
import { MobileSearchResultItem } from "../../features/search/mobile-search-result-item";
import { FavoriteCard } from "../favorites/favorite-card";
import { Skeleton } from "../../shared/ui/skeleton";
import { FavoriteIcon } from "../../shared/ui/favorite-button";
import type { SearchResultItem } from "../../features/search/search-results";
import type { Location, Favorite } from "../../shared/types";

interface MobileSearchModeProps {
  searchQuery: string;
  tabMode: "search" | "favorites";
  results: SearchResultItem[];
  currentLocation: Location | null;
  currentLocationAddress: string;
  favorites: Favorite[];
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onTabChange: (tab: "search" | "favorites") => void;
  onSelectResult: (item: SearchResultItem) => void;
  onToggleFavorite: (item: SearchResultItem) => void;
  onUseCurrentLocation: () => void;
  onSelectFavorite: (location: Location) => void;
  onEditNickname: (id: string, nickname: string) => void;
  isResultFavorite: (item: SearchResultItem) => boolean;
  isSearching?: boolean;
}

const ITEMS_PER_PAGE = 20;

export function MobileSearchMode({
  searchQuery,
  tabMode,
  results,
  currentLocation,
  currentLocationAddress,
  favorites,
  onClose,
  onSearchChange,
  onSearch,
  onClear,
  onTabChange,
  onSelectResult,
  onToggleFavorite,
  onUseCurrentLocation,
  onSelectFavorite,
  onEditNickname,
  isResultFavorite,
  isSearching = false,
}: MobileSearchModeProps) {
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [resultsLength, setResultsLength] = useState(results.length);
  const listRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  /* ---------------- 결과가 변경되면 visibleCount 리셋 ---------------- */
  if (results.length !== resultsLength) {
    setResultsLength(results.length);
    setVisibleCount(ITEMS_PER_PAGE);
  }

  /* ---------------- 스크롤 기반 무한 스크롤 ---------------- */
  const hasMore = visibleCount < results.length;

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

  const visibleResults = results.slice(0, visibleCount);

  return (
    <div className="relative flex flex-col h-full bg-white">
      {/* 검색창 헤더 */}
      <div className="flex items-center gap-2 p-3 bg-white border-b">
        <button
          onClick={onClose}
          className="p-2 -ml-1 rounded-lg hover:bg-slate-100"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <div className="flex-1">
          <SearchInput
            value={searchQuery}
            onChange={onSearchChange}
            onSearch={onSearch}
            onClear={onClear}
            placeholder="장소, 주소, 즐겨찾기 검색"
            autoFocus
          />
        </div>
      </div>

      {/* 탭 */}
      <div className="flex bg-white border-b">
        <button
          onClick={() => onTabChange("search")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            tabMode === "search"
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500"
          }`}
        >
          <SearchIcon className="w-4 h-4" />
          검색
        </button>

        <button
          onClick={() => onTabChange("favorites")}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
            tabMode === "favorites"
              ? "text-primary border-b-2 border-primary"
              : "text-slate-500"
          }`}
        >
          <FavoriteIcon className="w-4 h-4" />
          즐겨찾기
          {favorites.length > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
              {favorites.length}
            </span>
          )}
        </button>
      </div>

      {/* 콘텐츠 */}
      <div ref={listRef} className="flex-1 overflow-y-auto bg-slate-50">
        {tabMode === "search" ? (
          <>
            {/* 현재 위치 */}
            {currentLocation && (
              <button
                onClick={onUseCurrentLocation}
                className="flex items-center w-full gap-3 px-4 py-3 bg-white border-b hover:bg-slate-50"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">현재 위치</p>
                  <p className="text-sm text-slate-500">
                    {currentLocationAddress || "위치를 불러오는 중..."}
                  </p>
                </div>
              </button>
            )}

            {/* 검색 결과 */}
            {isSearching ? (
              <div className="p-4 space-y-3 bg-white">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-3">
                    <Skeleton className="w-5 h-5" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="w-3/4 h-5" />
                      <Skeleton className="w-full h-4" />
                    </div>
                    <Skeleton className="w-5 h-5" />
                  </div>
                ))}
              </div>
            ) : searchQuery && results.length > 0 ? (
              <div className="bg-white divide-y">
                {visibleResults.map((item, index) => (
                  <MobileSearchResultItem
                    key={`result-${index}`}
                    item={item}
                    onSelect={onSelectResult}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={isResultFavorite(item)}
                  />
                ))}

                {hasMore && (
                  <div ref={loadMoreRef} className="py-4 text-center">
                    <span className="text-xs text-slate-400">
                      더 불러오는 중...
                    </span>
                  </div>
                )}
              </div>
            ) : searchQuery ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">검색 결과가 없습니다</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">장소를 검색해 보세요</p>
              </div>
            )}
          </>
        ) : (
          /* 즐겨찾기 */
          <div className="p-4">
            {favorites.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-slate-500">
                <FavoriteIcon className="w-12 h-12 mb-4 opacity-20" />
                <p className="text-sm">아직 즐겨찾기가 없습니다</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="mb-2 text-xs text-slate-500">
                  최대 6개까지 저장 가능 ({favorites.length}/6)
                </p>
                {favorites.map((favorite) => (
                  <div
                    key={favorite.id}
                    onClick={() => onSelectFavorite(favorite.location)}
                    className="cursor-pointer"
                  >
                    <FavoriteCard
                      favorite={favorite}
                      onEditNickname={onEditNickname}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
