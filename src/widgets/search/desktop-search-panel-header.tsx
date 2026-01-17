import { Search as SearchIcon, Star, X } from "lucide-react";
import { DesktopSearchCommand } from "./desktop-search-command";
import type { SearchResultItem } from "../../features/search/search-results";

interface DesktopSearchPanelHeaderProps {
  searchQuery: string;
  showResults: boolean;
  results: SearchResultItem[];
  favoritesCount: number;
  tabMode: "search" | "favorites";
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  onClear: () => void;
  onSelectResult: (item: SearchResultItem) => void;
  onTabChange: (tab: "search" | "favorites") => void;
}

export function DesktopSearchPanelHeader({
  searchQuery,
  showResults,
  results,
  favoritesCount,
  tabMode,
  onSearchChange,
  onSearch,
  onClear,
  onSelectResult,
  onTabChange,
}: DesktopSearchPanelHeaderProps) {
  return (
    <>
      {/* 검색 영역 */}
      <div className="p-4 bg-white border-b">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              onSearchChange(e.target.value);
              onTabChange("search");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearch();
                onTabChange("search");
              }
            }}
            placeholder="장소, 주소, 즐겨찾기 검색"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pr-8 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          />
          {searchQuery && (
            <button
              onClick={() => {
                onClear();
                onTabChange("search");
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          {showResults && searchQuery && tabMode === "search" && (
            <DesktopSearchCommand
              results={results}
              onSelectResult={onSelectResult}
            />
          )}
        </div>
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
