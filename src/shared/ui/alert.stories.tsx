import type { Meta, StoryObj } from "@storybook/react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { AlertCircle, Terminal } from "lucide-react";

const meta: Meta<typeof Alert> = {
  title: "Shared/UI/Alert",
  component: Alert,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Alert>;

// 기본 알림
export const Default: Story = {
  render: () => (
    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>안내</AlertTitle>
      <AlertDescription>
        즐겨찾기에 새로운 장소가 추가되었습니다.
      </AlertDescription>
    </Alert>
  ),
};

// 경고 알림
export const Destructive: Story = {
  render: () => (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>오류</AlertTitle>
      <AlertDescription>
        네트워크 연결을 확인해주세요. 데이터를 불러올 수 없습니다.
      </AlertDescription>
    </Alert>
  ),
};

// 타이틀만
export const TitleOnly: Story = {
  render: () => (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>즐겨찾기는 최대 6개까지 추가할 수 있습니다</AlertTitle>
    </Alert>
  ),
};

// 설명만
export const DescriptionOnly: Story = {
  render: () => (
    <Alert>
      <AlertDescription>현재 위치 정보를 사용할 수 없습니다.</AlertDescription>
    </Alert>
  ),
};
