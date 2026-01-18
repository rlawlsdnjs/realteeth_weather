import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Thermometer, Wind, Droplets, Clock } from "lucide-react";
import type { WeatherData, HourlyForecast } from "../../shared/types";
import { getWeatherIconInfo } from "../../shared/lib/weatherUtils";

interface WeatherCardProps {
  weather: WeatherData;
  forecasts?: HourlyForecast[];
  showDetails?: boolean;
}

export function WeatherCard({
  weather,
  forecasts,
  showDetails = false,
}: WeatherCardProps) {
  const currentWeather = weather.weather[0];
  const weatherIconInfo = getWeatherIconInfo(currentWeather.id);
  const WeatherIcon = weatherIconInfo.icon;
  const next24Hours = forecasts?.slice(0, 8) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>현재 날씨</span>
          <div
            className={`p-2 rounded-full border-2 ${weatherIconInfo.borderColor} bg-white`}
          >
            <WeatherIcon className={`w-8 h-8 ${weatherIconInfo.color}`} />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {currentWeather.description}
            </p>
          </div>
          <div className="space-y-1 text-right">
            <Badge variant="secondary">
              최고 {Math.round(weather.main.temp_max)}°
            </Badge>
            <Badge variant="outline">
              최저 {Math.round(weather.main.temp_min)}°
            </Badge>
          </div>
        </div>

        {showDetails && (
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">체감</p>
                <p className="font-medium">
                  {Math.round(weather.main.feels_like)}°
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">습도</p>
                <p className="font-medium">{weather.main.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">풍속</p>
                <p className="font-medium">{weather.wind.speed}m/s</p>
              </div>
            </div>
          </div>
        )}

        {forecasts && forecasts.length > 0 && (
          <div className="pt-4 border-t">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-medium">시간대별 기온</h3>
            </div>
            <div className="flex gap-4 pb-2 overflow-x-auto">
              {next24Hours.map((forecast, index) => {
                const time = new Date(forecast.dt * 1000);
                const forecastIconInfo = getWeatherIconInfo(
                  forecast.weather[0].id,
                );
                const ForecastIcon = forecastIconInfo.icon;

                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-2 min-w-[60px]"
                  >
                    <p className="text-xs text-muted-foreground">
                      {time.getHours()}시
                    </p>
                    <div
                      className={`p-1.5 rounded-full border ${forecastIconInfo.borderColor} bg-white`}
                    >
                      <ForecastIcon
                        className={`w-5 h-5 ${forecastIconInfo.color}`}
                      />
                    </div>
                    <p className="font-medium">
                      {Math.round(forecast.main.temp)}°
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
