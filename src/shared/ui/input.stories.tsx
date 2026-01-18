import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./input";

const meta: Meta<typeof Input> = {
  title: "Shared/UI/Input",
  component: Input,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div style={{ width: "300px" }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: "입력하세요",
  },
};

export const WithValue: Story = {
  args: {
    value: "서울특별시 강남구",
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    placeholder: "비활성화됨",
    disabled: true,
  },
};

export const WithType: Story = {
  args: {
    type: "password",
    placeholder: "비밀번호 입력",
  },
};
