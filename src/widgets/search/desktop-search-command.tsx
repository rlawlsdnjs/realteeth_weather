import { MapPin, Building, Star } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "../../shared/ui";
import type { SearchResultItem } from "../../features/search/search-results";
import type { KakaoPlace, District, Location } from "../../shared/types";

interface DesktopSearchCommandProps {
  results: SearchResultItem[];
  onSelectResult: (item: SearchResultItem) => void;
}

export function DesktopSearchCommand({
  results,
  onSelectResult,
}: DesktopSearchCommandProps) {
  // 결과를 타입별로 그룹화
  const districts = results.filter((r) => r.type === "district");
  const places = results.filter((r) => r.type === "place");
  const favs = results.filter((r) => r.type === "favorite");

  return (
    <div className="absolute left-0 right-0 z-50 mt-2 top-full">
      <Command
        className="bg-white border rounded-lg shadow-md"
        shouldFilter={false}
      >
        <CommandList className="max-h-100">
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

          {places.length > 0 && (
            <CommandGroup heading="장소">
              {places.map((item, index) => {
                const place = item.data as KakaoPlace;
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
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {districts.length > 0 && (
            <CommandGroup heading="행정구역">
              {districts.map((item, index) => {
                const district = item.data as District;
                return (
                  <CommandItem
                    key={`district-${index}`}
                    value={`district-${district}`}
                    onSelect={() => onSelectResult(item)}
                    className="cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium">{district}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </div>
  );
}
