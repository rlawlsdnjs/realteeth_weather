import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Badge } from "../../shared/ui/badge";
import { Thermometer, Wind, Droplets } from "lucide-react";
import type { WeatherData } from "../../shared/types";
import { getWeatherIcon } from "../../shared/lib/weatherUtils";

interface WeatherCardProps {
  weather: WeatherData;
}

export function WeatherCard({ weather }: WeatherCardProps) {
  const currentWeather = weather.weather[0];
  const weatherIcon = getWeatherIcon(currentWeather.id);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>현재 날씨</span>
          <span className="text-4xl">{weatherIcon}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-4xl font-bold">
              {Math.round(weather.main.temp)}°C
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {currentWeather.description}
            </p>
          </div>
          <div className="text-right space-y-1">
            <Badge variant="secondary">
              최고 {Math.round(weather.main.temp_max)}°
            </Badge>
            <Badge variant="outline">
              최저 {Math.round(weather.main.temp_min)}°
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">체감</p>
              <p className="font-medium">
                {Math.round(weather.main.feels_like)}°
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">습도</p>
              <p className="font-medium">{weather.main.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">풍속</p>
              <p className="font-medium">{weather.wind.speed}m/s</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
