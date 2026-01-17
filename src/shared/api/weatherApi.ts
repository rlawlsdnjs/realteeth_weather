import axios from "axios";
import type { WeatherData, ForecastData } from "../types";

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const weatherApi = {
  async getCurrentWeather(lat: number, lon: number): Promise<WeatherData> {
    const { data } = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });
    return data;
  },

  async getHourlyForecast(lat: number, lon: number): Promise<ForecastData> {
    const { data } = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });
    return data;
  },
};
