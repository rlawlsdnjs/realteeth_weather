import { useEffect, useRef, useCallback } from "react";
import { Plus, Minus, Loader2, LocateFixedIcon } from "lucide-react";
import type { Location, Clinic } from "../../shared/types";

declare global {
  interface Window {
    kakao: KakaoNamespace;
  }
}

/* ================= 타입 ================= */

interface KakaoLatLng {
  getLat(): number;
  getLng(): number;
}

interface KakaoPoint {
  x: number;
  y: number;
}

interface KakaoProjection {
  pointFromCoords(latlng: KakaoLatLng): KakaoPoint;
  coordsFromPoint(point: KakaoPoint): KakaoLatLng;
}

interface KakaoMap {
  setCenter(latlng: KakaoLatLng): void;
  getCenter(): KakaoLatLng;
  setLevel(level: number): void;
  getLevel(): number;
  getProjection(): KakaoProjection;
  panTo(latlng: KakaoLatLng): void;
}

interface KakaoMarker {
  setMap(map: KakaoMap | null): void;
  getPosition(): KakaoLatLng;
}

interface KakaoInfoWindow {
  open(map: KakaoMap, marker: KakaoMarker): void;
  close(): void;
}

interface KakaoMaps {
  load(callback: () => void): void;
  LatLng: new (lat: number, lng: number) => KakaoLatLng;
  Map: new (
    container: HTMLElement,
    options: { center: KakaoLatLng; level: number },
  ) => KakaoMap;
  Marker: new (options: {
    position: KakaoLatLng;
    map: KakaoMap;
    image?: KakaoMarkerImage;
  }) => KakaoMarker;
  MarkerImage: new (src: string, size: KakaoSize) => KakaoMarkerImage;
  Size: new (width: number, height: number) => KakaoSize;
  InfoWindow: new (options: { content: string }) => KakaoInfoWindow;
  event: {
    addListener(
      target: KakaoMarker | KakaoMap,
      type: string,
      handler: () => void,
    ): void;
  };
}

type KakaoMarkerImage = Record<string, unknown>;
type KakaoSize = Record<string, unknown>;

interface KakaoNamespace {
  maps: KakaoMaps;
}

/* ================= Props ================= */

interface KakaoMapProps {
  location: Location | null;
  clinics?: Clinic[];
  className?: string;
  onMapClick?: (lat: number, lon: number) => void;
  onClinicMarkerClick?: (clinic: Clinic) => void;
  onCurrentLocationClick?: () => void;
  isGeoLoading?: boolean;
  bottomPadding?: number; // 하단 패널 높이 (vh)
  topPaddingPx?: number; // 검색창 높이 (px)
}

/* ================= Component ================= */

export function KakaoMap({
  location,
  clinics = [],
  className = "",
  onMapClick,
  onClinicMarkerClick,
  onCurrentLocationClick,
  isGeoLoading = false,
  bottomPadding = 0,
  topPaddingPx = 0,
}: KakaoMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<KakaoMap | null>(null);
  const markersRef = useRef<KakaoMarker[]>([]);
  const scriptLoadedRef = useRef(false);

  /* ---------- 마커 제거 ---------- */

  const clearMarkers = useCallback(() => {
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
  }, []);

  /* ---------- 지도 초기화 ---------- */

  const initializeMap = useCallback(() => {
    if (!mapRef.current || !window.kakao?.maps) return;
    if (mapInstanceRef.current) return;

    const map = new window.kakao.maps.Map(mapRef.current, {
      center: new window.kakao.maps.LatLng(37.5665, 126.978),
      level: 5,
    });

    mapInstanceRef.current = map;

    if (onMapClick) {
      window.kakao.maps.event.addListener(map, "click", () => {
        const center = map.getCenter();
        onMapClick(center.getLat(), center.getLng());
      });
    }
  }, [onMapClick]);

  /* ---------- 마커 & 중앙 보정 ---------- */

  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.kakao?.maps) return;

    clearMarkers();
    const map = mapInstanceRef.current;

    if (location) {
      const isMobile = window.innerWidth < 768;

      let centerLatLng = new window.kakao.maps.LatLng(
        location.lat,
        location.lon,
      );

      if (isMobile && (bottomPadding > 0 || topPaddingPx > 0)) {
        const projection = map.getProjection();
        const point = projection.pointFromCoords(centerLatLng);

        const screenHeight = window.innerHeight;
        const bottomPx = (screenHeight * bottomPadding) / 100;

        //  상단 패딩과 하단 패딩의 중간 지점이 중심이 되도록 보정
        const offsetY = bottomPx / 2 - topPaddingPx / 2;
        point.y += offsetY;

        centerLatLng = projection.coordsFromPoint(point);
      }

      map.setCenter(centerLatLng);

      // 현재 위치 마커 (실제 좌표)
      const mainMarker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(location.lat, location.lon),
        map,
      });

      markersRef.current.push(mainMarker);
    }
    const toothPinSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 48">
        <path
          d="M20 0C9 0 0 9 0 20c0 13 20 28 20 28s20-15 20-28C40 9 31 0 20 0z"
          fill="#ff6f61"
        />
        <path
          d="M20 10c-4 0-7 3-7 7 0 2.5 1 4 1.5 5.5.5 1.5.5 5.5 2.5 6.5 1.5.8 2.5-1 3-3 .5 2 1.5 3.8 3 3 2-1 2-5 2.5-6.5.5-1.5 1.5-3 1.5-5.5 0-4-3-7-7-7z"
          fill="#fff"
        />
      </svg>
      `;
    const toothMarkerImage = new window.kakao.maps.MarkerImage(
      `data:image/svg+xml;utf8,${encodeURIComponent(toothPinSvg)}`,
      new window.kakao.maps.Size(34, 42), // ⬅ SVG 크기와 동일하게
    );
    // 치과 마커
    clinics.forEach((clinic) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(clinic.lat, clinic.lon),
        map,
        image: toothMarkerImage,
      });

      markersRef.current.push(marker);

      window.kakao.maps.event.addListener(marker, "click", () => {
        if (onClinicMarkerClick) onClinicMarkerClick(clinic);
      });
    });
  }, [
    location,
    clinics,
    clearMarkers,
    bottomPadding,
    topPaddingPx,
    onClinicMarkerClick,
  ]);

  /* ---------- 스크립트 로드 ---------- */

  useEffect(() => {
    if (scriptLoadedRef.current && window.kakao?.maps) {
      initializeMap();
      updateMarkers();
      return;
    }

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      scriptLoadedRef.current = true;
      window.kakao.maps.load(() => {
        initializeMap();
        updateMarkers();
      });
    };
  }, [initializeMap, updateMarkers]);

  useEffect(() => {
    if (scriptLoadedRef.current) updateMarkers();
  }, [location, clinics, updateMarkers]);

  /* ---------- 줌 ---------- */

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setLevel(mapInstanceRef.current.getLevel() - 1);
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.setLevel(mapInstanceRef.current.getLevel() + 1);
  };

  /* ---------- UI ---------- */

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={mapRef} className="w-full h-full" />

      {/* 모바일 컨트롤 (가로 정렬) */}
      <div className="md:hidden absolute top-16 right-3 flex gap-2 z-[1000]">
        <div className="flex border rounded-lg shadow bg-white/90 border-slate-200">
          <button
            onClick={handleZoomIn}
            className="p-2 border-r border-slate-200"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-2">
            <Minus className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={onCurrentLocationClick}
          disabled={isGeoLoading}
          className="p-2 border rounded-lg shadow bg-white/90 border-slate-200"
        >
          {isGeoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixedIcon className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* 데스크톱 컨트롤 (세로 정렬, 우측 하단) */}
      <div className="hidden md:flex absolute bottom-6 right-6 flex-col gap-2 z-[1000]">
        <div className="flex flex-col border rounded-lg shadow bg-white/90 border-slate-200">
          <button
            onClick={handleZoomIn}
            className="p-2 border-b border-slate-200"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button onClick={handleZoomOut} className="p-2">
            <Minus className="w-4 h-4" />
          </button>
        </div>
        <button
          onClick={onCurrentLocationClick}
          disabled={isGeoLoading}
          className="p-2 border rounded-lg shadow bg-white/90 border-slate-200 hover:bg-white disabled:opacity-50"
        >
          {isGeoLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <LocateFixedIcon className="w-4 h-4" />
          )}
        </button>
      </div>
    </div>
  );
}
