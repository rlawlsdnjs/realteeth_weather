import { useNavigate } from "react-router-dom";
import { Star, Plus } from "lucide-react";
import { Button } from "../shared/ui/button";
import { EmptyState } from "../shared/ui/empty-state";
import { FavoriteCard } from "../widgets/favorites/favorite-card";
import { useFavoritesStore } from "../shared/store/useFavoritesStore";

export function FavoritesPage() {
  const navigate = useNavigate();
  const favorites = useFavoritesStore((state) => state.favorites);
  const updateNickname = useFavoritesStore((state) => state.updateNickname);

  const handleEditNickname = (id: string) => {
    const favorite = favorites.find((f) => f.id === id);
    if (favorite) {
      const newNickname = prompt("별칭을 수정하세요", favorite.nickname);
      if (newNickname && newNickname.trim()) {
        updateNickname(id, newNickname.trim());
      }
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
              즐겨찾기
            </h1>
            <p className="text-muted-foreground mt-2">
              최대 6개까지 저장할 수 있습니다 ({favorites.length}/6)
            </p>
          </div>
          <Button onClick={() => navigate("/")}>
            <Plus className="h-5 w-5 mr-2" />
            장소 추가
          </Button>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            title="아직 즐겨찾기가 없습니다"
            description="장소를 검색하고 즐겨찾기에 추가해보세요"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((favorite) => (
              <FavoriteCard
                key={favorite.id}
                favorite={favorite}
                onEditNickname={handleEditNickname}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
