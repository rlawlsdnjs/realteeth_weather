import axios from "axios";
import type { KakaoPlace, Clinic } from "../types";

const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY;
const BASE_URL = "https://dapi.kakao.com/v2/local";

const kakaoClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `KakaoAK ${REST_API_KEY}`,
  },
});

export interface ReverseGeocodeResult {
  address: string;
  roadAddress?: string;
}

export const kakaoApi = {
  async searchPlace(query: string): Promise<KakaoPlace[]> {
    const { data } = await kakaoClient.get("/search/keyword.json", {
      params: {
        query,
        size: 15,
      },
    });
    return data.documents;
  },

  async searchClinics(
    lat: number,
    lon: number,
    radius = 1000
  ): Promise<Clinic[]> {
    const { data } = await kakaoClient.get("/search/keyword.json", {
      params: {
        query: "치과",
        x: lon,
        y: lat,
        radius,
        size: 15,
        sort: "distance",
      },
    });

    return data.documents.map((place: any) => ({
      id: place.id,
      name: place.place_name,
      address: place.address_name,
      roadAddress: place.road_address_name,
      phone: place.phone,
      distance: parseInt(place.distance || "0"),
      lat: parseFloat(place.y),
      lon: parseFloat(place.x),
    }));
  },

  // 좌표 → 주소 변환 (역지오코딩)
  async reverseGeocode(
    lat: number,
    lon: number
  ): Promise<ReverseGeocodeResult | null> {
    try {
      const { data } = await kakaoClient.get("/geo/coord2address.json", {
        params: {
          x: lon,
          y: lat,
        },
      });

      if (data.documents && data.documents.length > 0) {
        const doc = data.documents[0];
        return {
          address: doc.address?.address_name || "",
          roadAddress: doc.road_address?.address_name,
        };
      }
      return null;
    } catch (error) {
      console.error("역지오코딩 실패:", error);
      return null;
    }
  },
};
