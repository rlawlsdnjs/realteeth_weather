import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { isMatch } from "korean-search-utils";
import { kakaoApi } from "../../shared/api";
import {
  searchDistricts,
  formatDistrict,
} from "../../shared/lib/districtUtils";
import { useFavoritesStore } from "../../shared/store/useFavoritesStore";
import type { KakaoPlace, Location, District } from "../../shared/types";
import type { SearchResultItem } from "./search-results";

export function useSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const favorites = useFavoritesStore((state) => state.favorites);

  // 로컬 행정구역 검색 (입력 중에도 즉시 표시) - 초성 검색 지원
  const localResults = useMemo(() => {
    if (!searchQuery) return [];
    return searchDistricts(searchQuery).map(formatDistrict);
  }, [searchQuery]);

  // 즐겨찾기 별칭으로 검색 (입력 중에도 즉시 표시) - 초성 검색 지원
  const favoriteResults = useMemo(() => {
    if (!searchQuery) return [];
    const query = searchQuery.trim();
    return favorites.filter(
      (fav) =>
        isMatch(fav.nickname, query) ||
        isMatch(fav.location.name, query) ||
        isMatch(fav.location.address, query)
    );
  }, [searchQuery, favorites]);

  // Kakao API 검색 (엔터/버튼 클릭 시에만 호출)
  const { data: kakaoResults = [], isLoading } = useQuery<KakaoPlace[]>({
    queryKey: ["search", submittedQuery],
    queryFn: () => kakaoApi.searchPlace(submittedQuery),
    enabled: submittedQuery.length >= 2,
    staleTime: 1000 * 60 * 5,
  });

  // 입력값 변경 (API 호출 없음)
  const handleInputChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  // 검색 실행 (엔터/버튼 클릭 시 API 호출)
  const triggerSearch = useCallback(() => {
    if (searchQuery.trim().length >= 2) {
      setSubmittedQuery(searchQuery.trim());
    }
  }, [searchQuery]);

  // 검색 결과 통합 (즐겨찾기 → 행정구역 → Kakao 검색 순)
  const combinedResults = useMemo((): SearchResultItem[] => {
    const results: SearchResultItem[] = [];

    // 즐겨찾기 결과 추가 (별칭으로 검색 가능)
    favoriteResults.slice(0, 3).forEach((fav) => {
      results.push({
        type: "favorite",
        data: fav.location,
        favoriteNickname: fav.nickname,
      });
    });

    // 로컬 결과 추가
    localResults.slice(0, 5).forEach((district: District) => {
      results.push({ type: "district", data: district });
    });

    // Kakao 결과 추가
    kakaoResults.slice(0, 10).forEach((place: KakaoPlace) => {
      results.push({ type: "place", data: place });
    });

    return results;
  }, [favoriteResults, localResults, kakaoResults]);

  // 검색 초기화
  const clearSearch = useCallback(() => {
    setSearchQuery("");
    setSubmittedQuery("");
  }, []);

  const convertToLocation = useCallback((place: KakaoPlace): Location => {
    return {
      id: place.id,
      name: place.place_name,
      address: place.address_name || place.road_address_name,
      lat: parseFloat(place.y),
      lon: parseFloat(place.x),
    };
  }, []);

  return {
    searchQuery,
    handleInputChange,
    triggerSearch,
    clearSearch,
    results: combinedResults,
    isLoading,
    convertToLocation,
  };
}
