import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";
import { Button } from "./button";
import { Input } from "./input";

const meta: Meta = {
  title: "Shared/UI/Dialog",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

// 기본 Dialog
function BasicDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>설정 열기</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>설정</DialogTitle>
          <DialogDescription>
            여기에서 설정을 변경할 수 있습니다.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              이름
            </label>
            <Input id="name" defaultValue="홍길동" />
          </div>
          <div className="grid gap-2">
            <label htmlFor="username" className="text-sm font-medium">
              사용자명
            </label>
            <Input id="username" defaultValue="@hong" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">저장</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Basic: StoryObj = {
  render: () => <BasicDemo />,
};

// 프로그래매틱 제어
function ControlledDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>프로필 편집</Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>프로필 편집</DialogTitle>
            <DialogDescription>
              프로필 정보를 수정하고 저장 버튼을 클릭하세요.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="email" className="text-sm font-medium">
                이메일
              </label>
              <Input id="email" type="email" defaultValue="user@example.com" />
            </div>
            <div className="grid gap-2">
              <label htmlFor="phone" className="text-sm font-medium">
                전화번호
              </label>
              <Input id="phone" defaultValue="010-1234-5678" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                console.log("저장됨");
                setOpen(false);
              }}
            >
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const Controlled: StoryObj = {
  render: () => <ControlledDemo />,
};

// 간단한 정보 다이얼로그
function InfoDemo() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">정보 보기</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>날씨 알림</DialogTitle>
          <DialogDescription>
            현재 위치의 날씨 정보를 표시합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <p className="text-sm text-muted-foreground">
              서울특별시 강남구의 현재 날씨는 맑음이며, 기온은 23°C입니다.
            </p>
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary">
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export const Info: StoryObj = {
  render: () => <InfoDemo />,
};
