import { Star } from "lucide-react";
import { WeatherCard } from "../weather/weather-card";
import { ClinicList } from "../clinic/clinic-list";
import { ClinicDetail } from "../clinic/clinic-detail";
import {
  WeatherSkeleton,
  ClinicListSkeleton,
} from "../../shared/ui/weather-skeleton";
import type {
  Location,
  Clinic,
  WeatherData,
  ForecastData,
} from "../../shared/types";

interface MobileInfoPanelProps {
  panelHeightVh: number;
  isDragging: boolean;
  viewMode: "weather" | "clinic";
  mapLocation: Location;
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
  onToggleFavorite: () => void;
  onClinicClick: (clinic: Clinic) => void;
  onBackToWeather: () => void;
  onDragHandlers: {
    onTouchStart: (e: React.TouchEvent) => void;
    onTouchMove: (e: React.TouchEvent) => void;
    onTouchEnd: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
  };
}

export function MobileInfoPanel({
  panelHeightVh,
  isDragging,
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
  onToggleFavorite,
  onClinicClick,
  onBackToWeather,
  onDragHandlers,
}: MobileInfoPanelProps) {
  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-40 bg-white rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.15)]"
      style={{
        height: `${panelHeightVh}vh`,
        transition: isDragging ? "none" : "height 0.2s ease-out",
      }}
    >
      {/* 드래그 핸들 */}
      <div
        className="flex justify-center py-3 cursor-grab active:cursor-grabbing touch-none"
        onTouchStart={onDragHandlers.onTouchStart}
        onTouchMove={onDragHandlers.onTouchMove}
        onTouchEnd={onDragHandlers.onTouchEnd}
        onMouseDown={onDragHandlers.onMouseDown}
      >
        <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
      </div>

      {/* 패널 헤더 */}
      <div className="px-4 pb-3 bg-white border-b">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-semibold truncate">
              {mapLocation.id === "current-location"
                ? "현재 위치"
                : mapLocation.name}
            </h2>
            <p className="text-sm truncate text-slate-500">
              {mapLocation.id === "current-location"
                ? currentLocationAddress || "주소를 불러오는 중..."
                : mapLocation.address}
            </p>
          </div>
          <button
            onClick={onToggleFavorite}
            className="p-2 rounded-lg hover:bg-slate-100 shrink-0"
          >
            <Star
              className={`h-6 w-6 ${
                isLocationFavorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-slate-400"
              }`}
            />
          </button>
        </div>
      </div>

      {/* 패널 콘텐츠 */}
      <div
        className="flex-1 overflow-y-auto bg-slate-50"
        style={{ height: `calc(${panelHeightVh}vh - 100px)` }}
      >
        <div className="relative">
          {/* 날씨 뷰 */}
          <div
            className={`p-4 transition-transform duration-300 ${
              viewMode === "weather" ? "block" : "hidden"
            }`}
          >
            <div className="pb-4 space-y-4">
              {isDataLoading && (
                <div className="space-y-4">
                  <WeatherSkeleton />
                  <ClinicListSkeleton />
                </div>
              )}

              {!isWeatherLoading && isWeatherError && (
                <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                  <p className="text-sm text-center text-red-600">
                    날씨 정보를 불러올 수 없습니다.
                  </p>
                </div>
              )}

              {weatherData && (
                <WeatherCard
                  weather={weatherData}
                  forecasts={forecastData?.list}
                />
              )}
              {!isClinicsLoading && (
                <ClinicList clinics={clinics} onClinicClick={onClinicClick} />
              )}
            </div>
          </div>

          {/* 치과 상세 뷰 */}
          <div
            className={`p-4 transition-transform duration-300 ${
              viewMode === "clinic" ? "block" : "hidden"
            }`}
          >
            {selectedClinic && (
              <ClinicDetail clinic={selectedClinic} onBack={onBackToWeather} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
