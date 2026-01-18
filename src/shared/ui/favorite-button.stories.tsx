import type { Meta, StoryObj } from "@storybook/react";
import { FavoriteToggleButton, FavoriteIcon } from "./favorite-button";
import { useState } from "react";

const meta: Meta<typeof FavoriteToggleButton> = {
  title: "Shared/UI/FavoriteButton",
  component: FavoriteToggleButton,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof FavoriteToggleButton>;

// 토글 버튼 - 인터랙티브
function ToggleDemo() {
  const [isFavorite, setIsFavorite] = useState(false);
  return (
    <div className="flex flex-col items-center gap-4">
      <FavoriteToggleButton
        isFavorite={isFavorite}
        onClick={() => setIsFavorite(!isFavorite)}
        size="lg"
      />
      <span className="text-sm text-slate-500">
        {isFavorite ? "즐겨찾기 됨" : "즐겨찾기 안됨"}
      </span>
    </div>
  );
}

export const Toggle: Story = {
  render: () => <ToggleDemo />,
};

// 다양한 사이즈
export const Sizes: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <FavoriteToggleButton
            isFavorite={true}
            onClick={() => {}}
            size="sm"
          />
          <span className="text-xs text-slate-400">sm</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteToggleButton
            isFavorite={true}
            onClick={() => {}}
            size="md"
          />
          <span className="text-xs text-slate-400">md</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteToggleButton
            isFavorite={true}
            onClick={() => {}}
            size="lg"
          />
          <span className="text-xs text-slate-400">lg</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteToggleButton
            isFavorite={true}
            onClick={() => {}}
            size="xl"
          />
          <span className="text-xs text-slate-400">xl</span>
        </div>
      </div>
    );
  },
};

// 즐겨찾기 됨 상태
export const Favorited: Story = {
  args: {
    isFavorite: true,
    onClick: () => console.log("clicked"),
    size: "lg",
  },
};

// 즐겨찾기 안됨 상태
export const NotFavorited: Story = {
  args: {
    isFavorite: false,
    onClick: () => console.log("clicked"),
    size: "lg",
  },
};

// 아이콘만 (버튼 아님)
export const IconOnly: Story = {
  render: () => {
    return (
      <div className="flex items-center gap-4">
        <div className="flex flex-col items-center gap-2">
          <FavoriteIcon isFavorite={true} size="sm" />
          <span className="text-xs text-slate-400">즐겨찾기</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteIcon isFavorite={true} size="md" />
          <span className="text-xs text-slate-400">즐겨찾기</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteIcon isFavorite={true} size="lg" />
          <span className="text-xs text-slate-400">즐겨찾기</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteIcon isFavorite={true} size="xl" />
          <span className="text-xs text-slate-400">xl</span>
        </div>
        <div className="flex flex-col items-center gap-2">
          <FavoriteIcon isFavorite={false} size="lg" />
          <span className="text-xs text-slate-400">비활성</span>
        </div>
      </div>
    );
  },
};
