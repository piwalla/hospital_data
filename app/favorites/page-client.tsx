"use client";

/**
 * @file page-client.tsx
 * @description 즐겨찾기 페이지 클라이언트 컴포넌트
 *
 * 즐겨찾기 목록 표시 및 삭제 기능
 */

import { useState } from "react";
import Link from "next/link";
import { Trash2, MapPin, Phone, Building2 } from "lucide-react";
import { removeFavorite } from "@/lib/api/favorites";
import type { Favorite } from "@/lib/types/favorites";
import { Button } from "@/components/ui/button";

interface FavoriteWithEntity extends Favorite {
  entity: {
    id: string;
    name: string;
    type?: "hospital" | "pharmacy";
    address: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    institution_type?: string | null;
    department_extracted?: string | null;
    gigwan_fg_nm?: string | null;
  } | null;
}

interface FavoritesPageClientProps {
  favorites: FavoriteWithEntity[];
}

export default function FavoritesPageClient({
  favorites: initialFavorites,
}: FavoritesPageClientProps) {
  const [favorites, setFavorites] = useState(initialFavorites);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  // 즐겨찾기 제거
  const handleRemove = async (favorite: FavoriteWithEntity) => {
    if (!favorite.entity) return;

    if (removingIds.has(favorite.id)) return;

    setRemovingIds((prev) => new Set(prev).add(favorite.id));

    try {
      await removeFavorite(favorite.entity_type, favorite.entity_id);
      setFavorites((prev) =>
        prev.filter((f) => f.id !== favorite.id)
      );
      console.log("[FavoritesPage] 즐겨찾기 제거 완료:", favorite.entity.name);
    } catch (error) {
      console.error("[FavoritesPage] 즐겨찾기 제거 실패:", error);
      alert("즐겨찾기 제거에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setRemovingIds((prev) => {
        const next = new Set(prev);
        next.delete(favorite.id);
        return next;
      });
    }
  };

  // 병원/약국과 재활기관 분리
  const hospitalFavorites = favorites.filter(
    (f) => f.entity_type === "hospital" && f.entity
  );
  const rehabilitationFavorites = favorites.filter(
    (f) => f.entity_type === "rehabilitation_center" && f.entity
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">
          즐겨찾기
        </h1>
        <p className="text-muted-foreground">
          저장한 의료기관을 한눈에 확인하세요
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Building2 className="w-16 h-16 text-[#E0E0E0] mb-4" />
          <h2 className="text-xl font-semibold text-muted-foreground mb-2">
            즐겨찾기가 없습니다
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            병원 찾기에서 의료기관을 즐겨찾기에 추가해보세요
          </p>
          <Link href="/hospitals">
            <Button>병원 찾기로 이동</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 병원/약국 즐겨찾기 */}
          {hospitalFavorites.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">
                병원/약국 ({hospitalFavorites.length}개)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {hospitalFavorites.map((favorite) => {
                  if (!favorite.entity) return null;

                  const entity = favorite.entity;
                  const isRemoving = removingIds.has(favorite.id);

                  return (
                    <div
                      key={favorite.id}
                      className="bg-white rounded-2xl border border-[#E8F5E9] p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#1C1C1E] mb-2">
                            {entity.name}
                          </h3>
                          <div className="flex flex-wrap gap-1.5 mb-2">
                            {entity.institution_type && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                                {entity.institution_type}
                              </span>
                            )}
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                entity.type === "hospital"
                                  ? "bg-primary/10 text-primary"
                                  : "bg-[#3B82F6]/10 text-[#3B82F6]"
                              }`}
                            >
                              {entity.type === "hospital" ? "병원" : "약국"}
                            </span>
                            {entity.department_extracted &&
                              entity.department_extracted !== "기타" && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[var(--color-rehabilitation)]/10 text-[var(--color-rehabilitation)]">
                                  {entity.department_extracted}
                                </span>
                              )}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemove(favorite)}
                          disabled={isRemoving}
                          className="text-[#555555] hover:text-[#DC2626] transition-colors disabled:opacity-50"
                          aria-label="즐겨찾기 제거"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#555555] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#555555] flex-1">
                            {entity.address}
                          </p>
                        </div>
                        {entity.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#555555] flex-shrink-0" />
                            <a
                              href={`tel:${entity.phone}`}
                              className="text-sm text-primary hover:underline"
                            >
                              {entity.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {entity.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              window.location.href = `tel:${entity.phone}`;
                            }}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            전화
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            const naverMapUrl = `https://map.naver.com/search/${encodeURIComponent(entity.address)}`;
                            window.open(naverMapUrl, "_blank");
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          길찾기
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 재활기관 즐겨찾기 */}
          {rehabilitationFavorites.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-[#1C1C1E] mb-4">
                재활기관 ({rehabilitationFavorites.length}개)
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {rehabilitationFavorites.map((favorite) => {
                  if (!favorite.entity) return null;

                  const entity = favorite.entity;
                  const isRemoving = removingIds.has(favorite.id);

                  return (
                    <div
                      key={favorite.id}
                      className="bg-white rounded-2xl border border-[#E8F5E9] p-6 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg text-[#1C1C1E] mb-2">
                            {entity.name}
                          </h3>
                          {entity.gigwan_fg_nm && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#9333EA]/10 text-[#9333EA]">
                              {entity.gigwan_fg_nm}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => handleRemove(favorite)}
                          disabled={isRemoving}
                          className="text-[#555555] hover:text-[#DC2626] transition-colors disabled:opacity-50"
                          aria-label="즐겨찾기 제거"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#555555] mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-[#555555] flex-1">
                            {entity.address}
                          </p>
                        </div>
                        {entity.phone && (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#555555] flex-shrink-0" />
                            <a
                              href={`tel:${entity.phone}`}
                              className="text-sm text-[#9333EA] hover:underline"
                            >
                              {entity.phone}
                            </a>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        {entity.phone && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                            onClick={() => {
                              window.location.href = `tel:${entity.phone}`;
                            }}
                          >
                            <Phone className="w-4 h-4 mr-1" />
                            전화
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            const naverMapUrl = `https://map.naver.com/search/${encodeURIComponent(entity.address)}`;
                            window.open(naverMapUrl, "_blank");
                          }}
                        >
                          <MapPin className="w-4 h-4 mr-1" />
                          길찾기
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}





