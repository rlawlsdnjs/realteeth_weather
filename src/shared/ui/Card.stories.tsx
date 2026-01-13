import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardHeader, CardTitle, CardContent } from "./Card";

const meta = {
  title: "Shared/UI/Card",
  component: Card,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "bordered", "elevated"],
    },
  },
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: (
      <>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>
          This is a default card with some content inside.
        </CardContent>
      </>
    ),
  },
};

export const Bordered: Story = {
  args: {
    variant: "bordered",
    children: (
      <>
        <CardHeader>
          <CardTitle>Bordered Card</CardTitle>
        </CardHeader>
        <CardContent>
          This card has a border around it for better definition.
        </CardContent>
      </>
    ),
  },
};

export const Elevated: Story = {
  args: {
    variant: "elevated",
    children: (
      <>
        <CardHeader>
          <CardTitle>Elevated Card</CardTitle>
        </CardHeader>
        <CardContent>This card has an elevated shadow effect.</CardContent>
      </>
    ),
  },
};

export const WithRichContent: Story = {
  args: {
    variant: "bordered",
    children: (
      <>
        <CardHeader>
          <CardTitle>Weather Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Temperature:</span> 22°C
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Humidity:</span> 65%
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold">Condition:</span> Partly Cloudy
            </p>
          </div>
        </CardContent>
      </>
    ),
  },
};

export const AllVariants: Story = {
  args: {
    children: null,
  },
  render: () => (
    <div className="flex gap-4">
      <Card variant="default" className="w-64">
        <CardHeader>
          <CardTitle>Default</CardTitle>
        </CardHeader>
        <CardContent>
          Default card variant with no border or shadow.
        </CardContent>
      </Card>

      <Card variant="bordered" className="w-64">
        <CardHeader>
          <CardTitle>Bordered</CardTitle>
        </CardHeader>
        <CardContent>Card with a subtle border.</CardContent>
      </Card>

      <Card variant="elevated" className="w-64">
        <CardHeader>
          <CardTitle>Elevated</CardTitle>
        </CardHeader>
        <CardContent>Card with shadow elevation.</CardContent>
      </Card>
    </div>
  ),
};
