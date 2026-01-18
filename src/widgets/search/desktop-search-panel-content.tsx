import { Search as SearchIcon } from "lucide-react";
import { FavoriteToggleButton, FavoriteIcon } from "../../shared/ui";
import { WeatherCard } from "../weather/weather-card";
import { ClinicList } from "../clinic/clinic-list";
import { ClinicDetail } from "../clinic/clinic-detail";
import { FavoriteCard } from "../favorites/favorite-card";
import { WeatherSkeleton } from "../../shared/ui/weather-skeleton";
import { Skeleton } from "../../shared/ui/skeleton";
import type {
  Location,
  Clinic,
  WeatherData,
  ForecastData,
  Favorite,
} from "../../shared/types";

interface DesktopSearchPanelContentProps {
  tabMode: "search" | "favorites";
  viewMode: "weather" | "clinic";
  mapLocation: Location | null;
  currentLocationAddress: string;
  isLocationFavorite: boolean;
  isWeatherLoading: boolean;
  isWeatherError: boolean;
  isClinicsLoading: boolean;
  weatherData: WeatherData | undefined;
  forecastData: ForecastData | undefined;
  clinics: Clinic[];
  selectedClinic: Clinic | null;
  favorites: Favorite[];
  onToggleFavorite: () => void;
  onClinicClick: (clinic: Clinic) => void;
  onBackToWeather: () => void;
  onEditNickname: (id: string, nickname: string) => void;
}

export function DesktopSearchPanelContent({
  tabMode,
  viewMode,
  mapLocation,
  currentLocationAddress,
  isLocationFavorite,
  isWeatherLoading,
  isWeatherError,
  isClinicsLoading,
  weatherData,
  forecastData,
  clinics,
  selectedClinic,
  favorites,
  onToggleFavorite,
  onClinicClick,
  onBackToWeather,
  onEditNickname,
}: DesktopSearchPanelContentProps) {
  return (
    <div className="relative flex-1 overflow-hidden bg-slate-50">
      {tabMode === "search" && (
        <>
          {mapLocation ? (
            <div className="relative h-full">
              <div
                className={`absolute inset-0 overflow-y-auto p-4 transition-transform duration-300 ease-in-out ${
                  viewMode === "weather" ? "translate-x-0" : "-translate-x-full"
                }`}
              >
                <div className="space-y-4">
                  <div className="py-4">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h2 className="mb-1 text-lg font-semibold">
                          {mapLocation.id === "current-location"
                            ? "현재 위치"
                            : mapLocation.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          {mapLocation.id === "current-location"
                            ? currentLocationAddress || (
                                <Skeleton className="w-48 h-4" />
                              )
                            : mapLocation.address}
                        </p>
                      </div>
                      <FavoriteToggleButton
                        isFavorite={isLocationFavorite}
                        onClick={onToggleFavorite}
                        size="lg"
                      />
                    </div>
                  </div>

                  {isWeatherLoading ? (
                    <WeatherSkeleton />
                  ) : isWeatherError ? (
                    <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                      <p className="text-sm text-center text-destructive">
                        해당 장소의 정보가 제공되지 않습니다.
                      </p>
                    </div>
                  ) : weatherData ? (
                    <WeatherCard
                      weather={weatherData}
                      forecasts={forecastData?.list}
                    />
                  ) : null}

                  <ClinicList
                    clinics={clinics}
                    onClinicClick={onClinicClick}
                    isLoading={isClinicsLoading}
                  />
                </div>
              </div>

              <div
                className={`absolute inset-0 overflow-y-auto p-4 transition-transform duration-300 ease-in-out ${
                  viewMode === "clinic" ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {selectedClinic && (
                  <ClinicDetail
                    clinic={selectedClinic}
                    onBack={onBackToWeather}
                  />
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center text-muted-foreground">
              <SearchIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">
                장소를 검색하거나
                <br />
                현재 위치를 사용해 보세요
              </p>
            </div>
          )}
        </>
      )}

      {tabMode === "favorites" && (
        <div className="h-full p-4 overflow-y-auto">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
              <FavoriteIcon className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm">아직 즐겨찾기가 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="mb-2 text-xs text-muted-foreground">
                최대 6개까지 저장 가능 ({favorites.length}/6)
              </p>
              {favorites.map((favorite) => (
                <FavoriteCard
                  key={favorite.id}
                  favorite={favorite}
                  onEditNickname={onEditNickname}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
