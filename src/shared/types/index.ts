// Weather types
export interface WeatherData {
  coord: {
    lat: number;
    lon: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  wind: {
    speed: number;
    deg: number;
  };
  dt: number;
  name: string;
}

export interface HourlyForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
}

export interface ForecastData {
  list: HourlyForecast[];
}

// Location types
export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
}

export interface KakaoPlace {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name: string;
  x: string; // longitude
  y: string; // latitude
  category_name: string;
}

// Clinic types
export interface Clinic {
  id: string;
  name: string;
  address: string;
  roadAddress?: string;
  phone?: string;
  distance: number;
  lat: number;
  lon: number;
}

// Favorite types
export interface Favorite {
  id: string;
  location: Location;
  nickname: string;
  createdAt: number;
}

// District types
export type District = string;
