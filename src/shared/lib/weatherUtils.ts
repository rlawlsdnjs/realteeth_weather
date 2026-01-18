export function getWeatherMessage(weatherCode: number, temp: number): string {
  // 극한 기온
  if (temp >= 33) {
    return "폭염이 예상됩니다. 이동 중 수분 섭취에 유의해 주세요.";
  }

  if (temp <= -10) {
    return "이가 딱딱 떨릴 만큼 추운 날씨입니다. 따뜻하게 챙겨 입고 방문하세요.";
  }

  // Thunderstorm (2xx)
  if (weatherCode >= 200 && weatherCode < 300) {
    return "천둥번개가 예상됩니다. 오늘은 무리한 외출을 피하시는 것이 좋겠습니다.";
  }

  // Drizzle (3xx) or Rain (5xx)
  if (
    (weatherCode >= 300 && weatherCode < 400) ||
    (weatherCode >= 500 && weatherCode < 600)
  ) {
    return "비가 예상됩니다. 미끄러울 수 있으니 이동 시 주의해 주세요.";
  }

  // Snow (6xx)
  if (weatherCode >= 600 && weatherCode < 700) {
    return "눈이 예상됩니다. 도로가 미끄러울 수 있으니 천천히 이동해 주세요.";
  }

  // Atmosphere (7xx)
  if (weatherCode >= 700 && weatherCode < 800) {
    return "시야가 좋지 않을 수 있는 날씨입니다. 이동 시 주의해 주세요.";
  }

  // Clear (800)
  if (weatherCode === 800) {
    return "날씨가 맑습니다. 오늘 치아 상태 점검하러 방문하시기 좋은 날이에요.";
  }

  // Clouds (80x)
  if (weatherCode > 800 && weatherCode < 900) {
    if (temp >= 15 && temp <= 25) {
      return "선선하고 쾌적한 날씨입니다. 부담 없이 방문하기 좋아요.";
    }
    return "구름이 많지만 이동하기에는 무난한 날씨입니다.";
  }

  return "날씨를 확인하시고 방문 일정을 계획해 주세요.";
}

import {
  CloudLightning,
  CloudRain,
  Snowflake,
  CloudFog,
  Sun,
  Cloud,
  CloudSun,
  type LucideIcon,
} from "lucide-react";

export interface WeatherIconInfo {
  icon: LucideIcon;
  color: string;
  borderColor: string;
}

export function getWeatherIconInfo(weatherCode: number): WeatherIconInfo {
  // Thunderstorm (2xx)
  if (weatherCode >= 200 && weatherCode < 300) {
    return {
      icon: CloudLightning,
      color: "text-purple-500",
      borderColor: "border-purple-300",
    };
  }
  // Drizzle (3xx) or Rain (5xx)
  if (
    (weatherCode >= 300 && weatherCode < 400) ||
    (weatherCode >= 500 && weatherCode < 600)
  ) {
    return {
      icon: CloudRain,
      color: "text-blue-500",
      borderColor: "border-blue-300",
    };
  }
  // Snow (6xx)
  if (weatherCode >= 600 && weatherCode < 700) {
    return {
      icon: Snowflake,
      color: "text-cyan-400",
      borderColor: "border-cyan-300",
    };
  }
  // Atmosphere (7xx) - Mist, Fog
  if (weatherCode >= 700 && weatherCode < 800) {
    return {
      icon: CloudFog,
      color: "text-gray-400",
      borderColor: "border-gray-300",
    };
  }
  // Clear (800)
  if (weatherCode === 800) {
    return {
      icon: Sun,
      color: "text-yellow-500",
      borderColor: "border-yellow-300",
    };
  }
  // Clouds (80x)
  if (weatherCode > 800 && weatherCode < 900) {
    return {
      icon: Cloud,
      color: "text-gray-500",
      borderColor: "border-gray-300",
    };
  }
  // Default
  return {
    icon: CloudSun,
    color: "text-orange-400",
    borderColor: "border-orange-300",
  };
}
