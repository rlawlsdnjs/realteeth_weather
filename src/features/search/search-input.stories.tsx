import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { SearchInput } from "./search-input";

const meta: Meta<typeof SearchInput> = {
  title: "Features/Search/SearchInput",
  component: SearchInput,
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
type Story = StoryObj<typeof SearchInput>;

// 기본 검색 입력
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        onSearch={() => console.log("검색:", value)}
        placeholder="장소를 검색하세요"
      />
    );
  },
};

// 값이 있을 때 (X 버튼 표시)
export const WithValue: Story = {
  render: () => {
    const [value, setValue] = useState("서울특별시 강남구");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        onSearch={() => console.log("검색:", value)}
        onClear={() => {
          setValue("");
          console.log("검색어 초기화");
        }}
        placeholder="장소를 검색하세요"
      />
    );
  },
};

// X 버튼 클릭 시 초기화
export const WithClearButton: Story = {
  render: () => {
    const [value, setValue] = useState("역삼동");
    const [cleared, setCleared] = useState(false);

    return (
      <div className="space-y-2">
        <SearchInput
          value={value}
          onChange={setValue}
          onSearch={() => console.log("검색:", value)}
          onClear={() => {
            setValue("");
            setCleared(true);
          }}
          placeholder="장소를 검색하세요"
        />
        {cleared && (
          <p className="text-sm text-green-600">검색어가 초기화되었습니다!</p>
        )}
      </div>
    );
  },
};

// 커스텀 플레이스홀더
export const CustomPlaceholder: Story = {
  render: () => {
    const [value, setValue] = useState("");
    return (
      <SearchInput
        value={value}
        onChange={setValue}
        onSearch={() => console.log("검색:", value)}
        placeholder="주소, 상호명, 즐겨찾기 검색"
      />
    );
  },
};
