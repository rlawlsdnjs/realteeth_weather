import { MapPin, Phone, Navigation, Clock, ChevronLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import type { Clinic } from "../../shared/types";

interface ClinicDetailProps {
  clinic: Clinic;
  onBack: () => void;
}

export function ClinicDetail({ clinic, onBack }: ClinicDetailProps) {
  return (
    <div className="space-y-4">
      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        날씨 정보로 돌아가기
      </button>

      {/* 치과 상세 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">🦷</span>
            {clinic.name}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 거리 */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
            <Navigation className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm text-muted-foreground">현재 위치에서</p>
              <p className="text-lg font-bold text-primary">
                {clinic.distance}m
              </p>
            </div>
          </div>

          {/* 주소 */}
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">주소</p>
              <p className="font-medium">{clinic.address}</p>
              {clinic.roadAddress && clinic.roadAddress !== clinic.address && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {clinic.roadAddress}
                </p>
              )}
            </div>
          </div>

          {/* 전화번호 */}
          {clinic.phone && (
            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">전화번호</p>
                <a
                  href={`tel:${clinic.phone}`}
                  className="font-medium text-primary hover:underline"
                >
                  {clinic.phone}
                </a>
              </div>
            </div>
          )}

          {/* 안내 메시지 */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/50">
            <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm text-muted-foreground">운영 시간</p>
              <p className="text-sm">영업시간은 전화로 확인해 주세요.</p>
            </div>
          </div>

          {/* 전화 버튼 */}
          {clinic.phone && (
            <a
              href={`tel:${clinic.phone}`}
              className="block w-full px-4 py-3 font-medium text-center transition-colors rounded-lg bg-primary text-primary-foreground hover:bg-primary/90"
            >
              📞 전화하기
            </a>
          )}

          {/* 길찾기 버튼 */}
          <a
            href={`https://map.kakao.com/link/to/${clinic.name},${clinic.lat},${clinic.lon}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full px-4 py-3 font-medium text-center transition-colors rounded-lg bg-accent text-accent-foreground hover:bg-accent/80"
          >
            🗺️ 카카오맵에서 길찾기
          </a>
        </CardContent>
      </Card>
    </div>
  );
}
