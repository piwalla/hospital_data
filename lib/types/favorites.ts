/**
 * @file favorites.ts
 * @description 즐겨찾기 관련 타입 정의
 */

export type EntityType = 'hospital' | 'rehabilitation_center';

export interface Favorite {
  id: string;
  user_id: string;
  entity_type: EntityType;
  entity_id: string;
  created_at: string;
}

export interface FavoriteWithHospital {
  id: string;
  user_id: string;
  entity_type: 'hospital';
  entity_id: string;
  created_at: string;
  hospital: {
    id: string;
    name: string;
    type: 'hospital' | 'pharmacy';
    address: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    department: string | null;
    institution_type: string | null;
    department_extracted: string | null;
  };
}

export interface FavoriteWithRehabilitationCenter {
  id: string;
  user_id: string;
  entity_type: 'rehabilitation_center';
  entity_id: string;
  created_at: string;
  rehabilitation_center: {
    id: string;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    phone: string | null;
    gigwan_fg_nm: string | null;
  };
}

export type FavoriteWithEntity = FavoriteWithHospital | FavoriteWithRehabilitationCenter;





