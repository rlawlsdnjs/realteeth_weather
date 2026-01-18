import type { Meta, StoryObj } from "@storybook/react";
import { ErrorFallback } from "./error-fallback";

const meta: Meta<typeof ErrorFallback> = {
  title: "Shared/UI/ErrorFallback",
  component: ErrorFallback,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ErrorFallback>;

// 기본 에러
export const Default: Story = {
  args: {
    error: new Error("네트워크 연결에 실패했습니다."),
  },
};

// 커스텀 타이틀과 설명
export const CustomMessage: Story = {
  args: {
    title: "데이터를 불러올 수 없습니다",
    description: "잠시 후 다시 시도해주세요.",
  },
};

// 리셋 버튼 포함
export const WithReset: Story = {
  args: {
    error: new Error("API 요청이 실패했습니다."),
    resetErrorBoundary: () => {
      console.log("에러 초기화");
      alert("에러가 초기화되었습니다.");
    },
  },
};

// 전체 기능
export const Full: Story = {
  args: {
    title: "날씨 정보를 불러오는 중 오류 발생",
    description: "서버와의 연결이 원활하지 않습니다. 다시 시도해주세요.",
    error: new Error("500 Internal Server Error"),
    resetErrorBoundary: () => console.log("재시도"),
  },
};

// 에러 객체 없이
export const NoErrorObject: Story = {
  args: {
    title: "위치 권한이 필요합니다",
    description: "현재 위치를 사용하려면 위치 권한을 허용해주세요.",
  },
};
