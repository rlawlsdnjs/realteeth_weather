import { Star } from "lucide-react";
import { cn } from "../lib/utils";

interface FavoriteToggleButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  showBackground?: boolean;
}

const sizeMap = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

const buttonSizeMap = {
  sm: "p-1",
  md: "p-1.5",
  lg: "p-2",
};

export function FavoriteToggleButton({
  isFavorite,
  onClick,
  size = "md",
  className,
  showBackground = true,
}: FavoriteToggleButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "transition-colors rounded-full shrink-0 cursor-pointer",
        showBackground && "hover:bg-slate-100",
        buttonSizeMap[size],
        className,
      )}
    >
      <Star
        className={cn(
          sizeMap[size],
          "transition-colors",
          isFavorite
            ? "fill-yellow-400 text-yellow-400"
            : "text-muted-foreground hover:text-yellow-400",
        )}
      />
    </button>
  );
}

// 단순 표시용 Star 아이콘 (버튼 아님)
interface FavoriteIconProps {
  isFavorite?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function FavoriteIcon({
  isFavorite = true,
  size = "md",
  className,
}: FavoriteIconProps) {
  return (
    <Star
      className={cn(
        sizeMap[size],
        "shrink-0",
        isFavorite
          ? "fill-yellow-400 text-yellow-400"
          : "text-muted-foreground",
        className,
      )}
    />
  );
}
