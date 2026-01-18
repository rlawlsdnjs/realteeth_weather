import { Info } from "lucide-react";
import { Card, CardContent } from "../../shared/ui/card";
import type { WeatherData } from "../../shared/types";
import { getWeatherMessage } from "../../shared/lib/weatherUtils";

interface WeatherMessageProps {
  weather: WeatherData;
}

export function WeatherMessage({ weather }: WeatherMessageProps) {
  const weatherCode = weather.weather[0].id;
  const temp = weather.main.temp;
  const message = getWeatherMessage(weatherCode, temp);

  return (
    <Card className="mb-0 border-blue-200 bg-blue-50">
      <CardContent className="flex gap-3 p-4">
        <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-900">{message}</p>
      </CardContent>
    </Card>
  );
}
