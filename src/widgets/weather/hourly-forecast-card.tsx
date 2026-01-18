import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { Clock } from "lucide-react";
import type { HourlyForecast } from "../../shared/types";
import { getWeatherIconInfo } from "../../shared/lib/weatherUtils";

interface HourlyForecastCardProps {
  forecasts: HourlyForecast[];
}

export function HourlyForecastCard({ forecasts }: HourlyForecastCardProps) {
  // 다음 24시간(8개 항목, 3시간 간격)
  const next24Hours = forecasts.slice(0, 8);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          시간대별 기온
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {next24Hours.map((forecast, index) => {
            const time = new Date(forecast.dt * 1000);
            const { icon: Icon } = getWeatherIconInfo(forecast.weather[0].id);

            return (
              <div
                key={index}
                className="flex flex-col items-center gap-2 min-w-[60px]"
              >
                <p className="text-xs text-muted-foreground">
                  {time.getHours()}시
                </p>
                <Icon className="w-6 h-6" />
                <p className="font-medium">{Math.round(forecast.main.temp)}°</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
