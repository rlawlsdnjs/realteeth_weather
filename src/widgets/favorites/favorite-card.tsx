import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "../../shared/ui/card";
import { Button } from "../../shared/ui/button";
import { Badge } from "../../shared/ui/badge";
import { ConfirmModal } from "../../shared/ui/modal";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import { useWeather } from "../../features/weather/use-weather";
import { Spinner } from "../../shared/ui/spinner";
import type { Favorite } from "../../shared/types";
import { getWeatherIcon } from "../../shared/lib/weatherUtils";

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
    favorite.location.lon
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
        className="cursor-pointer hover:shadow-md transition-shadow bg-white"
        onClick={handleCardClick}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400 shrink-0" />
              <h3 className="font-semibold truncate">{favorite.nickname}</h3>
            </div>
            <div className="flex gap-1 shrink-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={handleEdit}
                className="h-8 w-8"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleRemove}
                className="h-8 w-8 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {favorite.location.address}
          </p>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <Spinner size="sm" />
          ) : weather ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-4xl">
                  {getWeatherIcon(weather.weather[0].id)}
                </span>
                <div>
                  <p className="text-2xl font-bold">
                    {Math.round(weather.main.temp)}°C
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {weather.weather[0].description}
                  </p>
                </div>
              </div>
              <div className="text-right space-y-1">
                <Badge variant="secondary" className="text-xs">
                  최고 {Math.round(weather.main.temp_max)}°
                </Badge>
                <Badge variant="outline" className="text-xs block">
                  최저 {Math.round(weather.main.temp_min)}°
                </Badge>
              </div>
            </div>
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
