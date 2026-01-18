import type { Meta, StoryObj } from "@storybook/react";
import {
  WeatherSkeleton,
  ClinicListSkeleton,
  FavoriteCardSkeleton,
} from "./weather-skeleton";

const meta: Meta = {
  title: "Shared/UI/WeatherSkeleton",
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;

// 날씨 카드 스켈레톤
export const Weather: StoryObj = {
  render: () => <WeatherSkeleton />,
};

// 병원 리스트 스켈레톤
export const ClinicList: StoryObj = {
  render: () => <ClinicListSkeleton />,
};

// 즐겨찾기 카드 스켈레톤
export const FavoriteCard: StoryObj = {
  render: () => <FavoriteCardSkeleton />,
};

// 모두 함께
export const All: StoryObj = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 text-sm font-medium">WeatherSkeleton</h3>
        <WeatherSkeleton />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">ClinicListSkeleton</h3>
        <ClinicListSkeleton />
      </div>
      <div>
        <h3 className="mb-2 text-sm font-medium">FavoriteCardSkeleton</h3>
        <FavoriteCardSkeleton />
      </div>
    </div>
  ),
};
