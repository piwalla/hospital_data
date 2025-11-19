/**
 * @file institution-classifier.ts
 * @description 기관명에서 기관 유형과 진료과목을 추출하는 유틸리티 함수
 *
 * 기관명(name)을 분석하여:
 * 1. 기관 유형 (대학병원, 종합병원, 병원, 의원, 한의원, 요양병원 등)
 * 2. 진료과목 (정형외과, 신경외과, 재활의학과, 내과, 외과 등)
 * 을 추출합니다.
 */

/**
 * 기관 유형 타입 정의
 */
export type InstitutionType =
  | '대학병원'
  | '종합병원'
  | '병원'
  | '의원'
  | '한의원'
  | '요양병원'
  | '기타';

/**
 * 기관명에서 기관 유형을 추출
 * 
 * @param name 기관명
 * @returns 기관 유형
 */
export function extractInstitutionType(name: string): InstitutionType {
  const normalizedName = name.trim();

  // 대학병원 (우선순위: 높음)
  if (normalizedName.includes('대학병원') || normalizedName.includes('대학교병원')) {
    return '대학병원';
  }

  // 종합병원
  if (normalizedName.includes('종합병원')) {
    return '종합병원';
  }

  // 한의원 (병원보다 우선)
  if (normalizedName.includes('한의원') || normalizedName.includes('한방병원')) {
    return '한의원';
  }

  // 요양병원
  if (normalizedName.includes('요양병원')) {
    return '요양병원';
  }

  // 의원
  if (normalizedName.includes('의원')) {
    return '의원';
  }

  // 병원
  if (normalizedName.includes('병원')) {
    return '병원';
  }

  // 기타
  return '기타';
}

/**
 * 진료과목 타입 정의
 */
export type DepartmentType =
  | '정형외과'
  | '신경외과'
  | '재활의학과'
  | '내과'
  | '외과'
  | '정신과'
  | '산부인과'
  | '소아과'
  | '이비인후과'
  | '안과'
  | '치과'
  | '피부과'
  | '비뇨의학과'
  | '정신건강의학과'
  | '마취과'
  | '영상의학과'
  | '병리과'
  | '기타';

/**
 * 기관명에서 진료과목을 추출
 * 
 * @param name 기관명
 * @returns 진료과목 배열 (여러 과목이 포함된 경우)
 */
export function extractDepartments(name: string): DepartmentType[] {
  const normalizedName = name.trim();
  const departments: DepartmentType[] = [];

  // 진료과목 키워드 매칭 (우선순위 순서)
  const departmentKeywords: Array<{ keyword: string; department: DepartmentType }> = [
    { keyword: '정형외과', department: '정형외과' },
    { keyword: '신경외과', department: '신경외과' },
    { keyword: '재활의학과', department: '재활의학과' },
    { keyword: '재활의학', department: '재활의학과' },
    { keyword: '정신건강의학과', department: '정신건강의학과' },
    { keyword: '정신과', department: '정신과' },
    { keyword: '산부인과', department: '산부인과' },
    { keyword: '소아과', department: '소아과' },
    { keyword: '소아청소년과', department: '소아과' },
    { keyword: '이비인후과', department: '이비인후과' },
    { keyword: '안과', department: '안과' },
    { keyword: '치과', department: '치과' },
    { keyword: '피부과', department: '피부과' },
    { keyword: '비뇨의학과', department: '비뇨의학과' },
    { keyword: '비뇨기과', department: '비뇨의학과' },
    { keyword: '마취과', department: '마취과' },
    { keyword: '영상의학과', department: '영상의학과' },
    { keyword: '병리과', department: '병리과' },
    { keyword: '내과', department: '내과' },
    { keyword: '외과', department: '외과' },
  ];

  // 키워드 매칭
  for (const { keyword, department } of departmentKeywords) {
    if (normalizedName.includes(keyword) && !departments.includes(department)) {
      departments.push(department);
    }
  }

  // 진료과목이 없으면 '기타' 반환
  return departments.length > 0 ? departments : ['기타'];
}

/**
 * 기관명에서 첫 번째 진료과목만 추출 (단일 값이 필요한 경우)
 * 
 * @param name 기관명
 * @returns 첫 번째 진료과목 또는 '기타'
 */
export function extractPrimaryDepartment(name: string): DepartmentType {
  const departments = extractDepartments(name);
  return departments[0] || '기타';
}








