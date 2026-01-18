import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { isMatch, getMatchStartIndex } from "korean-search-utils";
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

  // 검색 결과 통합 - 매칭 우선순위 적용 (korean-search-utils 방식)
  const combinedResults = useMemo((): SearchResultItem[] => {
    const results: SearchResultItem[] = [];
    const query = searchQuery.trim();

    // 즐겨찾기 결과 추가
    if (query) {
      // 검색어가 있으면 필터링된 즐겨찾기만
      favoriteResults.forEach((fav) => {
        // 매칭 위치 계산 (별칭, 이름, 주소 중 가장 앞에서 매칭되는 위치)
        const nicknameIndex = getMatchStartIndex(fav.nickname, query);
        const nameIndex = getMatchStartIndex(fav.location.name, query);
        const addressIndex = getMatchStartIndex(fav.location.address, query);

        const matchIndex = Math.min(
          nicknameIndex >= 0 ? nicknameIndex : Infinity,
          nameIndex >= 0 ? nameIndex : Infinity,
          addressIndex >= 0 ? addressIndex : Infinity,
        );

        // 우선순위: 타입(100) + 매칭위치(0-99) + 길이(0-0.99)
        const textLength = fav.nickname.length;
        const priority = 100 + matchIndex + textLength * 0.01;

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
          priority: 100,
        });
      });
    }

    // 행정구역 결과 추가
    if (query) {
      localResults.forEach((district: District) => {
        const matchIndex = getMatchStartIndex(district, query);
        const textLength = district.length;

        // 우선순위: 타입(200) + 매칭위치(0-99) + 길이(0-0.99)
        const priority =
          200 + (matchIndex >= 0 ? matchIndex : 99) + textLength * 0.01;

        results.push({
          type: "district",
          data: district,
          priority,
        });
      });
    }

    // Kakao API 결과 추가
    if (submittedQuery && submittedQuery === query) {
      kakaoResults.forEach((place: KakaoPlace) => {
        const nameIndex = getMatchStartIndex(place.place_name, query);
        const addressIndex = getMatchStartIndex(
          place.address_name || place.road_address_name,
          query,
        );

        const matchIndex = Math.min(
          nameIndex >= 0 ? nameIndex : Infinity,
          addressIndex >= 0 ? addressIndex : Infinity,
        );

        const textLength = place.place_name.length;
        // 우선순위: 타입(300) + 매칭위치(0-99) + 길이(0-0.99)
        const priority =
          300 +
          (matchIndex >= 0 && matchIndex !== Infinity ? matchIndex : 99) +
          textLength * 0.01;

        results.push({
          type: "place",
          data: place,
          priority,
        });
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
