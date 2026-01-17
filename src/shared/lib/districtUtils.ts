import { isMatch } from "korean-search-utils";
import districts from "../data/korea_districts.json";
import type { District } from "../types";

export function searchDistricts(query: string): District[] {
  if (!query || query.length < 1) return [];

  const normalized = query.trim();

  // korean-search-utils의 isMatch를 사용하여 초성 검색 지원
  return (districts as District[]).filter((district) =>
    isMatch(district, normalized),
  );
}

export function formatDistrict(district: string): string {
  // "서울특별시-종로구-청운동" -> "서울특별시 종로구 청운동"
  return district.replace(/-/g, " ");
}
