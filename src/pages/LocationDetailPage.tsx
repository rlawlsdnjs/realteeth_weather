import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button, FavoriteToggleButton } from "../shared/ui";
import { ErrorFallback } from "../shared/ui/error-fallback";
import {
  WeatherSkeleton,
  ClinicListSkeleton,
} from "../shared/ui/weather-skeleton";
import { WeatherCard } from "../widgets/weather/weather-card";
import { WeatherMessage } from "../widgets/weather/weather-message";
import { ClinicList } from "../widgets/clinic/clinic-list";
import { ClinicDetail } from "../widgets/clinic/clinic-detail";
import { useWeather, useHourlyForecast } from "../features/weather/use-weather";
import { useClinics } from "../features/clinic/use-clinics";
import { useFavoritesStore } from "../shared/store/useFavoritesStore";
import { ConfirmModal, InputModal, AlertModal } from "../shared/ui/modal";
import type { Location, Clinic } from "../shared/types";

export function LocationDetailPage() {
  const locationState = useLocation();
  const navigate = useNavigate();

  const location = locationState.state?.location as Location | undefined;

  const favorites = useFavoritesStore((state) => state.favorites);
  const addFavorite = useFavoritesStore((state) => state.addFavorite);
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);
  const getFavorite = useFavoritesStore((state) => state.getFavorite);

  // Modal 상태
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showAlertModal, setShowAlertModal] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  // 치과 상세 상태
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);

  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
  } = useWeather(location?.lat ?? 0, location?.lon ?? 0, !!location);

  const { data: forecast } = useHourlyForecast(
    location?.lat ?? 0,
    location?.lon ?? 0,
    !!location,
  );

  const { data: clinics = [], isLoading: clinicsLoading } = useClinics(
    location?.lat ?? 0,
    location?.lon ?? 0,
    !!location,
  );

  if (!location) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="mb-4 text-muted-foreground">장소 정보가 없습니다</p>
          <Button onClick={() => navigate("/")}>검색하러 가기</Button>
        </div>
      </div>
    );
  }

  const handleToggleFavorite = () => {
    if (isFavorite(location.id)) {
      setShowDeleteModal(true);
    } else {
      if (favorites.length >= 6) {
        setAlertMessage("즐겨찾기는 최대 6개까지 추가할 수 있습니다.");
        setShowAlertModal(true);
        return;
      }
      setShowAddModal(true);
    }
  };

  const handleConfirmDelete = () => {
    const fav = getFavorite(location.id);
    if (fav) {
      removeFavorite(fav.id);
    }
    setShowDeleteModal(false);
  };

  const handleConfirmAdd = (nickname: string) => {
    try {
      addFavorite({ location, nickname });
    } catch (error) {
      setAlertMessage(
        error instanceof Error
          ? error.message
          : "즐겨찾기 추가에 실패했습니다.",
      );
      setShowAlertModal(true);
    }
    setShowAddModal(false);
  };

  const handleClinicClick = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleBackFromClinic = () => {
    setSelectedClinic(null);
  };

  const isCurrentlyFavorite = isFavorite(location.id);
  const currentFavorite = getFavorite(location.id);

  return (
    <div className="flex flex-col max-h-full min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b shrink-0">
        <div className="flex items-center justify-between max-w-4xl px-4 py-4 mx-auto">
          <Button
            variant="ghost"
            className="gap-0 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <ChevronLeft className="w-5 h-5 mr-2" />
            검색으로 돌아가기
          </Button>
        </div>
      </div>

      <div className="flex-1 w-full max-w-4xl p-4 mx-auto space-y-6 overflow-y-auto md:p-8">
        {selectedClinic ? (
          <ClinicDetail clinic={selectedClinic} onBack={handleBackFromClinic} />
        ) : (
          <>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="mb-2 text-3xl font-bold">{location.name}</h1>
                <p className="text-muted-foreground">{location.address}</p>
              </div>
              <FavoriteToggleButton
                isFavorite={isCurrentlyFavorite}
                onClick={handleToggleFavorite}
                size="lg"
              />
            </div>

            {weatherLoading ? (
              <WeatherSkeleton />
            ) : weatherError ? (
              <ErrorFallback error={weatherError as Error} />
            ) : weather ? (
              <>
                <WeatherCard
                  weather={weather}
                  forecasts={forecast?.list}
                  showDetails={true}
                />
                <WeatherMessage weather={weather} />
              </>
            ) : (
              <p className="py-8 text-center text-muted-foreground">
                해당 장소의 날씨 정보가 제공되지 않습니다.
              </p>
            )}

            <div>
              {clinicsLoading ? (
                <ClinicListSkeleton />
              ) : (
                <ClinicList
                  clinics={clinics}
                  onClinicClick={handleClinicClick}
                />
              )}
            </div>
          </>
        )}
      </div>

      {/* 삭제 확인 모달 */}
      <ConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        title="즐겨찾기 삭제"
        description={`"${currentFavorite?.nickname || location.name}"를 즐겨찾기에서 삭제하시겠습니까?`}
        confirmText="삭제"
        cancelText="취소"
        onConfirm={handleConfirmDelete}
        variant="destructive"
      />

      {/* 추가 입력 모달 */}
      <InputModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        title="즐겨찾기 추가"
        description="이 장소의 별칭을 입력하세요"
        placeholder="별칭 입력"
        defaultValue={location.name}
        confirmText="추가"
        cancelText="취소"
        onConfirm={handleConfirmAdd}
      />

      {/* 알림 모달 */}
      <AlertModal
        open={showAlertModal}
        onOpenChange={setShowAlertModal}
        title="알림"
        description={alertMessage}
      />
    </div>
  );
}
