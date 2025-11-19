/**
 * @file korean-regions.ts
 * @description 한국의 시/도, 시/군/구 데이터
 * 
 * 광역시는 구 단위까지 포함하고, 일반 시/도는 시/군 단위만 포함합니다.
 */

import type { Region, District } from '@/lib/types/region';

/**
 * 주요 광역시 목록 (7개)
 */
export const METROPOLITAN_CITIES: Region[] = [
  {
    code: '11',
    name: '서울특별시',
    type: 'metropolitan',
    districts: [
      { code: '11680', name: '강남구', type: 'gu' },
      { code: '11740', name: '강동구', type: 'gu' },
      { code: '11305', name: '강북구', type: 'gu' },
      { code: '11500', name: '강서구', type: 'gu' },
      { code: '11620', name: '관악구', type: 'gu' },
      { code: '11215', name: '광진구', type: 'gu' },
      { code: '11530', name: '구로구', type: 'gu' },
      { code: '11545', name: '금천구', type: 'gu' },
      { code: '11350', name: '노원구', type: 'gu' },
      { code: '11320', name: '도봉구', type: 'gu' },
      { code: '11230', name: '동대문구', type: 'gu' },
      { code: '11590', name: '동작구', type: 'gu' },
      { code: '11440', name: '마포구', type: 'gu' },
      { code: '11410', name: '서대문구', type: 'gu' },
      { code: '11650', name: '서초구', type: 'gu' },
      { code: '11200', name: '성동구', type: 'gu' },
      { code: '11290', name: '성북구', type: 'gu' },
      { code: '11710', name: '송파구', type: 'gu' },
      { code: '11470', name: '양천구', type: 'gu' },
      { code: '11560', name: '영등포구', type: 'gu' },
      { code: '11170', name: '용산구', type: 'gu' },
      { code: '11380', name: '은평구', type: 'gu' },
      { code: '11110', name: '종로구', type: 'gu' },
      { code: '11140', name: '중구', type: 'gu' },
      { code: '11260', name: '중랑구', type: 'gu' },
    ],
  },
  {
    code: '26',
    name: '부산광역시',
    type: 'metropolitan',
    districts: [
      { code: '26410', name: '강서구', type: 'gu' },
      { code: '26440', name: '금정구', type: 'gu' },
      { code: '26470', name: '기장군', type: 'county' },
      { code: '26290', name: '남구', type: 'gu' },
      { code: '26170', name: '동구', type: 'gu' },
      { code: '26260', name: '동래구', type: 'gu' },
      { code: '26230', name: '부산진구', type: 'gu' },
      { code: '26320', name: '북구', type: 'gu' },
      { code: '26530', name: '사상구', type: 'gu' },
      { code: '26380', name: '사하구', type: 'gu' },
      { code: '26140', name: '서구', type: 'gu' },
      { code: '26500', name: '수영구', type: 'gu' },
      { code: '26410', name: '연제구', type: 'gu' },
      { code: '26200', name: '영도구', type: 'gu' },
      { code: '26110', name: '중구', type: 'gu' },
      { code: '26560', name: '해운대구', type: 'gu' },
    ],
  },
  {
    code: '27',
    name: '대구광역시',
    type: 'metropolitan',
    districts: [
      { code: '27140', name: '남구', type: 'gu' },
      { code: '27200', name: '달서구', type: 'gu' },
      { code: '27710', name: '달성군', type: 'county' },
      { code: '27170', name: '동구', type: 'gu' },
      { code: '27230', name: '북구', type: 'gu' },
      { code: '27110', name: '중구', type: 'gu' },
      { code: '27260', name: '수성구', type: 'gu' },
      { code: '27110', name: '서구', type: 'gu' },
    ],
  },
  {
    code: '28',
    name: '인천광역시',
    type: 'metropolitan',
    districts: [
      { code: '28177', name: '강화군', type: 'county' },
      { code: '28185', name: '옹진군', type: 'county' },
      { code: '28200', name: '계양구', type: 'gu' },
      { code: '28237', name: '미추홀구', type: 'gu' },
      { code: '28245', name: '남동구', type: 'gu' },
      { code: '28260', name: '동구', type: 'gu' },
      { code: '28215', name: '부평구', type: 'gu' },
      { code: '28140', name: '서구', type: 'gu' },
      { code: '28110', name: '중구', type: 'gu' },
      { code: '28290', name: '연수구', type: 'gu' },
    ],
  },
  {
    code: '29',
    name: '광주광역시',
    type: 'metropolitan',
    districts: [
      { code: '29140', name: '광산구', type: 'gu' },
      { code: '29110', name: '남구', type: 'gu' },
      { code: '29155', name: '동구', type: 'gu' },
      { code: '29170', name: '북구', type: 'gu' },
      { code: '29120', name: '서구', type: 'gu' },
    ],
  },
  {
    code: '30',
    name: '대전광역시',
    type: 'metropolitan',
    districts: [
      { code: '30230', name: '대덕구', type: 'gu' },
      { code: '30110', name: '동구', type: 'gu' },
      { code: '30140', name: '서구', type: 'gu' },
      { code: '30170', name: '유성구', type: 'gu' },
      { code: '30200', name: '중구', type: 'gu' },
    ],
  },
  {
    code: '31',
    name: '울산광역시',
    type: 'metropolitan',
    districts: [
      { code: '31170', name: '남구', type: 'gu' },
      { code: '31200', name: '동구', type: 'gu' },
      { code: '31710', name: '울주군', type: 'county' },
      { code: '31140', name: '북구', type: 'gu' },
      { code: '31110', name: '중구', type: 'gu' },
    ],
  },
];

/**
 * 일반 시/도 목록 (9개)
 * 주요 시/군만 포함 (전체 시/군은 너무 많으므로 주요 도시 위주)
 */
export const PROVINCES: Region[] = [
  {
    code: '41',
    name: '경기도',
    type: 'province',
    districts: [
      { code: '41111', name: '수원시', type: 'city', subDistricts: [
        { code: '41115', name: '영통구' },
        { code: '41113', name: '팔달구' },
        { code: '41117', name: '장안구' },
        { code: '41114', name: '권선구' },
      ]},
      { code: '41131', name: '성남시', type: 'city', subDistricts: [
        { code: '41135', name: '수정구' },
        { code: '41133', name: '중원구' },
        { code: '41132', name: '분당구' },
      ]},
      { code: '41150', name: '의정부시', type: 'city' },
      { code: '41171', name: '안양시', type: 'city', subDistricts: [
        { code: '41173', name: '만안구' },
        { code: '41175', name: '동안구' },
      ]},
      { code: '41190', name: '부천시', type: 'city' },
      { code: '41210', name: '광명시', type: 'city' },
      { code: '41220', name: '평택시', type: 'city' },
      { code: '41250', name: '동두천시', type: 'city' },
      { code: '41270', name: '안산시', type: 'city', subDistricts: [
        { code: '41273', name: '상록구' },
        { code: '41275', name: '단원구' },
      ]},
      { code: '41280', name: '고양시', type: 'city', subDistricts: [
        { code: '41285', name: '덕양구' },
        { code: '41287', name: '일산동구' },
        { code: '41288', name: '일산서구' },
      ]},
      { code: '41290', name: '과천시', type: 'city' },
      { code: '41310', name: '구리시', type: 'city' },
      { code: '41360', name: '남양주시', type: 'city' },
      { code: '41370', name: '오산시', type: 'city' },
      { code: '41390', name: '시흥시', type: 'city' },
      { code: '41410', name: '군포시', type: 'city' },
      { code: '41430', name: '의왕시', type: 'city' },
      { code: '41450', name: '하남시', type: 'city' },
      { code: '41460', name: '용인시', type: 'city', subDistricts: [
        { code: '41463', name: '처인구' },
        { code: '41465', name: '기흥구' },
        { code: '41461', name: '수지구' },
      ]},
      { code: '41480', name: '파주시', type: 'city' },
      { code: '41500', name: '이천시', type: 'city' },
      { code: '41550', name: '안성시', type: 'city' },
      { code: '41570', name: '김포시', type: 'city' },
      { code: '41590', name: '화성시', type: 'city' },
      { code: '41610', name: '광주시', type: 'city' },
      { code: '41630', name: '양주시', type: 'city' },
      { code: '41650', name: '포천시', type: 'city' },
      { code: '41670', name: '여주시', type: 'city' },
      { code: '41800', name: '연천군', type: 'county' },
      { code: '41820', name: '가평군', type: 'county' },
      { code: '41830', name: '양평군', type: 'county' },
    ],
  },
  {
    code: '42',
    name: '강원도',
    type: 'province',
    districts: [
      { code: '42110', name: '춘천시', type: 'city' },
      { code: '42130', name: '원주시', type: 'city' },
      { code: '42150', name: '강릉시', type: 'city' },
      { code: '42170', name: '동해시', type: 'city' },
      { code: '42190', name: '태백시', type: 'city' },
      { code: '42210', name: '속초시', type: 'city' },
      { code: '42230', name: '삼척시', type: 'city' },
      { code: '42720', name: '홍천군', type: 'county' },
      { code: '42730', name: '횡성군', type: 'county' },
      { code: '42750', name: '영월군', type: 'county' },
      { code: '42760', name: '평창군', type: 'county' },
      { code: '42770', name: '정선군', type: 'county' },
      { code: '42780', name: '철원군', type: 'county' },
      { code: '42790', name: '화천군', type: 'county' },
      { code: '42800', name: '양구군', type: 'county' },
      { code: '42810', name: '인제군', type: 'county' },
      { code: '42820', name: '고성군', type: 'county' },
      { code: '42830', name: '양양군', type: 'county' },
    ],
  },
  {
    code: '43',
    name: '충청북도',
    type: 'province',
    districts: [
      { code: '43111', name: '청주시', type: 'city', subDistricts: [
        { code: '43112', name: '상당구' },
        { code: '43113', name: '서원구' },
        { code: '43114', name: '흥덕구' },
        { code: '43115', name: '청원구' },
      ]},
      { code: '43130', name: '충주시', type: 'city' },
      { code: '43150', name: '제천시', type: 'city' },
      { code: '43720', name: '보은군', type: 'county' },
      { code: '43730', name: '옥천군', type: 'county' },
      { code: '43740', name: '영동군', type: 'county' },
      { code: '43745', name: '증평군', type: 'county' },
      { code: '43750', name: '진천군', type: 'county' },
      { code: '43760', name: '괴산군', type: 'county' },
      { code: '43770', name: '음성군', type: 'county' },
      { code: '43800', name: '단양군', type: 'county' },
    ],
  },
  {
    code: '44',
    name: '충청남도',
    type: 'province',
    districts: [
      { code: '44131', name: '천안시', type: 'city', subDistricts: [
        { code: '44133', name: '동남구' },
        { code: '44135', name: '서북구' },
      ]},
      { code: '44150', name: '공주시', type: 'city' },
      { code: '44180', name: '보령시', type: 'city' },
      { code: '44200', name: '아산시', type: 'city' },
      { code: '44210', name: '서산시', type: 'city' },
      { code: '44230', name: '논산시', type: 'city' },
      { code: '44250', name: '계룡시', type: 'city' },
      { code: '44270', name: '당진시', type: 'city' },
      { code: '44710', name: '금산군', type: 'county' },
      { code: '44760', name: '부여군', type: 'county' },
      { code: '44770', name: '서천군', type: 'county' },
      { code: '44790', name: '청양군', type: 'county' },
      { code: '44800', name: '홍성군', type: 'county' },
      { code: '44810', name: '예산군', type: 'county' },
      { code: '44825', name: '태안군', type: 'county' },
    ],
  },
  {
    code: '45',
    name: '전라북도',
    type: 'province',
    districts: [
      { code: '45111', name: '전주시', type: 'city', subDistricts: [
        { code: '45113', name: '완산구' },
        { code: '45111', name: '덕진구' },
      ]},
      { code: '45130', name: '군산시', type: 'city' },
      { code: '45140', name: '익산시', type: 'city' },
      { code: '45180', name: '정읍시', type: 'city' },
      { code: '45190', name: '남원시', type: 'city' },
      { code: '45210', name: '김제시', type: 'city' },
      { code: '45710', name: '완주군', type: 'county' },
      { code: '45720', name: '진안군', type: 'county' },
      { code: '45730', name: '무주군', type: 'county' },
      { code: '45740', name: '장수군', type: 'county' },
      { code: '45750', name: '임실군', type: 'county' },
      { code: '45770', name: '순창군', type: 'county' },
      { code: '45790', name: '고창군', type: 'county' },
      { code: '45800', name: '부안군', type: 'county' },
    ],
  },
  {
    code: '46',
    name: '전라남도',
    type: 'province',
    districts: [
      { code: '46110', name: '목포시', type: 'city' },
      { code: '46130', name: '여수시', type: 'city' },
      { code: '46150', name: '순천시', type: 'city' },
      { code: '46170', name: '나주시', type: 'city' },
      { code: '46230', name: '광양시', type: 'city' },
      { code: '46710', name: '담양군', type: 'county' },
      { code: '46720', name: '곡성군', type: 'county' },
      { code: '46730', name: '구례군', type: 'county' },
      { code: '46770', name: '고흥군', type: 'county' },
      { code: '46780', name: '보성군', type: 'county' },
      { code: '46790', name: '화순군', type: 'county' },
      { code: '46800', name: '장흥군', type: 'county' },
      { code: '46810', name: '강진군', type: 'county' },
      { code: '46820', name: '해남군', type: 'county' },
      { code: '46830', name: '영암군', type: 'county' },
      { code: '46840', name: '무안군', type: 'county' },
      { code: '46860', name: '함평군', type: 'county' },
      { code: '46870', name: '영광군', type: 'county' },
      { code: '46880', name: '장성군', type: 'county' },
      { code: '46890', name: '완도군', type: 'county' },
      { code: '46900', name: '진도군', type: 'county' },
      { code: '46910', name: '신안군', type: 'county' },
    ],
  },
  {
    code: '47',
    name: '경상북도',
    type: 'province',
    districts: [
      { code: '47111', name: '포항시', type: 'city', subDistricts: [
        { code: '47113', name: '남구' },
        { code: '47111', name: '북구' },
      ]},
      { code: '47130', name: '경주시', type: 'city' },
      { code: '47150', name: '김천시', type: 'city' },
      { code: '47170', name: '안동시', type: 'city' },
      { code: '47190', name: '구미시', type: 'city' },
      { code: '47210', name: '영주시', type: 'city' },
      { code: '47230', name: '영천시', type: 'city' },
      { code: '47250', name: '상주시', type: 'city' },
      { code: '47270', name: '문경시', type: 'city' },
      { code: '47290', name: '경산시', type: 'city' },
      { code: '47720', name: '군위군', type: 'county' },
      { code: '47730', name: '의성군', type: 'county' },
      { code: '47750', name: '청송군', type: 'county' },
      { code: '47760', name: '영양군', type: 'county' },
      { code: '47770', name: '영덕군', type: 'county' },
      { code: '47820', name: '청도군', type: 'county' },
      { code: '47830', name: '고령군', type: 'county' },
      { code: '47840', name: '성주군', type: 'county' },
      { code: '47850', name: '칠곡군', type: 'county' },
      { code: '47900', name: '예천군', type: 'county' },
      { code: '47920', name: '봉화군', type: 'county' },
      { code: '47930', name: '울진군', type: 'county' },
      { code: '47940', name: '울릉군', type: 'county' },
    ],
  },
  {
    code: '48',
    name: '경상남도',
    type: 'province',
    districts: [
      { code: '48121', name: '창원시', type: 'city', subDistricts: [
        { code: '48123', name: '의창구' },
        { code: '48125', name: '성산구' },
        { code: '48127', name: '마산합포구' },
        { code: '48129', name: '마산회원구' },
        { code: '48121', name: '진해구' },
      ]},
      { code: '48170', name: '진주시', type: 'city' },
      { code: '48220', name: '통영시', type: 'city' },
      { code: '48240', name: '사천시', type: 'city' },
      { code: '48250', name: '김해시', type: 'city' },
      { code: '48270', name: '밀양시', type: 'city' },
      { code: '48310', name: '거제시', type: 'city' },
      { code: '48330', name: '양산시', type: 'city' },
      { code: '48720', name: '의령군', type: 'county' },
      { code: '48730', name: '함안군', type: 'county' },
      { code: '48740', name: '창녕군', type: 'county' },
      { code: '48820', name: '고성군', type: 'county' },
      { code: '48840', name: '남해군', type: 'county' },
      { code: '48850', name: '하동군', type: 'county' },
      { code: '48860', name: '산청군', type: 'county' },
      { code: '48870', name: '함양군', type: 'county' },
      { code: '48880', name: '거창군', type: 'county' },
      { code: '48890', name: '합천군', type: 'county' },
    ],
  },
  {
    code: '50',
    name: '제주특별자치도',
    type: 'special',
    districts: [
      { code: '50110', name: '제주시', type: 'city' },
      { code: '50130', name: '서귀포시', type: 'city' },
    ],
  },
  {
    code: '36',
    name: '세종특별자치시',
    type: 'special',
    districts: [], // 구 없음
  },
];

/**
 * 전체 시/도 목록 (광역시 + 일반 시/도)
 */
export const ALL_PROVINCES: Region[] = [
  ...METROPOLITAN_CITIES,
  ...PROVINCES,
];

/**
 * 시/도 코드로 시/도 찾기
 */
export function findProvinceByCode(code: string): Region | undefined {
  return ALL_PROVINCES.find((p) => p.code === code);
}

/**
 * 시/도 이름으로 시/도 찾기
 */
export function findProvinceByName(name: string): Region | undefined {
  return ALL_PROVINCES.find((p) => p.name === name || p.name.replace(/특별시|광역시|특별자치도|특별자치시/g, '') === name);
}





