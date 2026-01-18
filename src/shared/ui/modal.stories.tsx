import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ConfirmModal, InputModal, AlertModal } from "./modal";
import { Button } from "./button";

const meta: Meta = {
  title: "Shared/UI/Modal",
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;

// ConfirmModal 스토리
function ConfirmDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>삭제하기</Button>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title="즐겨찾기 삭제"
        description="이 장소를 즐겨찾기에서 삭제하시겠습니까?"
        confirmText="삭제"
        cancelText="취소"
        onConfirm={() => {
          console.log("삭제됨");
          setOpen(false);
        }}
        variant="destructive"
      />
    </>
  );
}

export const Confirm: StoryObj = {
  render: () => <ConfirmDemo />,
};

// InputModal 스토리
function InputDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>닉네임 수정</Button>
      <InputModal
        open={open}
        onOpenChange={setOpen}
        title="닉네임 수정"
        description="새로운 닉네임을 입력하세요"
        placeholder="닉네임 입력"
        defaultValue="우리집"
        confirmText="저장"
        cancelText="취소"
        onConfirm={(value) => {
          console.log("저장됨:", value);
        }}
      />
    </>
  );
}

export const Input: StoryObj = {
  render: () => <InputDemo />,
};

// AlertModal 스토리
function AlertDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>알림 보기</Button>
      <AlertModal
        open={open}
        onOpenChange={setOpen}
        title="알림"
        description="즐겨찾기는 최대 6개까지 추가할 수 있습니다."
      />
    </>
  );
}

export const Alert: StoryObj = {
  render: () => <AlertDemo />,
};
