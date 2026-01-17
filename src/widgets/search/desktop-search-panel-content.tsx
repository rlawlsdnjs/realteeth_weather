import { Loader2, Star, Search as SearchIcon } from "lucide-react";
import { WeatherCard } from "../weather/weather-card";
import { HourlyForecastCard } from "../weather/hourly-forecast-card";
import { ClinicList } from "../clinic/clinic-list";
import { ClinicDetail } from "../clinic/clinic-detail";
import { FavoriteCard } from "../favorites/favorite-card";
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
  isDataLoading: boolean;
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
  isDataLoading,
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
                            ? currentLocationAddress || "주소를 불러오는 중..."
                            : mapLocation.address}
                        </p>
                      </div>
                      <button
                        onClick={onToggleFavorite}
                        className="p-2 transition-colors rounded-lg hover:bg-slate-100 shrink-0"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            isLocationFavorite
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-muted-foreground"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {isDataLoading && (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="w-6 h-6 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">
                        데이터를 불러오는 중...
                      </span>
                    </div>
                  )}

                  {!isWeatherLoading && isWeatherError && (
                    <div className="p-4 border rounded-lg bg-destructive/10 border-destructive/20">
                      <p className="text-sm text-center text-destructive">
                        해당 장소의 정보가 제공되지 않습니다.
                      </p>
                    </div>
                  )}

                  {weatherData && <WeatherCard weather={weatherData} />}
                  {forecastData && (
                    <HourlyForecastCard forecasts={forecastData.list} />
                  )}
                  {!isClinicsLoading && (
                    <ClinicList
                      clinics={clinics}
                      onClinicClick={onClinicClick}
                    />
                  )}
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
              <Star className="w-12 h-12 mb-4 opacity-20" />
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
