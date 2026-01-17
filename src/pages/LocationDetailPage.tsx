import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Star } from "lucide-react";
import { Button } from "../shared/ui/button";
import { Spinner } from "../shared/ui/spinner";
import { ErrorFallback } from "../shared/ui/error-fallback";
import { WeatherCard } from "../widgets/weather/weather-card";
import { HourlyForecastCard } from "../widgets/weather/hourly-forecast-card";
import { WeatherMessage } from "../widgets/weather/weather-message";
import { ClinicList } from "../widgets/clinic/clinic-list";
import { KakaoMap } from "../widgets/map/kakao-map";
import { useWeather, useHourlyForecast } from "../features/weather/use-weather";
import { useClinics } from "../features/clinic/use-clinics";
import { useFavoritesStore } from "../shared/store/useFavoritesStore";
import type { Location } from "../shared/types";

export function LocationDetailPage() {
  const locationState = useLocation();
  const navigate = useNavigate();

  const location = locationState.state?.location as Location | undefined;

  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const getFavorite = useFavoritesStore((state) => state.getFavorite);

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useWeather(location?.lat ?? 0, location?.lon ?? 0, !!location);

  const { data: forecast, isLoading: forecastLoading } = useHourlyForecast(
    location?.lat ?? 0,
    location?.lon ?? 0,
    !!location
  );

  const { data: clinics = [], isLoading: clinicsLoading } = useClinics(
    location?.lat ?? 0,
    location?.lon ?? 0,
    !!location
  );

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">장소 정보가 없습니다</p>
          <Button onClick={() => navigate("/")}>검색하러 가기</Button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite(location.id)) {
      const fav = getFavorite(location.id);
      if (
        fav &&
        confirm(`"${fav.nickname}"를 즐겨찾기에서 삭제하시겠습니까?`)
      ) {
        removeFavorite(fav.id);
      }
    } else {
      if (favorites.length >= 6) {
        alert("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
        return;
      }
      const nickname = prompt("즐겨찾기 별칭을 입력하세요", location.name);
      if (nickname) {
        addFavorite({ location, nickname });
      }
    }
  };

  const isCurrentlyFavorite = isFavorite(location.id);

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between max-w-4xl px-4 py-4 mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")}>
            <ArrowLeft className="w-5 h-5 mr-2" />
            검색으로 돌아가기
          </Button>
          <Button
            variant={isCurrentlyFavorite ? "default" : "outline"}
            onClick={handleToggleFavorite}
          >
            <Star
              className={`h-4 w-4 mr-2 ${
                isCurrentlyFavorite ? "fill-current" : ""
              }`}
            />
            {isCurrentlyFavorite ? "즐겨찾기 삭제" : "즐겨찾기 추가"}
          </Button>
        </div>
      </div>

      <div className="max-w-4xl p-4 mx-auto space-y-6 md:p-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">{location.name}</h1>
          <p className="text-muted-foreground">{location.address}</p>
        </div>

        {weatherLoading ? (
          <Spinner />
        ) : weatherError ? (
          <ErrorFallback error={weatherError as Error} />
        ) : weather ? (
          <>
            <WeatherMessage weather={weather} />
            <WeatherCard weather={weather} />
          </>
        ) : (
          <p className="py-8 text-center text-muted-foreground">
            해당 장소의 날씨 정보가 제공되지 않습니다.
          </p>
        )}

        {forecastLoading ? (
          <Spinner size="sm" />
        ) : forecast && forecast.list.length > 0 ? (
          <HourlyForecastCard forecasts={forecast.list} />
        ) : null}

        <div>
          <h2 className="mb-4 text-2xl font-bold">지도</h2>
          <KakaoMap location={location} clinics={clinics} />
        </div>

        <div>
          <h2 className="mb-4 text-2xl font-bold">주변 치과</h2>
          {clinicsLoading ? <Spinner /> : <ClinicList clinics={clinics} />}
        </div>
      </div>
    </div>
  );
}
