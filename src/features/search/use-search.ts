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
        isMatch(fav.location.address, query),
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

  // 검색 결과 통합 - 즐겨찾기 → 행정구역 → Kakao API 순
  const combinedResults = useMemo((): SearchResultItem[] => {
    const results: SearchResultItem[] = [];
    const query = searchQuery.trim().toLowerCase();

    // 즐겨찾기는 항상 표시 (검색어 없으면 전체, 있으면 필터링)
    if (query) {
      // 검색어가 있으면 필터링된 즐겨찾기만
      favoriteResults.forEach((fav) => {
        const nickname = fav.nickname.toLowerCase();
        const name = fav.location.name.toLowerCase();
        const address = fav.location.address.toLowerCase();

        // 완전 일치 우선순위 계산
        let priority = 103; // 즐겨찾기 기본값 (100대: 즐겨찾기)
        if (nickname === query || name === query || address.includes(query)) {
          priority = 101; // 즐겨찾기 완전 일치
        } else if (nickname.startsWith(query) || name.startsWith(query)) {
          priority = 102; // 즐겨찾기 시작 일치
        }

        results.push({
          type: "favorite",
          data: fav.location,
          favoriteNickname: fav.nickname,
          priority,
        });
      });
    } else {
      // 검색어 없으면 모든 즐겨찾기 표시
      favorites.forEach((fav) => {
        results.push({
          type: "favorite",
          data: fav.location,
          favoriteNickname: fav.nickname,
          priority: 100, // 즐겨찾기 최우선
        });
      });
    }

    // 검색어가 있을 때만 행정구역 결과 추가
    if (query) {
      localResults.forEach((district: District) => {
        const districtLower = district.toLowerCase();
        let priority = 203; // 행정구역 기본값 (200대: 행정구역)
        if (districtLower === query) {
          priority = 201; // 행정구역 완전 일치
        } else if (districtLower.startsWith(query)) {
          priority = 202; // 행정구역 시작 일치
        }

        results.push({ type: "district", data: district, priority });
      });
    }

    // Kakao API 결과 추가 (검색 실행 시에만)
    if (submittedQuery) {
      kakaoResults.forEach((place: KakaoPlace) => {
        const placeName = place.place_name.toLowerCase();
        const address = (
          place.address_name || place.road_address_name
        ).toLowerCase();

        let priority = 303; // Kakao API 기본값 (300대: Kakao)
        if (placeName === query || address.includes(query)) {
          priority = 301; // Kakao 완전 일치
        } else if (placeName.startsWith(query)) {
          priority = 302; // Kakao 시작 일치
        }

        results.push({ type: "place", data: place, priority });
      });
    }

    // 우선순위로 정렬 (낮은 숫자가 먼저)
    return results.sort((a, b) => (a.priority || 999) - (b.priority || 999));
  }, [
    searchQuery,
    favoriteResults,
    localResults,
    submittedQuery,
    kakaoResults,
    favorites,
  ]);

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
