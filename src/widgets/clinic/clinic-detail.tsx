import { MapPin, Phone, Navigation, Clock, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import type { Clinic } from "../../shared/types";

import { Button, ToothIcon } from "../../shared/ui";

interface ClinicDetailProps {
  clinic: Clinic;
  onBack: () => void;
}

export function ClinicDetail({ clinic, onBack }: ClinicDetailProps) {
  return (
    <div className="w-full max-w-2xl space-y-4">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center px-0 text-sm font-medium cursor-pointer text-primary hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        날씨 정보로 돌아가기
      </Button>

      {/* 치과 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <ToothIcon className="w-7 h-7 shrink-0" />
            {clinic.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 거리 */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-primary/10">
            <Navigation className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">현재 위치에서</p>
              <p className="text-lg font-bold text-primary">
                {clinic.distance}m
              </p>
            </div>
          </div>

          {/* 주소 */}
          <div className="flex items-start gap-4">
            <MapPin className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">주소</p>
              <p className="font-medium leading-relaxed">{clinic.address}</p>
              {clinic.roadAddress && clinic.roadAddress !== clinic.address && (
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                  {clinic.roadAddress}
                </p>
              )}
            </div>
          </div>

          {/* 운영 시간 안내 */}
          <div className="flex items-start gap-4 p-3 rounded-lg bg-accent/50">
            <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">운영 시간</p>
              <p className="text-sm leading-relaxed">
                영업시간은 전화로 확인해 주세요.
              </p>
            </div>
          </div>

          {/* 전화 연결 버튼 */}
          {clinic.phone && (
            <a
              href={`tel:${clinic.phone}`}
              className="flex items-center justify-center w-full gap-2 px-4 py-3 font-medium transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Phone className="w-5 h-5 shrink-0" />
              <span>{clinic.phone}</span>
            </a>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
