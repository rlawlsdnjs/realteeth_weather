import { useState, useEffect, useRef, useCallback } from "react";
import { Search as SearchIcon } from "lucide-react";
import { useSearch } from "../features/search/use-search";
import { useWeather, useHourlyForecast } from "../features/weather/use-weather";
import { useClinics } from "../features/clinic/use-clinics";
import { kakaoApi } from "../shared/api";
import { KakaoMap } from "../widgets/map/kakao-map";
import { useGeolocation } from "../shared/hooks/useGeolocation";
import { useFavoritesStore } from "../shared/store/useFavoritesStore";
import { ConfirmModal, InputModal } from "../shared/ui";
import {
  DesktopSearchPanelHeader,
  DesktopSearchPanelContent,
  MobileSearchMode,
  MobileInfoPanel,
} from "../widgets/search";
import type { Location, KakaoPlace, District, Clinic } from "../shared/types";
import type { SearchResultItem } from "../features/search/search-results";

type ViewMode = "weather" | "clinic";
type TabMode = "search" | "favorites";

export function SearchPage() {
  const {
    searchQuery,
    handleInputChange,
    triggerSearch,
    results,
    convertToLocation,
    clearSearch,
    isLoading: isSearching,
  } = useSearch();
  const [, setShowResults] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [viewMode, setViewMode] = useState<ViewMode>("weather");
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [tabMode, setTabMode] = useState<TabMode>("search");

  // 모바일에서 검색 모드 (전체화면 검색)
  const [isMobileSearchMode, setIsMobileSearchMode] = useState(false);

  // 현재 위치 주소
  const [currentLocationAddress, setCurrentLocationAddress] =
    useState<string>("");

  // 모바일 바텀시트 높이 (vh 단위, 20 ~ 85)
  const [panelHeightVh, setPanelHeightVh] = useState(55);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartY = useRef(0);
  const dragStartHeight = useRef(55);

  // 모달 상태
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    favoriteId: string;
    nickname: string;
  }>({ isOpen: false, favoriteId: "", nickname: "" });

  const [inputModal, setInputModal] = useState<{
    isOpen: boolean;
    location: Location | null;
  }>({ isOpen: false, location: null });

  const [limitModal, setLimitModal] = useState(false);
  const [errorModal, setErrorModal] = useState<{
    isOpen: boolean;
    message: string;
  }>({ isOpen: false, message: "" });

  // 바텀시트 드래그 핸들러
  const handleDragStart = useCallback(
    (clientY: number) => {
      setIsDragging(true);
      dragStartY.current = clientY;
      dragStartHeight.current = panelHeightVh;
    },
    [panelHeightVh],
  );

  const handleDragMove = useCallback(
    (clientY: number) => {
      if (!isDragging) return;

      const deltaY = dragStartY.current - clientY;
      const deltaVh = (deltaY / window.innerHeight) * 100;
      const newHeight = Math.min(
        85,
        Math.max(20, dragStartHeight.current + deltaVh),
      );
      setPanelHeightVh(newHeight);
    },
    [isDragging],
  );

  const handleDragEnd = useCallback(() => {
    setIsDragging(false);
    // 스냅 포인트: 20%, 55%, 85%
    if (panelHeightVh < 35) {
      setPanelHeightVh(20);
    } else if (panelHeightVh < 70) {
      setPanelHeightVh(55);
    } else {
      setPanelHeightVh(85);
    }
  }, [panelHeightVh]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handleDragStart(e.touches[0].clientY);
    },
    [handleDragStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      handleDragMove(e.touches[0].clientY);
    },
    [handleDragMove],
  );

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleDragStart(e.clientY);
    },
    [handleDragStart],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      handleDragMove(e.clientY);
    };
    const handleMouseUp = () => {
      handleDragEnd();
    };

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleDragMove, handleDragEnd]);

  const { location: currentLocation, isLoading: isGeoLoading } =
    useGeolocation();

  // 즐겨찾기 스토어
  const {
    isFavoriteByAddress,
    getFavoriteByAddress,
    addFavorite,
    removeFavorite,
    favorites,
    updateNickname,
  } = useFavoritesStore();

  // 현재 위치 주소 가져오기
  useEffect(() => {
    if (currentLocation && currentLocation.id === "current-location") {
      kakaoApi
        .reverseGeocode(currentLocation.lat, currentLocation.lon)
        .then((result) => {
          if (result) {
            setCurrentLocationAddress(result.address);
          }
        });
    }
  }, [currentLocation]);

  // 현재 위치 또는 선택된 위치를 지도에 표시
  const mapLocation = selectedLocation ?? currentLocation;

  // 날씨 및 치과 데이터 가져오기
  const {
    data: weatherData,
    isLoading: isWeatherLoading,
    isError: isWeatherError,
  } = useWeather(mapLocation?.lat ?? 0, mapLocation?.lon ?? 0, !!mapLocation);

  const { data: forecastData } = useHourlyForecast(
    mapLocation?.lat ?? 0,
    mapLocation?.lon ?? 0,
    !!mapLocation,
  );

  const { data: clinics = [], isLoading: isClinicsLoading } = useClinics(
    mapLocation?.lat ?? 0,
    mapLocation?.lon ?? 0,
    !!mapLocation,
  );

  const handleSelectResult = async (item: SearchResultItem) => {
    let selectedName = "";

    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      const location = convertToLocation(place);
      setSelectedLocation(location);
      selectedName = place.place_name;
    } else if (item.type === "favorite") {
      const location = item.data as Location;
      setSelectedLocation(location);
      selectedName = item.favoriteNickname || location.name;
    } else {
      const district = item.data as District;
      const places = await kakaoApi.searchPlace(district);
      if (places.length > 0) {
        const location = convertToLocation(places[0]);
        setSelectedLocation(location);
      }
      selectedName = district;
    }

    // 검색창에 선택한 값 반영
    handleInputChange(selectedName);
    setShowResults(false);
    setViewMode("weather");
    setSelectedClinic(null);
    setIsMobileSearchMode(false); // 검색 모드 종료
  };

  const handleUseCurrentLocation = () => {
    if (currentLocation) {
      // selectedLocation을 currentLocation으로 설정하여 지도 이동
      setSelectedLocation({
        ...currentLocation,
        id: "current-location",
        name: "현재 위치",
      });
      setViewMode("weather");
      setSelectedClinic(null);
      setIsMobileSearchMode(false);
    }
  };

  const handleToggleFavorite = () => {
    if (!mapLocation) return;

    // 주소 가져오기 (현재 위치인 경우 currentLocationAddress 사용)
    const locationAddress =
      mapLocation.id === "current-location"
        ? currentLocationAddress
        : mapLocation.address;

    // 주소 기반으로 즐겨찾기 체크
    const existingFavorite = getFavoriteByAddress(locationAddress);

    if (existingFavorite) {
      // 이미 즐겨찾기에 있으면 삭제 다이얼로그 표시
      setConfirmModal({
        isOpen: true,
        favoriteId: existingFavorite.id,
        nickname: existingFavorite.nickname,
      });
    } else {
      // 새로 추가
      if (favorites.length >= 6) {
        setLimitModal(true);
        return;
      }

      const locationToAdd: Location =
        mapLocation.id === "current-location"
          ? {
              ...mapLocation,
              id: `current-${Date.now()}`,
              name: currentLocationAddress || "현재 위치",
              address: currentLocationAddress || "현재 위치",
            }
          : mapLocation;

      setInputModal({ isOpen: true, location: locationToAdd });
    }
  };

  const handleConfirmRemove = () => {
    if (confirmModal.favoriteId) {
      removeFavorite(confirmModal.favoriteId);
    }
  };

  const handleAddFavorite = (nickname: string) => {
    if (inputModal.location) {
      try {
        addFavorite({ location: inputModal.location, nickname });
      } catch (error) {
        if (error instanceof Error) {
          setErrorModal({ isOpen: true, message: error.message });
        }
      }
    }
  };

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
    setViewMode("clinic");
  };

  const handleBackToWeather = () => {
    setViewMode("weather");
    setSelectedClinic(null);
  };

  const [editModal, setEditModal] = useState<{
    isOpen: boolean;
    favoriteId: string;
    currentNickname: string;
  }>({ isOpen: false, favoriteId: "", currentNickname: "" });

  const handleEditNickname = (id: string) => {
    const favorite = favorites.find((f) => f.id === id);
    if (favorite) {
      setEditModal({
        isOpen: true,
        favoriteId: id,
        currentNickname: favorite.nickname,
      });
    }
  };

  const handleUpdateNickname = (newNickname: string) => {
    if (editModal.favoriteId) {
      updateNickname(editModal.favoriteId, newNickname);
    }
  };

  const handleClearSearch = () => {
    clearSearch();
    setShowResults(false);
  };

  // 모바일 검색 결과에서 즐겨찾기 토글
  const handleMobileResultFavorite = async (item: SearchResultItem) => {
    let location: Location | null = null;

    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      location = {
        id: place.id,
        name: place.place_name,
        address: place.address_name || place.road_address_name,
        lat: parseFloat(place.y),
        lon: parseFloat(place.x),
      };
    } else if (item.type === "district") {
      // 행정구역인 경우 좌표를 먼저 가져와야 함
      const places = await kakaoApi.searchPlace(item.data as District);
      if (places.length > 0) {
        const place = places[0];
        location = {
          id: place.id,
          name: item.data as District,
          address: place.address_name || (item.data as District),
          lat: parseFloat(place.y),
          lon: parseFloat(place.x),
        };
      }
    } else if (item.type === "favorite") {
      // 이미 즐겨찾기인 경우 삭제
      const loc = item.data as Location;
      const fav = getFavoriteByAddress(loc.address);
      if (fav) {
        setConfirmModal({
          isOpen: true,
          favoriteId: fav.id,
          nickname: fav.nickname,
        });
      }
      return;
    }

    if (!location) return;

    // 주소 기반으로 즐겨찾기 체크
    const existingFavorite = getFavoriteByAddress(location.address);
    if (existingFavorite) {
      setConfirmModal({
        isOpen: true,
        favoriteId: existingFavorite.id,
        nickname: existingFavorite.nickname,
      });
    } else {
      if (favorites.length >= 6) {
        setLimitModal(true);
        return;
      }
      setInputModal({ isOpen: true, location });
    }
  };

  // 검색 결과 아이템이 즐겨찾기인지 확인 (주소 기반)
  const isResultFavorite = (item: SearchResultItem): boolean => {
    if (item.type === "favorite") return true;
    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      const address = place.address_name || place.road_address_name;
      return isFavoriteByAddress(address);
    }
    return false;
  };

  // 커맨드 검색 결과에서 즐겨찾기 토글
  const handleCommandFavoriteToggle = async (
    item: SearchResultItem,
    isCurrentlyFavorite: boolean,
  ) => {
    if (isCurrentlyFavorite) {
      // 즐겨찾기 해제 - 주소 기반으로 찾기
      let address = "";
      if (item.type === "favorite") {
        address = (item.data as Location).address;
      } else if (item.type === "place") {
        const place = item.data as KakaoPlace;
        address = place.address_name || place.road_address_name;
      }

      const fav = getFavoriteByAddress(address);
      if (fav) {
        setConfirmModal({
          isOpen: true,
          favoriteId: fav.id,
          nickname: fav.nickname,
        });
      }
    } else {
      // 즐겨찾기 추가
      if (favorites.length >= 6) {
        setLimitModal(true);
        return;
      }

      let location: Location | null = null;

      if (item.type === "place") {
        const place = item.data as KakaoPlace;
        location = {
          id: place.id,
          name: place.place_name,
          address: place.address_name || place.road_address_name,
          lat: parseFloat(place.y),
          lon: parseFloat(place.x),
        };
      } else if (item.type === "district") {
        const places = await kakaoApi.searchPlace(item.data as District);
        if (places.length > 0) {
          const place = places[0];
          location = {
            id: place.id,
            name: item.data as District,
            address: place.address_name || (item.data as District),
            lat: parseFloat(place.y),
            lon: parseFloat(place.x),
          };
        }
      }

      if (location) {
        setInputModal({ isOpen: true, location });
      }
    }
  };

  // 주소 기반으로 즐겨찾기 여부 확인 (현재 위치도 포함)
  const isLocationFavorite = Boolean(
    mapLocation &&
    isFavoriteByAddress(
      mapLocation.id === "current-location"
        ? currentLocationAddress
        : mapLocation.address,
    ),
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100">
      {/* 데스크톱 레이아웃 (md 이상) */}
      <div className="hidden w-full h-full md:flex">
        <div className="w-100 lg:w-112.5 h-full flex flex-col border-r shadow-lg z-10">
          <DesktopSearchPanelHeader
            searchQuery={searchQuery}
            onSearchChange={(value: string) => {
              handleInputChange(value);
            }}
            onSearch={() => {
              triggerSearch();
            }}
            onClear={handleClearSearch}
            results={results}
            onSelectResult={handleSelectResult}
            onToggleFavorite={handleCommandFavoriteToggle}
            tabMode={tabMode}
            onTabChange={setTabMode}
            favoritesCount={favorites.length}
          />
          <DesktopSearchPanelContent
            tabMode={tabMode}
            mapLocation={mapLocation}
            currentLocationAddress={currentLocationAddress}
            isLocationFavorite={isLocationFavorite}
            onToggleFavorite={handleToggleFavorite}
            isWeatherError={isWeatherError}
            isWeatherLoading={isWeatherLoading}
            weatherData={weatherData}
            forecastData={forecastData}
            isClinicsLoading={isClinicsLoading}
            clinics={clinics}
            onClinicClick={handleClinicClick}
            viewMode={viewMode}
            selectedClinic={selectedClinic}
            onBackToWeather={handleBackToWeather}
            favorites={favorites}
            onEditNickname={handleEditNickname}
          />
        </div>

        <div className="relative flex-1 h-full">
          <KakaoMap
            location={mapLocation}
            clinics={clinics}
            className="w-full h-full"
            onClinicMarkerClick={handleClinicClick}
            onCurrentLocationClick={handleUseCurrentLocation}
            isGeoLoading={isGeoLoading}
          />
        </div>
      </div>

      {/* 모바일 레이아웃 (md 미만) */}
      <div className="flex flex-col w-full h-full md:hidden">
        {/* 전체화면 검색 모드 */}
        {isMobileSearchMode ? (
          <MobileSearchMode
            searchQuery={searchQuery}
            onSearchChange={(value: string) => {
              handleInputChange(value);
              setShowResults(true);
            }}
            onSearch={() => {
              triggerSearch();
              setShowResults(true);
            }}
            onClear={handleClearSearch}
            onClose={() => {
              setIsMobileSearchMode(false);
              clearSearch();
            }}
            tabMode={tabMode}
            onTabChange={setTabMode}
            currentLocation={currentLocation}
            currentLocationAddress={currentLocationAddress}
            onUseCurrentLocation={() => {
              if (currentLocation) {
                setSelectedLocation(currentLocation);
                setIsMobileSearchMode(false);
                setViewMode("weather");
              }
            }}
            results={results}
            onSelectResult={handleSelectResult}
            onToggleFavorite={handleMobileResultFavorite}
            isResultFavorite={isResultFavorite}
            favorites={favorites}
            onSelectFavorite={(location: Location) => {
              setSelectedLocation(location);
              setIsMobileSearchMode(false);
              setViewMode("weather");
            }}
            onEditNickname={handleEditNickname}
            isSearching={isSearching}
          />
        ) : (
          /* 지도 + 패널 모드 */
          <div className="relative h-full">
            {/* 지도 영역 - 전체 화면 */}
            <KakaoMap
              location={mapLocation}
              clinics={clinics}
              className="w-full h-full"
              onClinicMarkerClick={handleClinicClick}
              onCurrentLocationClick={handleUseCurrentLocation}
              isGeoLoading={isGeoLoading}
              topPaddingPx={64} // 검색창
              bottomPadding={mapLocation ? panelHeightVh : 0} // 정보 패널
            />

            {/* 검색창 (클릭시 검색 모드로 전환) */}
            <div className="absolute z-50 top-3 left-3 right-3">
              <div
                onClick={() => setIsMobileSearchMode(true)}
                className="flex items-center gap-3 px-4 py-3 transition-colors bg-white rounded-lg shadow-lg cursor-pointer hover:bg-slate-50"
              >
                <SearchIcon className="w-5 h-5 text-slate-400" />
                <span className="text-slate-500">
                  장소, 주소, 즐겨찾기 검색
                </span>
              </div>
            </div>

            {/* 하단: 정보 패널 오버레이 (드래그 가능) */}
            {mapLocation && (
              <MobileInfoPanel
                mapLocation={mapLocation}
                currentLocationAddress={currentLocationAddress}
                panelHeightVh={panelHeightVh}
                isDragging={isDragging}
                onDragHandlers={{
                  onTouchStart: handleTouchStart,
                  onTouchMove: handleTouchMove,
                  onTouchEnd: handleTouchEnd,
                  onMouseDown: handleMouseDown,
                }}
                isLocationFavorite={isLocationFavorite}
                onToggleFavorite={handleToggleFavorite}
                viewMode={viewMode}
                isWeatherError={isWeatherError}
                isWeatherLoading={isWeatherLoading}
                weatherData={weatherData}
                forecastData={forecastData}
                isClinicsLoading={isClinicsLoading}
                clinics={clinics}
                onClinicClick={handleClinicClick}
                selectedClinic={selectedClinic}
                onBackToWeather={handleBackToWeather}
              />
            )}

            {/* 장소 미선택시 안내 */}
            {!mapLocation && (
              <div className="absolute z-40 bottom-6 left-4 right-4">
                <div className="p-4 text-center bg-white shadow-lg rounded-xl">
                  <p className="mb-3 text-sm text-slate-500">
                    검색창을 눌러 장소를 검색하세요
                  </p>
                  {currentLocation && (
                    <button
                      onClick={handleUseCurrentLocation}
                      className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground"
                    >
                      현재 위치 사용
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 모달들 */}
      <ConfirmModal
        open={confirmModal.isOpen}
        onOpenChange={(open) =>
          !open &&
          setConfirmModal({ isOpen: false, favoriteId: "", nickname: "" })
        }
        onConfirm={handleConfirmRemove}
        title="즐겨찾기 삭제"
        description={`"${confirmModal.nickname}"를 즐겨찾기에서 삭제하시겠습니까?`}
        confirmText="삭제"
        variant="destructive"
      />

      <InputModal
        open={inputModal.isOpen}
        onOpenChange={(open) =>
          !open && setInputModal({ isOpen: false, location: null })
        }
        onConfirm={handleAddFavorite}
        title="즐겨찾기 추가"
        description="즐겨찾기 별칭을 입력하세요"
        placeholder="예: 우리집, 회사"
        defaultValue={inputModal.location?.name || ""}
      />

      <ConfirmModal
        open={limitModal}
        onOpenChange={setLimitModal}
        onConfirm={() => setLimitModal(false)}
        title="즐겨찾기 제한"
        description="즐겨찾기는 최대 6개까지 추가할 수 있습니다."
        confirmText="확인"
      />

      <InputModal
        open={editModal.isOpen}
        onOpenChange={(open) =>
          !open &&
          setEditModal({ isOpen: false, favoriteId: "", currentNickname: "" })
        }
        onConfirm={handleUpdateNickname}
        title="별칭 수정"
        description="새로운 별칭을 입력하세요"
        placeholder="예: 우리집, 회사"
        defaultValue={editModal.currentNickname}
      />

      <ConfirmModal
        open={errorModal.isOpen}
        onOpenChange={(open) =>
          !open && setErrorModal({ isOpen: false, message: "" })
        }
        onConfirm={() => setErrorModal({ isOpen: false, message: "" })}
        title="알림"
        description={errorModal.message}
        confirmText="확인"
      />
    </div>
  );
}
