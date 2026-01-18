import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { ConfirmModal } from "../../shared/ui/modal";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import { useWeather } from "../../features/weather/use-weather";

import type { Favorite } from "../../shared/types";
import { getWeatherIconInfo } from "../../shared/lib/weatherUtils";

interface FavoriteCardProps {
  favorite: Favorite;
  onEditNickname: (id: string, nickname: string) => void;
}

export function FavoriteCard({ favorite, onEditNickname }: FavoriteCardProps) {
  const navigate = useNavigate();
  const removeFavorite = useFavoritesStore((state) => state.removeFavorite);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const { data: weather, isLoading } = useWeather(
    favorite.location.lat,
    favorite.location.lon,
  );

  const handleCardClick = () => {
    navigate(`/location/${favorite.location.id}`, {
      state: { location: favorite.location },
    });
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const handleConfirmRemove = () => {
    removeFavorite(favorite.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEditNickname(favorite.id, favorite.nickname ?? "");
  };

  return (
    <>
      <Card
        className="transition-shadow bg-white cursor-pointer hover:shadow-md"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center flex-1 min-w-0 gap-2">
              <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 shrink-0" />
              <h3 className="font-semibold truncate">{favorite.nickname}</h3>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEdit}
                className="w-8 h-8"
              >
                <Pencil className="w-4 h-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemove}
                className="w-8 h-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm truncate text-muted-foreground">
            {favorite.location.address}
          </p>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="text-xs text-muted-foreground">...</div>
          ) : weather ? (
            (() => {
              const weatherIconInfo = getWeatherIconInfo(weather.weather[0].id);
              const WeatherIcon = weatherIconInfo.icon;
              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full border-2 ${weatherIconInfo.borderColor} bg-white`}
                    >
                      <WeatherIcon
                        className={`w-7 h-7 ${weatherIconInfo.color}`}
                      />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {Math.round(weather.main.temp)}°C
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {weather.weather[0].description}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-1 text-right">
                    <Badge variant="secondary" className="text-xs">
                      최고 {Math.round(weather.main.temp_max)}°
                    </Badge>
                    <Badge variant="outline" className="block text-xs">
                      최저 {Math.round(weather.main.temp_min)}°
                    </Badge>
                  </div>
                </div>
              );
            })()
          ) : (
            <p className="text-sm text-muted-foreground">날씨 정보 없음</p>
          )}
        </CardContent>
      </Card>

      <ConfirmModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleConfirmRemove}
        title="즐겨찾기 삭제"
        description={`"${favorite.nickname}"를 즐겨찾기에서 삭제하시겠습니까?`}
        confirmText="삭제"
        variant="destructive"
      />
    </>
  );
}
