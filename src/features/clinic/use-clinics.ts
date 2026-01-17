import { useQuery } from "@tanstack/react-query";
import { kakaoApi } from "../../shared/api";
import type { Clinic } from "../../shared/types";

export function useClinics(lat: number, lon: number, enabled = true) {
  return useQuery<Clinic[]>({
    queryKey: ["clinics", lat, lon],
    queryFn: () => kakaoApi.searchClinics(lat, lon),
    enabled: enabled && !!lat && !!lon,
    staleTime: 1000 * 60 * 60, // 1시간
  });
}
