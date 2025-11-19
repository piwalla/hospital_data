/**
 * @file RegionSelector.tsx
 * @description 지역 선택 컴포넌트
 * 
 * 시/도, 시/군/구를 선택할 수 있는 드롭다운 컴포넌트입니다.
 * 광역시인 경우 구까지 선택할 수 있습니다.
 */

"use client";

import { useState, useEffect } from 'react';
import { ALL_PROVINCES, findProvinceByCode } from '@/lib/data/korean-regions';
import type { RegionSelection } from '@/lib/types/region';
import { getRegionCoordinates } from '@/lib/data/region-coordinates';

interface RegionSelectorProps {
  value: RegionSelection;
  onChange: (selection: RegionSelection) => void;
  onRegionChange?: (coordinates: { lat: number; lng: number } | null) => void;
}

export default function RegionSelector({
  value,
  onChange,
  onRegionChange,
}: RegionSelectorProps) {
  const [availableDistricts, setAvailableDistricts] = useState<NonNullable<typeof ALL_PROVINCES[0]['districts']>>([]);
  const [availableSubDistricts, setAvailableSubDistricts] = useState<NonNullable<NonNullable<typeof ALL_PROVINCES[0]['districts']>[0]['subDistricts']>>([]);

  // 시/도 선택 시 시/군/구 목록 업데이트
  useEffect(() => {
    if (value.provinceCode) {
      const province = findProvinceByCode(value.provinceCode);
      if (province && province.districts) {
        setAvailableDistricts(province.districts);
      } else {
        setAvailableDistricts([]);
      }
    } else {
      setAvailableDistricts([]);
    }
  }, [value.provinceCode]);

  // 시/군/구 선택 시 구 목록 업데이트 (시의 경우)
  useEffect(() => {
    if (value.provinceCode && value.districtCode) {
      const province = findProvinceByCode(value.provinceCode);
      if (province && province.districts) {
        const district = province.districts.find((d) => d.code === value.districtCode);
        if (district && district.type === 'city' && district.subDistricts) {
          setAvailableSubDistricts(district.subDistricts);
        } else {
          setAvailableSubDistricts([]);
        }
      } else {
        setAvailableSubDistricts([]);
      }
    } else {
      setAvailableSubDistricts([]);
    }
  }, [value.provinceCode, value.districtCode]);

  // 시/도 선택 핸들러
  const handleProvinceChange = (provinceCode: string) => {
    const province = findProvinceByCode(provinceCode);
    if (!province) return;

    const newSelection: RegionSelection = {
      provinceCode,
      provinceName: province.name,
      districtCode: null,
      districtName: null,
      subDistrictCode: null,
      subDistrictName: null,
    };

    onChange(newSelection);

    // 지도 중심 이동
    const coordinates = getRegionCoordinates(provinceCode);
    if (onRegionChange) {
      onRegionChange(coordinates);
    }
  };

  // 시/군/구 선택 핸들러
  const handleDistrictChange = (districtCode: string) => {
    if (!value.provinceCode) return;

    const province = findProvinceByCode(value.provinceCode);
    if (!province || !province.districts) return;

    const district = province.districts.find((d) => d.code === districtCode);
    if (!district) return;

    const newSelection: RegionSelection = {
      ...value,
      districtCode,
      districtName: district.name,
      subDistrictCode: null,
      subDistrictName: null,
    };

    onChange(newSelection);

    // 지도 중심 이동
    const coordinates = getRegionCoordinates(value.provinceCode, districtCode);
    if (onRegionChange) {
      onRegionChange(coordinates);
    }
  };

  // 구 선택 핸들러 (시의 하위 구)
  const handleSubDistrictChange = (subDistrictCode: string) => {
    if (!value.provinceCode || !value.districtCode) return;

    const province = findProvinceByCode(value.provinceCode);
    if (!province || !province.districts) return;

    const district = province.districts.find((d) => d.code === value.districtCode);
    if (!district || !district.subDistricts) return;

    const subDistrict = district.subDistricts.find((sd) => sd.code === subDistrictCode);
    if (!subDistrict) return;

    const newSelection: RegionSelection = {
      ...value,
      subDistrictCode,
      subDistrictName: subDistrict.name,
    };

    onChange(newSelection);

    // 지도 중심 이동 (구 좌표는 시/군/구 좌표 사용)
    const coordinates = getRegionCoordinates(value.provinceCode, value.districtCode);
    if (onRegionChange) {
      onRegionChange(coordinates);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 시/도 선택 */}
      <select
        value={value.provinceCode || ''}
        onChange={(e) => handleProvinceChange(e.target.value)}
        className="
          text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg
          bg-white text-[#1C1C1E] border border-[#E5E5EA]
          hover:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2
          transition-all duration-200 ease-in-out
          min-w-[140px]
        "
        aria-label="시/도 선택"
      >
        <option value="">시/도 선택</option>
        {ALL_PROVINCES.map((province) => (
          <option key={province.code} value={province.code}>
            {province.name}
          </option>
        ))}
      </select>

      {/* 시/군/구 선택 (시/도 선택 후 활성화) */}
      {value.provinceCode && availableDistricts.length > 0 && (
        <select
          value={value.districtCode || ''}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="
            text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg
            bg-white text-[#1C1C1E] border border-[#E5E5EA]
            hover:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2
            transition-all duration-200 ease-in-out
            min-w-[140px]
          "
          aria-label="시/군/구 선택"
        >
          <option value="">시/군/구 선택</option>
          {availableDistricts.map((district) => (
            <option key={district.code} value={district.code}>
              {district.name}
            </option>
          ))}
        </select>
      )}

      {/* 구 선택 (시의 하위 구, 시/군/구 선택 후 활성화) */}
      {value.districtCode && availableSubDistricts && availableSubDistricts.length > 0 && (
        <select
          value={value.subDistrictCode || ''}
          onChange={(e) => handleSubDistrictChange(e.target.value)}
          className="
            text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-lg
            bg-white text-[#1C1C1E] border border-[#E5E5EA]
            hover:border-[#2E7D32] focus:outline-none focus:ring-2 focus:ring-[#2E7D32] focus:ring-offset-2
            transition-all duration-200 ease-in-out
            min-w-[140px]
          "
          aria-label="구 선택"
        >
          <option value="">구 선택</option>
          {availableSubDistricts.map((subDistrict) => (
            <option key={subDistrict.code} value={subDistrict.code}>
              {subDistrict.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

