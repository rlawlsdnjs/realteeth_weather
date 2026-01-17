import { cn } from "@/shared/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import { AlertCircle } from "lucide-react";

interface ErrorFallbackProps {
  error?: Error | null;
  title?: string;
  description?: string;
  resetErrorBoundary?: () => void;
  className?: string;
}

export function ErrorFallback({
  error,
  title = "오류가 발생했습니다",
  description,
  resetErrorBoundary,
  className,
}: ErrorFallbackProps) {
  return (
    <Alert variant="destructive" className={cn("", className)}>
      <AlertCircle className="w-4 h-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        {description || error?.message || "알 수 없는 오류가 발생했습니다."}
        {resetErrorBoundary && (
          <Button
            variant="outline"
            size="sm"
            onClick={resetErrorBoundary}
            className="w-full mt-3"
          >
            다시 시도
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
}
