import { Search as SearchIcon, Star } from "lucide-react";
import { DesktopSearchBox } from "./desktop-search-box";
import type { SearchResultItem } from "../../features/search/search-results";

interface DesktopSearchPanelHeaderProps {
  searchQuery: string;
  results: SearchResultItem[];
  favoritesCount: number;
  tabMode: "search" | "favorites";
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onSelectResult: (item: SearchResultItem) => void;
  onToggleFavorite?: (item: SearchResultItem, isFavorite: boolean) => void;
  onTabChange: (tab: "search" | "favorites") => void;
}

export function DesktopSearchPanelHeader({
  searchQuery,
  results,
  favoritesCount,
  tabMode,
  onSearchChange,
  onSearch,
  onClear,
  onSelectResult,
  onToggleFavorite,
  onTabChange,
}: DesktopSearchPanelHeaderProps) {
  return (
    <>
      {/* 검색 영역 */}
      <div className="p-4 bg-white border-b">
        <DesktopSearchBox
          searchQuery={searchQuery}
          results={results}
          onSearchChange={(value) => {
            onSearchChange(value);
            onTabChange("search");
          }}
          onSearch={() => {
            onSearch();
            onTabChange("search");
          }}
          onClear={() => {
            onClear();
            onTabChange("search");
          }}
          onSelectResult={onSelectResult}
          onToggleFavorite={onToggleFavorite}
        />
      </div>

      {/* 탭 영역 */}
      <div className="flex bg-white border-b">
        <button
          onClick={() => onTabChange("search")}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
            tabMode === "search"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <SearchIcon className="w-4 h-4" />
          검색
        </button>
        <button
          onClick={() => onTabChange("favorites")}
          className={`flex-1 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative ${
            tabMode === "favorites"
              ? "text-primary border-b-2 border-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Star className="w-4 h-4" />
          즐겨찾기
          {favoritesCount > 0 && (
            <span className="flex items-center justify-center w-5 h-5 text-xs rounded-full bg-primary text-primary-foreground">
              {favoritesCount}
            </span>
          )}
        </button>
      </div>
    </>
  );
}
