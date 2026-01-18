import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./button";
import { Star, Search } from "lucide-react";

const meta: Meta<typeof Button> = {
  title: "Shared/UI/Button",
  component: Button,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: "버튼",
  },
};

export const Primary: Story = {
  args: {
    children: "버튼",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
    children: "Secondary",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
    children: "삭제",
  },
};

export const Outline: Story = {
  args: {
    variant: "outline",
    children: "Outline",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
    children: "Ghost",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    children: "Link Button",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <Star className="w-4 h-4" />
        즐겨찾기
      </>
    ),
  },
};

export const IconOnly: Story = {
  args: {
    size: "icon",
    children: <Search className="w-4 h-4" />,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    disabled: true,
    children: "비활성화",
  },
};

export const Loading: Story = {
  render: () => (
    <Button disabled>
      <span className="mr-2 animate-spin">⏳</span>
      로딩중...
    </Button>
  ),
};
