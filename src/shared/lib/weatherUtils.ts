export function getWeatherMessage(weatherCode: number, temp: number): string {
  // 극한 기온
  if (temp >= 33) {
    return "폭염이 예상됩니다. 이동 시 충분한 수분 섭취와 휴식을 취하세요.";
  }
  if (temp <= -10) {
    return "한파가 예상됩니다. 이동 시 방한에 유의하세요.";
  }

  // 날씨 코드 기반 메시지
  // Thunderstorm (2xx)
  if (weatherCode >= 200 && weatherCode < 300) {
    return "천둥번개가 예상됩니다. 실외 활동을 자제하고 안전한 곳에 머무르세요.";
  }

  // Drizzle (3xx) or Rain (5xx)
  if (
    (weatherCode >= 300 && weatherCode < 400) ||
    (weatherCode >= 500 && weatherCode < 600)
  ) {
    return "비가 예상됩니다. 우산을 챙기시고 방문 시 주의하세요.";
  }

  // Snow (6xx)
  if (weatherCode >= 600 && weatherCode < 700) {
    return "눈이 예상됩니다. 도로가 미끄러울 수 있으니 이동 시 주의하세요.";
  }

  // Atmosphere (7xx) - Mist, Fog, etc
  if (weatherCode >= 700 && weatherCode < 800) {
    return "시야가 좋지 않을 수 있습니다. 이동 시 주의하세요.";
  }

  // Clear (800)
  if (weatherCode === 800) {
    return "날씨가 맑습니다. 오늘 예약하러 가셔도 좋겠는데요?";
  }

  // Clouds (80x)
  if (weatherCode > 800 && weatherCode < 900) {
    if (temp >= 15 && temp <= 25) {
      return "쾌적한 날씨입니다. 방문하기 좋은 날이에요!";
    }
    return "구름이 많지만 나쁘지 않은 날씨입니다.";
  }

  return "날씨를 확인하시고 방문 계획을 세우세요.";
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
