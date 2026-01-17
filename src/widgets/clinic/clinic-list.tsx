import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../shared/ui/card";
import { MapPin, Phone, Navigation, ChevronRight } from "lucide-react";
import type { Clinic } from "../../shared/types";

interface ClinicListProps {
  clinics: Clinic[];
  onClinicClick?: (clinic: Clinic) => void;
}

export function ClinicList({ clinics, onClinicClick }: ClinicListProps) {
  if (clinics.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          주변 1km 이내에 치과가 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>주변 치과 ({clinics.length}개)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clinics.map((clinic) => (
            <button
              key={clinic.id}
              onClick={() => onClinicClick?.(clinic)}
              className="w-full text-left p-4 rounded-lg border hover:bg-accent hover:border-primary/50 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                    {clinic.name}
                  </h3>

                  <div className="space-y-1.5">
                    <div className="flex items-start gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                      <span className="break-all">{clinic.address}</span>
                    </div>

                    {clinic.phone && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 shrink-0" />
                        <span>{clinic.phone}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-2 text-sm">
                      <Navigation className="h-4 w-4 shrink-0 text-primary" />
                      <span className="font-medium text-primary">
                        {clinic.distance}m
                      </span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors shrink-0 mt-2" />
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
