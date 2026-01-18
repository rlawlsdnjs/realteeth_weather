import { useState } from "react";
import { MapPin, Building, Star } from "lucide-react";
import { Card } from "../../shared/ui/card";
import { ConfirmModal, InputModal } from "../../shared/ui/modal";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import { kakaoApi } from "../../shared/api";
import type { KakaoPlace, District, Location } from "../../shared/types";

export interface SearchResultItem {
  type: "district" | "place" | "favorite";
  data: District | KakaoPlace | Location;
  favoriteNickname?: string;
  priority?: number; // 검색 정확도 우선순위 (1=완전일치, 2=시작일치, 3=부분일치)
}

interface SearchResultsProps {
  results: SearchResultItem[];
  onSelect: (item: SearchResultItem) => void;
  onToggleFavorite?: (location: Location) => void;
}

export function SearchResults({
  results,
  onSelect,
  onToggleFavorite,
}: SearchResultsProps) {
  const { isFavorite, getFavorite, removeFavorite, addFavorite, favorites } =
    useFavoritesStore();

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

  if (results.length === 0) return null;

  // 행정구역 즐겨찾기 클릭 핸들러
  const handleDistrictFavoriteClick = async (
    e: React.MouseEvent,
    district: District,
  ) => {
    e.stopPropagation();
    if (favorites.length >= 6) {
      setLimitModal(true);
      return;
    }

    try {
      // Kakao API로 좌표 가져오기
      const places = await kakaoApi.searchPlace(district);
      if (places.length > 0) {
        const place = places[0];
        const location: Location = {
          id: place.id,
          name: district,
          address: place.address_name || district,
          lat: parseFloat(place.y),
          lon: parseFloat(place.x),
        };
        setInputModal({ isOpen: true, location });
      }
    } catch (error) {
      console.error("행정구역 검색 실패:", error);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent, item: SearchResultItem) => {
    e.stopPropagation();

    if (item.type === "place") {
      const place = item.data as KakaoPlace;
      const location: Location = {
        id: place.id,
        name: place.place_name,
        address: place.address_name || place.road_address_name,
        lat: parseFloat(place.y),
        lon: parseFloat(place.x),
      };

      if (isFavorite(location.id)) {
        const fav = getFavorite(location.id);
        if (fav) {
          setConfirmModal({
            isOpen: true,
            favoriteId: fav.id,
            nickname: fav.nickname,
          });
        }
      } else {
        if (favorites.length >= 6) {
          setLimitModal(true);
          return;
        }
        setInputModal({ isOpen: true, location });
      }
    } else if (item.type === "favorite") {
      const location = item.data as Location;
      const fav = getFavorite(location.id);
      if (fav) {
        setConfirmModal({
          isOpen: true,
          favoriteId: fav.id,
          nickname: fav.nickname,
        });
      }
    }

    if (onToggleFavorite && item.type === "place") {
      const place = item.data as KakaoPlace;
      onToggleFavorite({
        id: place.id,
        name: place.place_name,
        address: place.address_name || place.road_address_name,
        lat: parseFloat(place.y),
        lon: parseFloat(place.x),
      });
    }
  };

  const handleConfirmRemove = () => {
    if (confirmModal.favoriteId) {
      removeFavorite(confirmModal.favoriteId);
    }
  };

  const handleAddFavorite = (nickname: string) => {
    if (inputModal.location) {
      addFavorite({ location: inputModal.location, nickname });
    }
  };

  return (
    <Card className="absolute z-50 w-full mt-2 overflow-y-auto bg-white border shadow-lg max-h-96">
      <div className="divide-y">
        {results.map((item, index) => {
          const isPlaceFavorite =
            item.type === "place" && isFavorite((item.data as KakaoPlace).id);

          return (
            <div
              key={index}
              onClick={() => onSelect(item)}
              className="flex items-start w-full gap-3 px-4 py-3 text-left transition-colors bg-white cursor-pointer hover:bg-slate-100"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && onSelect(item)}
            >
              {item.type === "district" ? (
                <>
                  <MapPin className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.data as District}
                    </p>
                    <p className="text-sm text-slate-500">행정구역</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDistrictFavoriteClick(e, item.data as District);
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-md shrink-0"
                  >
                    <Star className="w-5 h-5 text-slate-500" />
                  </button>
                </>
              ) : item.type === "favorite" ? (
                <>
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {item.favoriteNickname}
                    </p>
                    <p className="text-sm truncate text-slate-500">
                      {(item.data as Location).address}
                    </p>
                    <p className="mt-1 text-xs text-blue-600">즐겨찾기</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(e, item);
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-md shrink-0"
                  >
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  </button>
                </>
              ) : (
                <>
                  <Building className="h-5 w-5 text-slate-500 mt-0.5 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {(item.data as KakaoPlace).place_name}
                    </p>
                    <p className="text-sm truncate text-slate-500">
                      {(item.data as KakaoPlace).address_name}
                    </p>
                    {(item.data as KakaoPlace).category_name && (
                      <p className="mt-1 text-xs text-slate-500">
                        {(item.data as KakaoPlace).category_name}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFavoriteClick(e, item);
                    }}
                    className="p-1.5 hover:bg-slate-200 rounded-md shrink-0"
                  >
                    <Star
                      className={`h-5 w-5 ${
                        isPlaceFavorite
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-500"
                      }`}
                    />
                  </button>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 삭제 확인 모달 */}
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

      {/* 즐겨찾기 추가 모달 */}
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

      {/* 즐겨찾기 제한 모달 */}
      <ConfirmModal
        open={limitModal}
        onOpenChange={setLimitModal}
        onConfirm={() => setLimitModal(false)}
        title="즐겨찾기 제한"
        description="즐겨찾기는 최대 6개까지 추가할 수 있습니다."
        confirmText="확인"
        cancelText=""
      />
    </Card>
  );
}
