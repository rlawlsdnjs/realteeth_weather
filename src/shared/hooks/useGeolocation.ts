import { useState, useEffect, useCallback } from "react";
import type { Location } from "../types";

interface GeolocationState {
  location: Location | null;
  isLoading: boolean;
  error: string | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: null,
    isLoading: true,
    error: null,
  });

  const getCurrentPosition = useCallback(() => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setState({
        location: null,
        isLoading: false,
        error: "브라우저가 위치 서비스를 지원하지 않습니다.",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setState({
          location: {
            id: "current-location",
            name: "현재 위치",
            address: "현재 위치",
            lat: latitude,
            lon: longitude,
          },
          isLoading: false,
          error: null,
        });
      },
      (error) => {
        let errorMessage = "위치를 가져올 수 없습니다.";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 접근 권한이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 요청 시간이 초과되었습니다.";
            break;
        }
        setState({
          location: null,
          isLoading: false,
          error: errorMessage,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    ...state,
    refresh: getCurrentPosition,
  };
}
