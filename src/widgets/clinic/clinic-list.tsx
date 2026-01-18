import { Card, CardContent, CardHeader, CardTitle } from "../../shared/ui/card";
import { MapPin, Phone, Navigation, ChevronRight } from "lucide-react";
import { Skeleton } from "../../shared/ui/skeleton";
import type { Clinic } from "../../shared/types";

interface ClinicListProps {
  clinics: Clinic[];
  onClinicClick?: (clinic: Clinic) => void;
  isLoading?: boolean;
}

export function ClinicList({
  clinics,
  onClinicClick,
  isLoading = false,
}: ClinicListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>주변 치과{!isLoading && ` (${clinics.length}개)`}</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="p-4 border rounded-lg">
                <Skeleton className="h-6 w-3/4 mb-3" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : clinics.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            주변 1km 이내에 치과가 없습니다.
          </div>
        ) : (
          <div className="space-y-3">
            {clinics.map((clinic) => (
              <button
                key={clinic.id}
                onClick={() => onClinicClick?.(clinic)}
                className="w-full p-4 text-left transition-all border rounded-lg cursor-pointer hover:bg-accent hover:border-primary/50 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="mb-2 font-semibold transition-colors group-hover:text-primary">
                      {clinic.name}
                    </h3>

                    <div className="space-y-1.5">
                      <div className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                        <span className="break-all">{clinic.address}</span>
                      </div>

                      {clinic.phone && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4 shrink-0" />
                          <span>{clinic.phone}</span>
                        </div>
                      )}

                      <div className="flex items-center gap-2 text-sm">
                        <Navigation className="w-4 h-4 shrink-0 text-primary" />
                        <span className="font-medium text-primary">
                          {clinic.distance}m
                        </span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 mt-2 transition-colors text-muted-foreground group-hover:text-primary shrink-0" />
                </div>
              </button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
