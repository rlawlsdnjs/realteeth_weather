import type { Meta, StoryObj } from "@storybook/react";
import { EmptyState } from "./empty-state";
import { Button } from "./button";
import { Search, Star, MapPin } from "lucide-react";

const meta: Meta<typeof EmptyState> = {
  title: "Shared/UI/EmptyState",
  component: EmptyState,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "데이터가 없습니다",
    description: "아직 표시할 항목이 없습니다.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Search className="w-12 h-12" />,
    title: "검색 결과가 없습니다",
    description: "다른 검색어로 시도해 보세요.",
  },
};

export const WithAction: Story = {
  args: {
    icon: <Star className="w-12 h-12" />,
    title: "즐겨찾기가 없습니다",
    description: "자주 방문하는 장소를 추가해 보세요.",
    action: <Button>즐겨찾기 추가</Button>,
  },
};

export const NoFavorites: Story = {
  args: {
    icon: <Star className="w-12 h-12" />,
    title: "아직 즐겨찾기가 없습니다",
    description: "최대 6개까지 저장할 수 있습니다.",
    action: (
      <Button variant="outline">
        <MapPin className="w-4 h-4 mr-2" />
        장소 검색
      </Button>
    ),
  },
};
