import { useQuery } from "@tanstack/react-query";
import { weatherApi } from "../../shared/api";
import type { WeatherData, ForecastData } from "../../shared/types";

export function useWeather(lat: number, lon: number, enabled = true) {
  return useQuery<WeatherData>({
    queryKey: ["weather", lat, lon],
    queryFn: () => weatherApi.getCurrentWeather(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 1000 * 60 * 10, // 10분
  });
}

export function useHourlyForecast(lat: number, lon: number, enabled = true) {
  return useQuery<ForecastData>({
    queryKey: ["forecast", lat, lon],
    queryFn: () => weatherApi.getHourlyForecast(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 1000 * 60 * 30, // 30분
  });
}
