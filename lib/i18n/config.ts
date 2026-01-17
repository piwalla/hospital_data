export const locales = ['ko', 'en', 'zh', 'vi', 'th', 'uz', 'mn', 'id', 'ne', 'hi'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'ko';

export const languageNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  vi: 'Tiếng Việt',
  th: 'ไทย',
  uz: "O'zbek",
  mn: 'Монгол хэл',
  id: 'Bahasa Indonesia',
  ne: 'नेपाली',
  hi: 'हिन्दी',
};

export const languageFlags: Record<Locale, string> = {
  ko: 'KR',
  en: 'US',
  zh: 'CN',
  vi: 'VN',
  th: 'TH',
  uz: 'UZ',
  mn: 'MN',
  id: 'ID',
  ne: 'NP',
  hi: 'IN',
};

export interface ChatbotTranslation {
  title: string;
  subtitle: string;
  placeholder: string;
  recQuestions: string[];
  legalNotice: string;
  share: string;
  copied: string;
  send: string;
  sourceTitle: string;
  disclaimer: string;
  pageHeroTitle: string;
  pageHeroSubtitle: string;
  footerSourceTitle: string;
  footerSourceDesc: string;
  footerLimitTitle: string;
  footerLimitDesc: string;
  loadingMessage: string;
  errorTooShort: string;
  errorServer: string;
  errorNoResponse: string;
  errorTimeout: string;
  errorGeneric: string;
  limitModalTitle: string;
  limitModalDesc: string;
  limitModalButton: string;
  limitModalLater: string;
}

export interface LandingTranslation {
  heroTitlePrefix: string;
  heroTitleSuffix: string;
  heroDescription: string;
  heroCta: string;
  statsTitle: string;
  statsDescription: string;
  statDocsLabel: string;
  statDocsDesc: string;
  statVideoLabel: string;
  statVideoDesc: string;
  statHospitalLabel: string;
  statHospitalDesc: string;
  statRehabLabel: string;
  statRehabDesc: string;
  statSource: string;
  feature1Title: string;
  feature1Desc: string;
  feature1Cta: string;
  feature2Title: string;
  feature2Desc: string;
  feature2Cta: string;
  feature3Title: string;
  feature3Desc: string;
  feature3Cta: string;
  feature4Title: string;
  feature4Desc: string;
  feature4Cta: string;
  bottomTitlePrefix: string;
  bottomTitleSuffix: string;
  bottomDescription: string;
  bottomCta: string;
  imageNotice: string;
  nuanceDisclaimer: string;
}

export interface NavTranslation {
  brand: string;
  dashboard: string;
  chatbot: string;
  timeline: string;
  hospitals: string;
  documents: string;
  counseling: string;
}

export interface FooterTranslation {
  brand: string;
  slogan: string;
  description: string;
  aboutLink: string;
  notice: string;
  legalDisclaimer: string;
  copyright: string;
  terms: string;
  privacy: string;
  csContact: string;
  csTitle: string;
  csPlaceholder: string;
  csEmpty: string;
  csSendError: string;
}

export interface AboutTranslation {
  heroBadge: string;
  heroTitle: string;
  heroDescription: string;
  storyTitle: string;
  storyP1: string;
  storyP2: string;
  storyP3: string;
  storyP4: string;
  solutionsTitle: string;
  solutionsDescription: string;
  solution1Title: string;
  solution1Desc: string;
  solution2Title: string;
  solution2Desc: string;
  solution3Title: string;
  solution3Desc: string;
  solution4Title: string;
  solution4Desc: string;
  aiBadge: string;
  aiTitle: string;
  aiDescription: string;
  aiFeat1Title: string;
  aiFeat1Desc: string;
  aiFeat2Title: string;
  aiFeat2Desc: string;
  aiFeat3Title: string;
  aiFeat3Desc: string;
  techStackTitle: string;
  techNextDesc: string;
  techSupaDesc: string;
  techGeminiDesc: string;
  techRagDesc: string;
  techMapDesc: string;
  techAuthDesc: string;
  closingTitle: string;
  closingDescription: string;
}

export interface TimelineTranslation {
  heroTitle: string;
  heroDescription: string;
  videoBtn: string;
  videoTitle: string;
  firstVisitTitle: string;
  firstVisitDesc: string;
  videoTip: string;
  aiVideoNotice: string;
  aiDocNotice: string;
  docDetailTip: string;
  docDetailBtn: string;
  legalTitle: string;
  legalNotice: string;
  prevStep: string;
  nextStep: string;
  nextCondition: string;
  guideTitle: string;
  tabs: {
    guide: string;
    actions: string;
    documents: string;
    warnings: string;
  };
  stages: Record<number, {
    title: string;
    description: string;
    videoUrlTitle: string;
    videoDesc: string;
  }>;
  status: {
    inProgress: string;
    actions: string;
    documents: string;
    required: string;
    emptyActions: string;
    emptyDocuments: string;
    emptyWarnings: string;
  };
  dictionary: Record<string, string>;
}



export interface CalculatorTranslation {
  title: string;
  description: string;
  sections: {
    wageInput: {
      title: string;
      desc: string;
      labels: {
        m1: string;
        m2: string;
        m3: string;
      };
    };
    ageCheck: {
      title: string;
      desc: string;
      realAge: string;
      note: string;
    };
    result: {
      title: string;
      averageWage: {
        title: string;
        btn: string;
      };
      sickLeave: {
        title: string;
        btn: string;
      };
      disability: {
        title: string;
        desc: string;
        btn: string;
      };
    };
    footer: {
      title: string;
      desc: string;
    };
  };
  buttons: {
    calculate: string;
    viewReport: string;
    save: string;
    saving: string;
    backToDashboard: string;
  };
  units: {
    won: string;
    year: string;
    days: string;
    age: string;
  };
  alerts: {
    calculateFirst: string;
    inputRequired: string;
    saveSuccess: string;
    saveFail: string;
    disclaimerTitle: string;
    disclaimerContent: string;
  };
  dialogs: {
    averageWage: {
      title: string;
      calculated: string;
      basis: string;
      basisDesc: string;
      note: string;
    };
    sickLeave: {
      title: string;
      expected: string;
      perDay: string;
      adjustDays: string;
      specialCase: string;
      specialCaseDesc: string;
      calculation: string;
    };
    disability: {
      title: string;
      grade: string;
      pensionOnly: string;
      lumpOnly: string;
      choice: string;
      pension: string;
      lump: string;
      expectedPension: string;
      expectedLump: string;
    };
  };
}

export interface HospitalTranslation {
  filters: {
    hospital: string;
    pharmacy: string;
    rehabilitation: string;
    certified: string;
    sports: string;
    job: string;
    all: string;
    detailed: string;
  };
  sections: {
    nearMe: string;
    selectRegion: string;
    selectRegionBtn: string;
    types: string;
    hospitalType: string;
    myLocation: string;
    more: string;
    listHeader: string;
    mobileView: {
      map: string;
      list: string;
    };
    disclaimer: {
      title: string;
      source: string;
      realtime: string;
      certDate: string;
    };
  };
  messages: {
    foundNearby: string;
    foundRegion: string;
    noResult: string;
    moveMap: string;
  };
  infoWindow: {
    call: string;
    directions: string;
    certified: string;
    address: string;
  };
  hero: {
    title: string;
    subtitle: string;
    highlight: string;
  };
  departments: {
    orthopedics: string;
    dentistry: string;
    neurosurgery: string;
    surgery: string;
    rehabMedicine: string;
    radiology: string;
    ophthalmology: string;
    psychiatry: string;
    internalMedicine: string;
    ent: string;
    urology: string;
  };
}

export const hospitalTranslations: Record<Locale, HospitalTranslation> = {
  ko: {
    filters: {
      hospital: '병원',
      pharmacy: '약국',
      rehabilitation: '재활기관',
      certified: '산재재활인증',
      sports: '재활스포츠기관',
      job: '직업훈련기관',
      all: '전체',
      detailed: '더 자세한 조건 검색',
    },
    sections: {
      nearMe: '내 위치 주변',
      selectRegion: '지역 선택',
      selectRegionBtn: '지역 선택하기',
      types: '종류',
      hospitalType: '병원 종류',
      myLocation: '내 위치',
      more: '더보기',
      listHeader: '산재 지정 의료기관 리스트',
      mobileView: {
        map: '지도 보기',
        list: '목록 보기',
      },
      disclaimer: {
        title: '주의사항',
        source: '본 서비스에 표시된 병원, 약국, 재활기관, 직업훈련기관 정보는 근로복지공단에서 제공하는 공개 API를 활용하여 제공됩니다.',
        realtime: '해당 정보는 실시간 정보가 아니며, 산재 지정이 취소되거나 기관이 폐업하는 경우 변동이 생길 수 있습니다. 정확한 정보는 근로복지공단 홈페이지(www.comwel.or.kr)에서 확인하시기 바랍니다.',
        certDate: '* 산재재활인증 기관은 2025년 6월 30일 기준입니다.',
      },
    },
    messages: {
      foundNearby: '반경 {radius}km 내에 {count}개의 지정 의료기관이 있습니다.',
      foundRegion: '{region} 지역에 {count}개의 지정 의료기관이 있습니다.',
      noResult: '병원/재활기관이 없습니다.',
      moveMap: '지도를 이동하면 해당 위치 기준으로 검색됩니다.',
    },
    infoWindow: {
      call: '전화',
      directions: '길찾기',
      certified: '산재재활인증',
      address: '주소:',
    },
    hero: {
      title: '어디서',
      highlight: '치료되나요?',
      subtitle: '가까운 산재 지정 의료기관을 쉽고 빠르게 찾아보세요.',
    },
    departments: {
      orthopedics: '정형외과',
      dentistry: '치과',
      neurosurgery: '신경외과',
      surgery: '외과',
      rehabMedicine: '재활의학과',
      radiology: '영상의학과',
      ophthalmology: '안과',
      psychiatry: '정신건강의학과',
      internalMedicine: '내과',
      ent: '이비인후과',
      urology: '비뇨의학과',
    },
  },
  en: {
    filters: {
      hospital: 'Hospital',
      pharmacy: 'Pharmacy',
      rehabilitation: 'Rehab Center',
      certified: 'Certified',
      sports: 'Sports Rehab',
      job: 'Job Training',
      all: 'All',
      detailed: 'Advanced Search',
    },
    sections: {
      nearMe: 'Near Me',
      selectRegion: 'Select Region',
      selectRegionBtn: 'Choose Region',
      types: 'Types',
      hospitalType: 'Departments',
      myLocation: 'My Location',
      more: 'More',
      listHeader: 'Industrial Accident Medical Institutions List',
      mobileView: {
        map: 'Map View',
        list: 'List View',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{count} medical institutions found within {radius}km.',
      foundRegion: '{count} medical institutions found in {region}.',
      noResult: 'No hospitals found.',
      moveMap: 'Move the map to search in that area.',
    },
    infoWindow: {
      call: 'Call',
      directions: 'Directions',
      certified: 'Certified',
      address: 'Address:',
    },
    hero: {
      title: 'Where can I get',
      highlight: 'treatment?',
      subtitle: 'Easily find nearby certified medical institutions for industrial accidents.',
    },
    departments: {
      orthopedics: 'Orthopedics',
      dentistry: 'Dentistry',
      neurosurgery: 'Neurosurgery',
      surgery: 'Surgery',
      rehabMedicine: 'Rehab. Med.',
      radiology: 'Radiology',
      ophthalmology: 'Ophthalmology',
      psychiatry: 'Psychiatry',
      internalMedicine: 'Internal Med.',
      ent: 'ENT',
      urology: 'Urology',
    },
  },
  zh: {
    filters: {
      hospital: '医院',
      pharmacy: '药店',
      rehabilitation: '康复中心',
      certified: '认证机构',
      sports: '运动康复',
      job: '职业培训',
      all: '全部',
      detailed: '高级搜索',
    },
    sections: {
      nearMe: '我附近',
      selectRegion: '选择地区',
      selectRegionBtn: '选择地区',
      types: '类型',
      hospitalType: '诊疗科目',
      myLocation: '我的位置',
      more: '更多',
      listHeader: '工伤指定医疗机构列表',
      mobileView: {
        map: '查看地图',
        list: '查看列表',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{radius}km范围内有{count}个指定医疗机构。',
      foundRegion: '{region}地区有{count}个指定医疗机构。',
      noResult: '没有找到医院/康复中心。',
      moveMap: '移动地图将在该位置搜索。',
    },
    infoWindow: {
      call: '致电',
      directions: '路线',
      certified: '工伤康复认证',
      address: '地址:',
    },
    hero: {
      title: '在哪里可以接受',
      highlight: '治疗?',
      subtitle: '轻松快速查找附近的工伤指定医疗机构。',
    },
    departments: {
      orthopedics: '整形外科',
      dentistry: '牙科',
      neurosurgery: '神经外科',
      surgery: '外科',
      rehabMedicine: '康复医学科',
      radiology: '影像医学科',
      ophthalmology: '眼科',
      psychiatry: '精神健康医学科',
      internalMedicine: '内科',
      ent: '耳鼻喉科',
      urology: '泌尿医学科',
    },
  },
  vi: {
    filters: {
      hospital: 'Bệnh viện',
      pharmacy: 'Nhà thuốc',
      rehabilitation: 'TT Phục hồi',
      certified: 'Được chứng nhận',
      sports: 'PHCN Thể thao',
      job: 'Đào tạo nghề',
      all: 'Tất cả',
      detailed: 'Tìm kiếm nâng cao',
    },
    sections: {
      nearMe: 'Gần tôi',
      selectRegion: 'Chọn khu vực',
      selectRegionBtn: 'Chọn khu vực',
      types: 'Loại hình',
      hospitalType: 'Chuyên khoa',
      myLocation: 'Vị trí của tôi',
      more: 'Xem thêm',
      listHeader: 'Danh sách cơ sở y tế được chỉ định',
      mobileView: {
        map: 'Xem bản đồ',
        list: 'Xem danh sách',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: 'Tìm thấy {count} cơ sở y tế trong bán kính {radius}km.',
      foundRegion: 'Tìm thấy {count} cơ sở y tế tại {region}.',
      noResult: 'Không tìm thấy bệnh viện.',
      moveMap: 'Di chuyển bản đồ để tìm kiếm.',
    },
    infoWindow: {
      call: 'Gọi điện',
      directions: 'Chỉ đường',
      certified: 'Chứng nhận',
      address: 'Địa chỉ:',
    },
    hero: {
      title: 'Tôi có thể điều trị',
      highlight: 'ở đâu?',
      subtitle: 'Dễ dàng tìm kiếm các cơ sở y tế được chỉ định tai nạn lao động gần đây.',
    },
    departments: {
      orthopedics: 'Chỉnh hình',
      dentistry: 'Nha khoa',
      neurosurgery: 'Ngoại thần kinh',
      surgery: 'Ngoại khoa',
      rehabMedicine: 'VL trị liệu',
      radiology: 'Chẩn đoán hình ảnh',
      ophthalmology: 'Nhãn khoa',
      psychiatry: 'Tâm thần',
      internalMedicine: 'Nội khoa',
      ent: 'Tai Mũi Họng',
      urology: 'Tiết niệu',
    },
  },
  th: {
    filters: {
      hospital: 'โรงพยาบาล',
      pharmacy: 'ร้านขายยา',
      rehabilitation: 'ศูนย์ฟื้นฟู',
      certified: 'ได้รับการรับรอง',
      sports: 'ฟื้นฟูการกีฬา',
      job: 'ฝึกอาชีพ',
      all: 'ทั้งหมด',
      detailed: 'ค้นหาขั้นสูง',
    },
    sections: {
      nearMe: 'ใกล้ฉัน',
      selectRegion: 'เลือกพื้นที่',
      selectRegionBtn: 'เลือกพื้นที่',
      types: 'ประเภท',
      hospitalType: 'แผนก',
      myLocation: 'ตำแหน่งของฉัน',
      more: 'เพิ่มเติม',
      listHeader: 'รายชื่อสถานพยาบาลที่กำหนด',
      mobileView: {
        map: 'ดูแผนที่',
        list: 'ดูรายการ',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: 'พบสถานพยาบาล {count} แห่งในรัศมี {radius} กม.',
      foundRegion: 'พบสถานพยาบาล {count} แห่งใน {region}',
      noResult: 'ไม่พบโรงพยาบาล',
      moveMap: 'เลื่อนแผนที่เพื่อค้นหา',
    },
    infoWindow: {
      call: 'โทร',
      directions: 'เส้นทาง',
      certified: 'รับรองแล้ว',
      address: 'ที่อยู่:',
    },
    hero: {
      title: 'ฉันจะเข้ารับการรักษา',
      highlight: 'ได้ที่ไหน?',
      subtitle: 'ค้นหาสถานพยาบาลที่ได้รับการรับรองสำหรับอุบัติเหตุทางอุตสาหกรรมในบริเวณใกล้เคียงได้อย่างง่ายดาย',
    },
    departments: {
      orthopedics: 'ศัลยกรรมกระดูก',
      dentistry: 'ทันตกรรม',
      neurosurgery: 'ศัลยกรรมประสาท',
      surgery: 'ศัลยกรรม',
      rehabMedicine: 'เวชศาสตร์ฟื้นฟู',
      radiology: 'รังสีวิทยา',
      ophthalmology: 'จักษุวิทยา',
      psychiatry: 'จิตเวชศาสตร์',
      internalMedicine: 'อายุรกรรม',
      ent: 'หู คอ จมูก',
      urology: 'ศัลยกรรมทางเดินปัสสาวะ',
    },
  },
  uz: {
    filters: {
      hospital: 'Kasalxona',
      pharmacy: 'Dorixona',
      rehabilitation: 'Reabilitatsiya',
      certified: 'Tasdiqlangan',
      sports: 'Sport Reabilitatsiya',
      job: 'Kasbiy ta\'lim',
      all: 'Barchasi',
      detailed: 'Kengaytirilgan qidiruv',
    },
    sections: {
      nearMe: 'Yaqinimda',
      selectRegion: 'Hududni tanlash',
      selectRegionBtn: 'Hududni tanlash',
      types: 'Turlari',
      hospitalType: 'Bo\'limlar',
      myLocation: 'Mening joylashuvim',
      more: 'Ko\'proq',
      listHeader: 'Belgilangan tibbiyot muassasalari ro\'yxati',
      mobileView: {
        map: 'Xaritani ko\'rish',
        list: 'Ro\'yxatni ko\'rish',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{radius}km radiusda {count} ta tibbiy muassasa topildi.',
      foundRegion: '{region} hududida {count} ta tibbiy muassasa topildi.',
      noResult: 'Kasalxona topilmadi.',
      moveMap: 'Qidirish uchun xaritani suring.',
    },
    infoWindow: {
      call: 'Qo\'ng\'iroq',
      directions: 'Yo\'nalish',
      certified: 'Tasdiqlangan',
      address: 'Manzil:',
    },
    hero: {
      title: 'Qayerda',
      highlight: 'davolanish mumkin?',
      subtitle: 'Yaqin atrofdagi sanoat baxtsiz hodisalari uchun belgilangan tibbiy muassasalarni oson va tez toping.',
    },
    departments: {
      orthopedics: 'Ortopediya',
      dentistry: 'Stomatologiya',
      neurosurgery: 'Neyrojarrohlik',
      surgery: 'Jarrohlik',
      rehabMedicine: 'Reabilitatsiya',
      radiology: 'Radiologiya',
      ophthalmology: 'Ko\'z kasalliklari',
      psychiatry: 'Psixiatriya',
      internalMedicine: 'Ichki kasalliklar',
      ent: 'LOR',
      urology: 'Urologiya',
    },
  },
  mn: {
    filters: {
      hospital: 'Эмнэлэг',
      pharmacy: 'Эмийн сан',
      rehabilitation: 'Сэргээн засах',
      certified: 'Баталгаажсан',
      sports: 'Спортын сэргээн засах',
      job: 'Мэргэжлийн сургалт',
      all: 'Бүгд',
      detailed: 'Дэлгэрэнгүй хайлт',
    },
    sections: {
      nearMe: 'Миний ойр',
      selectRegion: 'Бүс нутаг сонгох',
      selectRegionBtn: 'Бүс нутаг сонгох',
      types: 'Төрөл',
      hospitalType: 'Тасгууд',
      myLocation: 'Миний байршил',
      more: 'Дэлгэрэнгүй',
      listHeader: 'Зориулалтын эмнэлгийн байгууллагын жагсаалт',
      mobileView: {
        map: 'Газрын зураг',
        list: 'Жагсаалт',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{radius}км радиуст {count} эмнэлгийн байгууллага олдлоо.',
      foundRegion: '{region} бүсэд {count} эмнэлгийн байгууллага олдлоо.',
      noResult: 'Эмнэлэг олдсонгүй.',
      moveMap: 'Хайхын тулд газрын зургийг хөдөлгөнө үү.',
    },
    infoWindow: {
      call: 'Залгах',
      directions: 'Чиглэл',
      certified: 'Баталгаажсан',
      address: 'Хаяг:',
    },
    hero: {
      title: 'Хаана',
      highlight: 'эмчлүүлэх вэ?',
      subtitle: 'Ойролцоох үйлдвэрлэлийн ослын зориулалттай эмнэлгийн байгууллагуудыг хялбар, хурдан олоорой.',
    },
    departments: {
      orthopedics: 'Гэмтэл согог',
      dentistry: 'Шүдний эмнэлэг',
      neurosurgery: 'Мэдрэлийн мэс засал',
      surgery: 'Мэс засал',
      rehabMedicine: 'Сэргээн засах',
      radiology: 'Дүрс оношилгоо',
      ophthalmology: 'Нүдний эмнэлэг',
      psychiatry: 'Сэтгэц судлал',
      internalMedicine: 'Дотор',
      ent: 'Чи хамар хоолой',
      urology: 'Бөөр, шээсний зам',
    },
  },
  id: {
    filters: {
      hospital: 'Rumah Sakit',
      pharmacy: 'Apotek',
      rehabilitation: 'Pusat Rehab',
      certified: 'Tersertifikasi',
      sports: 'Rehab Olahraga',
      job: 'Pelatihan Kerja',
      all: 'Semua',
      detailed: 'Pencarian Lanjutan',
    },
    sections: {
      nearMe: 'Dekat Saya',
      selectRegion: 'Pilih Wilayah',
      selectRegionBtn: 'Pilih Wilayah',
      types: 'Jenis',
      hospitalType: 'Departemen',
      myLocation: 'Lokasi Saya',
      more: 'Lainya',
      listHeader: 'Daftar Institusi Medis yang Ditunjuk',
      mobileView: {
        map: 'Lihat Peta',
        list: 'Lihat Daftar',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: 'Ditemukan {count} fasilitas medis dalam radius {radius}km.',
      foundRegion: 'Ditemukan {count} fasilitas medis di {region}.',
      noResult: 'Tidak ada rumah sakit ditemukan.',
      moveMap: 'Geser peta untuk mencari.',
    },
    infoWindow: {
      call: 'Panggil',
      directions: 'Rute',
      certified: 'Tersertifikasi',
      address: 'Alamat:',
    },
    hero: {
      title: 'Di mana saya bisa mendapatkan',
      highlight: 'pengobatan?',
      subtitle: 'Temukan institusi medis bersertifikat terdekat untuk kecelakaan industri dengan mudah.',
    },
    departments: {
      orthopedics: 'Ortopedi',
      dentistry: 'Gigi',
      neurosurgery: 'Bedah Saraf',
      surgery: 'Bedah',
      rehabMedicine: 'Rehab Medik',
      radiology: 'Radiologi',
      ophthalmology: 'Mata',
      psychiatry: 'Psikiatri',
      internalMedicine: 'Penyakit Dalam',
      ent: 'THT',
      urology: 'Urologi',
    },
  },
  ne: {
    filters: {
      hospital: 'अस्पताल',
      pharmacy: 'औषधि पसल',
      rehabilitation: 'पुनर्स्थापना केन्द्र',
      certified: 'प्रमाणित',
      sports: 'खेल पुनर्स्थापना',
      job: 'व्यावसायिक तालिम',
      all: 'सबै',
      detailed: 'विस्तृत खोज',
    },
    sections: {
      nearMe: 'मेरो नजिक',
      selectRegion: 'क्षेत्र छान्नुहोस्',
      selectRegionBtn: 'क्षेत्र छान्नुहोस्',
      types: 'प्रकार',
      hospitalType: 'विभागहरू',
      myLocation: 'मेरो स्थान',
      more: 'थप',
      listHeader: 'तोकिएको चिकित्सा संस्थाहरूको सूची',
      mobileView: {
        map: 'नक्सा हेर्नुहोस्',
        list: 'सूची हेर्नुहोस्',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{radius} किमी भित्र {count} स्वास्थ्य संस्था भेटिए।',
      foundRegion: '{region} क्षेत्रमा {count} स्वास्थ्य संस्था भेटिए।',
      noResult: 'कुनै अस्पताल भेटिएन।',
      moveMap: 'खोज्नको लागि नक्सा सार्नुहोस्।',
    },
    infoWindow: {
      call: 'कल गर्नुहोस्',
      directions: 'दिशा',
      certified: 'प्रमाणित',
      address: 'ठेगाना:',
    },
    hero: {
      title: 'म कहाँ उपचार',
      highlight: 'पाउन सक्छु?',
      subtitle: 'औद्योगिक दुर्घटनाका लागि नजिकैको प्रमाणित चिकित्सा संस्थाहरू सजिलै खोज्नुहोस्।',
    },
    departments: {
      orthopedics: 'हाडजोर्नी',
      dentistry: 'दन्त',
      neurosurgery: 'न्यूरोसर्जरी',
      surgery: 'शल्यक्रिया',
      rehabMedicine: 'पुनर्स्थापना',
      radiology: 'रेडियोलोजी',
      ophthalmology: 'आँखा',
      psychiatry: 'मनोरोग',
      internalMedicine: 'जनरल मेडिसिन',
      ent: 'नाक कान घाँटी',
      urology: 'मूत्ररोग',
    },
  },
  hi: {
    filters: {
      hospital: 'अस्पताल',
      pharmacy: 'फार्मेसी',
      rehabilitation: 'पुनर्वास केंद्र',
      certified: 'प्रमाणित',
      sports: 'खेल पुनर्वास',
      job: 'व्यावसायिक प्रशिक्षण',
      all: 'सभी',
      detailed: 'उन्नत खोज',
    },
    sections: {
      nearMe: 'मेरे पास',
      selectRegion: 'क्षेत्र चुनें',
      selectRegionBtn: 'क्षेत्र चुनें',
      types: 'प्रकार',
      hospitalType: 'विभाग',
      myLocation: 'मेरा स्थान',
      more: 'अधिक',
      listHeader: 'नामित चिकित्सा संस्थानों की सूची',
      mobileView: {
        map: 'नक्शा देखें',
        list: 'सूची देखें',
      },
      disclaimer: {
        title: 'Notice',
        source: 'Information on hospitals, pharmacies, rehabilitation centers, and vocational training institutions displayed on this service is provided using public APIs from the Korea Workers\' Compensation & Welfare Service.',
        realtime: 'This information is not real-time and may change if the industrial accident designation is canceled or the institution closes. Please check accurate information on the COMWEL website (www.comwel.or.kr).',
        certDate: '* Industrial Accident Rehabilitation Certification Institutions as of June 30, 2025.',
      },
    },
    messages: {
      foundNearby: '{radius} किमी के भीतर {count} चिकित्सा संस्थान मिले।',
      foundRegion: '{region} में {count} चिकित्सा संस्थान मिले।',
      noResult: 'कोई अस्पताल नहीं मिला।',
      moveMap: 'खोजने के लिए मानचित्र हिलाएं।',
    },
    infoWindow: {
      call: 'कॉल करें',
      directions: 'दिशा - निर्देश',
      certified: 'प्रमाणित',
      address: 'पता:',
    },
    hero: {
      title: 'मैं इलाज कहाँ',
      highlight: 'प्राप्त कर सकता हूँ?',
      subtitle: 'औद्योगिक दुर्घटनाओं के लिए नजदीकी प्रमाणित चिकित्सा संस्थानों को आसानी से खोजें।',
    },
    departments: {
      orthopedics: 'हड्डी रोग',
      dentistry: 'दंत चिकित्सा',
      neurosurgery: 'न्यूरोसर्जरी',
      surgery: 'सर्जरी',
      rehabMedicine: 'पुनर्वास चिकित्सा',
      radiology: 'रेडियोलोजी',
      ophthalmology: 'नेत्र विज्ञान',
      psychiatry: 'मनश्चिकित्सा',
      internalMedicine: 'आंतरिक चिकित्सा',
      ent: 'कान, नाक, गला',
      urology: 'मूत्रविज्ञान',
    },
  },
};


export const chatbotTranslations: Record<Locale, ChatbotTranslation> = {
  ko: {
    title: '똑똑한 산재 AI 비서',
    subtitle: '복잡한 산재 정보, AI가 쉽고 정확하게 알려드립니다.',
    placeholder: '산재 관련 질문을 입력해주세요...',
    recQuestions: ['요양급여가 뭔가요?', '산업재해 신청은 어떻게 하나요?', '휴업급여는 언제 받을 수 있나요?'],
    legalNotice: 'AI 챗봇의 답변은 부정확할 수 있으며, 법적 효력이 없습니다.',
    share: '공유',
    copied: '복사됨',
    send: '전송',
    sourceTitle: '문서 기반 답변 (신뢰도 높음)',
    disclaimer: 'AI 챗봇의 답변은 부정확할 수 있으며, 법적 효력이 없습니다.',
    pageHeroTitle: '24시간 언제나, 산재 전문 상담 챗봇',
    pageHeroSubtitle: '복잡한 규정도 AI가 쉽고 정확하게 알려드립니다.',
    footerSourceTitle: '신뢰할 수 있는 데이터 출처',
    footerSourceDesc: '본 서비스는 RAG 기술을 사용하여 근로복지공단과 법제처에서 제공한 산재 규정을 분석합니다.',
    footerLimitTitle: '상용화 및 책임 한계 고지',
    footerLimitDesc: '제공된 답변은 산재 처리를 돕기 위한 참고 자료이며, 개별 사례에 따른 정확한 법적 효력은 관계 기관의 공식적인 상담과 심사를 통해 결정됩니다.',
    loadingMessage: '산재 챗봇이 관련 규정을 찾아보고 있어요',
    errorTooShort: '질문을 2자 이상 입력해주세요.',
    errorServer: '서버 오류: ',
    errorNoResponse: '응답을 받지 못했습니다.',
    errorTimeout: '응답이 지연되고 있어요. 잠시 후 다시 시도해주세요.',
    errorGeneric: '챗봇 응답 생성 중 오류가 발생했습니다.',
    limitModalTitle: '무료 체험이 종료되었습니다',
    limitModalDesc: '로그인하고 <strong>무제한 AI 상담</strong>과<br/><strong>나에게 맞는 산재 정보</strong>를 확인해보세요!',
    limitModalButton: '3초 만에 시작하기',
    limitModalLater: '나중에 할게요',
  },
  en: {
    title: 'Smart AI Assistant',
    subtitle: 'Ask comfortably in your native language, and I will find and explain Korean materials for you.',
    placeholder: 'Please enter your question about industrial accidents...',
    recQuestions: ['What is medical benefit?', 'How do I apply for industrial accident?', 'When can I receive temporary disability benefit?'],
    legalNotice: 'AI chatbot responses may be inaccurate and have no legal effect.',
    share: 'Share',
    copied: 'Copied',
    send: 'Send',
    sourceTitle: 'Document-based answer (High reliability)',
    disclaimer: 'AI chatbot responses may be inaccurate and have no legal effect.',
    pageHeroTitle: '24/7 Industrial Accident AI Counseling',
    pageHeroSubtitle: 'AI explains complex regulations easily and accurately.',
    footerSourceTitle: 'Trusted Data Sources',
    footerSourceDesc: 'This service analyzes industrial accident regulations provided by COMWEL and the Ministry of Government Legislation using RAG technology.',
    footerLimitTitle: 'Disclaimer of Liability',
    footerLimitDesc: 'The answers provided are for reference only. Exact legal effects are determined through official consultation and examination by relevant authorities.',
    loadingMessage: 'The AI chatbot is looking up relevant regulations.',
    errorTooShort: 'Please enter a question of at least 2 characters.',
    errorServer: 'Server Error: ',
    errorNoResponse: 'No response received.',
    errorTimeout: 'Response is delayed. Please try again in a moment.',
    errorGeneric: 'An error occurred while generating the chatbot response.',
    limitModalTitle: 'Free trial has ended',
    limitModalDesc: 'Sign in to access <strong>unlimited AI consultation</strong> and<br/><strong>personalized industrial accident info!</strong>',
    limitModalButton: 'Start in 3 seconds',
    limitModalLater: 'Do it later',
  },
  zh: {
    title: '智能工伤 AI 助手',
    subtitle: '请轻松使用您的母语提问，我将为您查找并说明韩国的相关资料。',
    placeholder: '请输入有关工伤的问题...',
    recQuestions: ['什么是疗养费？', '如何申请工伤？', '什么时候可以领取休业补偿？'],
    legalNotice: 'AI 聊天机器人的回答可能不准确，不具有法律效力。',
    share: '分享',
    copied: '已复制',
    send: '发送',
    sourceTitle: '基于文档的回答（高可靠性）',
    disclaimer: 'AI 聊天机器人的回答可能不准确，不具有法律效力。',
    pageHeroTitle: '24小时工伤专业咨询 AI',
    pageHeroSubtitle: 'AI 为您轻松准确地讲解复杂的法规。',
    footerSourceTitle: '可靠的数据来源',
    footerSourceDesc: '本服务使用 RAG 技术分析由勤劳福祉公团和法制处提供的工伤相关规定。',
    footerLimitTitle: '商业化及责任限制公告',
    footerLimitDesc: '所提供的回答仅作为工伤处理的参考资料。具体的法律效力将通过相关机构的正式咨询和审查来决定。',
    loadingMessage: 'AI 聊天机器人正在查找相关法规。',
    errorTooShort: '请输入至少 2 个字符的问题。',
    errorServer: '服务器错误：',
    errorNoResponse: '未收到回复。',
    errorTimeout: '响应延迟。请稍后再试。',
    errorGeneric: '生成聊天机器人回复时发生错误。',
    limitModalTitle: '免费试用已结束',
    limitModalDesc: '请登录以访问<strong>无限 AI 咨询</strong>和<br/><strong>个性化工伤信息！</strong>',
    limitModalButton: '3秒内开始',
    limitModalLater: '稍后再做',
  },
  vi: {
    title: 'Trợ lý AI Tai nạn Lao động Thông minh',
    subtitle: 'Hãy thoải mái hỏi bằng tiếng mẹ đẻ của bạn, tôi sẽ tìm tài liệu tiếng Hàn và giải thích cho bạn.',
    placeholder: 'Vui lòng nhập câu hỏi về tai nạn lao động...',
    recQuestions: ['Trợ cấp điều trị là gì?', 'Làm thế nào để đăng ký tai nạn lao động?', 'Khi nào tôi có thể nhận được trợ cấp nghỉ việc?'],
    legalNotice: 'Câu trả lời của chatbot AI có thể không chính xác và không có giá trị pháp lý.',
    share: 'Chia sẻ',
    copied: 'Đã sao chép',
    send: 'Gửi',
    sourceTitle: 'Trả lời dựa trên tài liệu (Độ tin cậy cao)',
    disclaimer: 'Câu trả lời của chatbot AI có thể không chính xác và không có giá trị pháp lý.',
    pageHeroTitle: 'Tư vấn AI Tai nạn Lao động 24/7',
    pageHeroSubtitle: 'AI giải thích các quy định phức tạp một cách dễ dàng và chính xác.',
    footerSourceTitle: 'Nguồn Dữ liệu Đáng tin cậy',
    footerSourceDesc: 'Dịch vụ này phân tích các quy định về tai nạn lao động do COMWEL và Bộ Pháp chế cung cấp bằng công nghệ RAG.',
    footerLimitTitle: 'Thông báo Miễn trừ Trách nhiệm',
    footerLimitDesc: 'Các câu trả lời được cung cấp chỉ mang tính chất tham khảo. Hiệu lực pháp lý chính xác được quyết định thông qua tư vấn và thẩm định chính thức của các cơ quan liên quan.',
    loadingMessage: 'Chatbot AI đang tìm kiếm các quy định liên quan.',
    errorTooShort: 'Vui lòng nhập câu hỏi có ít nhất 2 ký tự.',
    errorServer: 'Lỗi máy chủ: ',
    errorNoResponse: 'Không nhận được phản hồi.',
    errorTimeout: 'Phản hồi bị chậm. Vui lòng thử lại sau.',
    errorGeneric: 'Đã xảy ra lỗi khi tạo phản hồi của chatbot.',
    limitModalTitle: 'Bản dùng thử miễn phí đã kết thúc',
    limitModalDesc: 'Đăng nhập để truy cập <strong>tư vấn AI không giới hạn</strong> và<br/><strong>thông tin tai nạn lao động được cá nhân hóa!</strong>',
    limitModalButton: 'Bắt đầu trong 3 giây',
    limitModalLater: 'Làm sau',
  },
  th: {
    title: 'ผู้ช่วย AI อุบัติเหตุจากการทำงานอัจฉริยะ',
    subtitle: 'เชิญสอบถามเป็นภาษาแม่ของคุณได้อย่างสะดวก เราจะค้นหาข้อมูลภาษาเกาหลีและอธิบายให้คุณฟังเอง',
    placeholder: 'กรุณากรอกคำถามเกี่ยวกับอุบัติเหตุจากการทำงาน...',
    recQuestions: ['ค่ารักษาพยาบาลคืออะไร?', 'จะสมัครขอรับเงินทดแทนอุบัติเหตุได้อย่างไร?', 'จะได้รับค่าชดเชยการหยุดงานเมื่อไหร่?'],
    legalNotice: 'คำตอบของ AI chatbot อาจไม่ถูกต้องและไม่มีผลทางกฎหมาย',
    share: 'แชร์',
    copied: 'คัดลอกแล้ว',
    send: 'ส่ง',
    sourceTitle: 'คำตอบอ้างอิงจากเอกสาร (ความน่าเชื่อถือสูง)',
    disclaimer: 'คำตอบของ AI chatbot อาจไม่ถูกต้องและไม่มีผลทางกฎหมาย',
    pageHeroTitle: 'AI ให้คำปรึกษาด้านอุบัติเหตุจากการทำงาน ตลอด 24 ชั่วโมง',
    pageHeroSubtitle: 'AI จะอธิบายระเบียบข้อบังคับที่ซับซ้อนให้เข้าใจง่ายและแม่นยำ',
    footerSourceTitle: 'แหล่งข้อมูลที่เชื่อถือได้',
    footerSourceDesc: 'บริการนี้ใช้เทคโนโลยี RAG เพื่อวิเคราะห์ระเบียบข้อบังคับด้านอุบัติเหตุจากการทำงานที่จัดทำโดย COMWEL และกระทรวงกฎหมาย',
    footerLimitTitle: 'ข้อจำกัดความรับผิดชอบ',
    footerLimitDesc: 'คำตอบที่ได้รับเป็นเพียงข้อมูลอ้างอิงเท่านั้น ผลทางกฎหมายที่แน่นอนจะถูกตัดสินผ่านการปรึกษาและการตรวจสอบอย่างเป็นทางการจากหน่วยงานที่เกี่ยวข้อง',
    loadingMessage: 'แชทบอท AI กำลังค้นหากฎระเบียบที่เกี่ยวข้อง',
    errorTooShort: 'กรุณาป้อนคำถามอย่างน้อย 2 ตัวอักษร',
    errorServer: 'ข้อผิดพลาดของเซิร์ฟเวอร์: ',
    errorNoResponse: 'ไม่ได้รับคำตอบ',
    errorTimeout: 'การตอบสนองล่าช้า โปรดลองอีกครั้งในภายหลัง',
    errorGeneric: 'เกิดข้อผิดพลาดขณะสร้างคำตอบของแชทบอท',
    limitModalTitle: 'การทดลองใช้ฟรีสิ้นสุดลงแล้ว',
    limitModalDesc: 'ลงชื่อเข้าใช้เพื่อเข้าถึง <strong>การให้คำปรึกษา AI แบบไม่จำกัด</strong> และ<br/><strong>ข้อมูลอุบัติเหตุทางอุตสาหกรรมส่วนบุคคล!</strong>',
    limitModalButton: 'เริ่มใน 3 วินาที',
    limitModalLater: 'ทำภายหลัง',
  },
  uz: {
    title: 'Aqlli Mehnat Jarohati AI Yordamchisi',
    subtitle: "O'z ona tilingizda bemalol so'rang, men koreyscha materiallarni topib, sizga tushuntirib beraman.",
    placeholder: "Mehnat jarohati haqida savolingizni kiriting...",
    recQuestions: ["Davolanish nafaqasi nima?", "Mehnat jarohatini qanday rasmiylashtirish mumkin?", "Ishlamaganlik nafaqasini qachon olish mumkin?"],
    legalNotice: "AI chatbot javoblari noto'g'ri bo'lishi mumkin va huquqiy kuchga ega emas.",
    share: 'Ulashish',
    copied: 'Nusxalandi',
    send: 'Yuborish',
    sourceTitle: "Hujjatga asoslangan javob (Yuqori ishonchlilik)",
    disclaimer: "AI chatbot javoblari noto'g'ri bo'lishi mumkin va huquqiy kuchga ega emas.",
    pageHeroTitle: "24/7 Mehnat Jarohati AI Maslahatchisi",
    pageHeroSubtitle: "Murakkab qoidalarni AI oson va aniq tushuntirib beradi.",
    footerSourceTitle: "Ishonchli Ma'lumot Manbalari",
    footerSourceDesc: "Ushbu xizmat COMWEL va Adliya vazirligi tomonidan taqdim etilgan mehnat jarohati qoidalarini RAG texnologiyasi yordamida tahlil qiladi.",
    footerLimitTitle: "Mas'uliyatni Cheklash To'g'risida Bildirishnoma",
    footerLimitDesc: "Taqdim etilgan javoblar faqat ma'lumot uchun mo'ljallangan. Aniq huquqiy kuch tegishli organlarning rasmiy maslahati va tekshiruvi orqali aniqlanadi.",
    loadingMessage: 'AI chatbot tegishli qoidalarni qidirmoqda.',
    errorTooShort: 'Iltimos, kamida 2 ta belgi kiriting.',
    errorServer: 'Server xatosi: ',
    errorNoResponse: 'Javob olinmadi.',
    errorTimeout: "Javob kechikmoqda. Iltimos, keyinroq qayta urinib ko'ring.",
    errorGeneric: 'Chatbot javobini yaratishda xatolik yuz berdi.',
    limitModalTitle: 'Bepul sinov muddati tugadi',
    limitModalDesc: "<strong>Cheksiz AI maslahati</strong> va <br/><strong>shaxsiylashtirilgan mehnat jarohati ma'lumotlari</strong>ni olish uchun tizimga kiring!",
    limitModalButton: '3 soniyada boshlash',
    limitModalLater: 'Keyinroq qilish',
  },
  mn: {
    title: 'Ухаалаг үйлдвэрлэлийн ослын AI туслах',
    subtitle: 'Төрөлх хэлээрээ асуувал би солонгос материалыг олж тайлбарлаж өгөх болно.',
    placeholder: 'Үйлдвэрлэлийн ослын талаар асуултаа оруулна уу...',
    recQuestions: ['Эмчилгээний тэтгэмж гэж юу вэ?', 'Үйлдвэрлэлийн ослыг хэрхэн бүртгүүлэх вэ?', 'Ажлаас чөлөөлөгдсөний тэтгэмжийг хэзээ авах вэ?'],
    legalNotice: 'AI чатботын хариулт буруу байж болох бөгөөд хууль эрх зүйн хүчингүй болно.',
    share: 'Хуваалцах',
    copied: 'Хуулсан',
    send: 'Илгээх',
    sourceTitle: 'Баримт бичигт суурилсан хариулт (Өндөр найдвартай)',
    disclaimer: 'AI чатботын хариулт буруу байж болох бөгөөд хууль эрх зүйн хүчингүй болно.',
    pageHeroTitle: '24 цагийн үйлдвэрлэлийн ослын AI зөвлөх',
    pageHeroSubtitle: 'Нарийн төвөгтэй дүрмийг AI хялбар бөгөөд үнэн зөвөөр тайлбарлаж өгдөг.',
    footerSourceTitle: 'Найгвартай мэдээллийн эх сурвалж',
    footerSourceDesc: 'Энэхүү үйлчилгээ нь RAG технологийг ашиглан COMWEL болон Хууль зүйн яамнаас гаргасан үйлдвэрлэлийн ослын дүрмийг шинжилдэг.',
    footerLimitTitle: 'Хариуцлагын хязгаарлалтын мэдэгдэл',
    footerLimitDesc: 'Өгөгдсөн хариултууд нь зөвхөн лавлах материал юм. Хууль эрх зүйн үнэн зөв хүчин төгөлдөр байдал нь холбогдох байгууллагуудын албан ёсны зөвлөгөө, хяналтын дараа шийдэгдэнэ.',
    loadingMessage: 'AI чатбот холбогдох журмыг хайж байна.',
    errorTooShort: 'Асуултаа дор хаяж 2 тэмдэгтээр оруулна уу.',
    errorServer: 'Серверийн алдаа: ',
    errorNoResponse: 'Хариу ирсэнгүй.',
    errorTimeout: 'Хариу удааширч байна. Түр хүлээгээд дахин оролдоно уу.',
    errorGeneric: 'Чатботын хариулт үүсгэх үед алдаа гарлаа.',
    limitModalTitle: 'Үнэгүй туршилт дууссан',
    limitModalDesc: '<strong>Хязгааргүй AI зөвлөгөө</strong> болон <br/><strong>хувийн үйлдвэрлэлийн ослын мэдээлэл</strong> авахын тулд нэвтэрнэ үү!',
    limitModalButton: '3 секундын дотор эхлэх',
    limitModalLater: 'Дараа хийх',
  },
  id: {
    title: 'Asisten AI Kecelakaan Kerja Pintar',
    subtitle: 'Tanyakan dalam bahasa ibu Anda, dan saya akan mencarikan serta menjelaskan dokumen bahasa Korea untuk Anda.',
    placeholder: 'Masukkan pertanyaan tentang kecelakaan kerja...',
    recQuestions: ['Apa itu kompensasi pengobatan?', 'Bagaimana cara mengajukan kecelakaan kerja?', 'Kapan saya bisa menerima tunjangan cuti sakit?'],
    legalNotice: 'Jawaban chatbot AI mungkin tidak akurat và không có giá trị pháp lý.',
    share: 'Bagikan',
    copied: 'Disalin',
    send: 'Kirim',
    sourceTitle: 'Jawaban berdasarkan dokumen (Keandalan tinggi)',
    disclaimer: 'Jawaban chatbot AI mungkin không chính xác và không có giá trị pháp lý.',
    pageHeroTitle: 'Konsultasi AI Kecelakaan Kerja 24 Jam',
    pageHeroSubtitle: 'AI menjelaskan peraturan yang rumit dengan mudah dan akurat.',
    footerSourceTitle: 'Sumber Data Terpercaya',
    footerSourceDesc: 'Layanan ini menganalisis peraturan kecelakaan kerja yang disediakan oleh COMWEL dan Kementerian Perundang-undangan menggunakan teknologi RAG.',
    footerLimitTitle: 'Pemberitahuan Batas Tanggung Jawab',
    footerLimitDesc: 'Jawaban yang diberikan hanya sebagai bahan referensi. Efek hukum yang tepat ditentukan melalui konsultasi dan pemeriksaan resmi oleh instansi terkait.',
    loadingMessage: 'Chatbot AI sedang mencari peraturan terkait.',
    errorTooShort: 'Silakan masukkan pertanyaan minimal 2 karakter.',
    errorServer: 'Kesalahan Server: ',
    errorNoResponse: 'Tidak ada respons.',
    errorTimeout: 'Respons tertunda. Silakan coba lagi nanti.',
    errorGeneric: 'Terjadi kesalahan saat membuat respons chatbot.',
    limitModalTitle: 'Uji coba gratis telah berakhir',
    limitModalDesc: 'Masuk untuk mengakses <strong>konsultasi AI tanpa batas</strong> dan <br/><strong>informasi kecelakaan industri yang dipersonalisasi!</strong>',
    limitModalButton: 'Mulai dalam 3 detik',
    limitModalLater: 'Lakukan nanti',
  },
  ne: {
    title: 'स्मार्ट औद्योगिक दुर्घटना एआई सहायक',
    subtitle: 'आफ्नो मातृभाषामा ढुक्कसँग सोध्नुहोस्, म कोरियाली कागजातहरू फेला पारेर तपाईंलाई बुझाउनेछु।',
    placeholder: 'औद्योगिक दुर्घटनाको बारेमा आफ्नो प्रश्न प्रविष्ट गर्नुहोस्...',
    recQuestions: ['उपचार लाभ भनेको के हो?', 'औद्योगिक दुर्घटनाको लागि कसरी आवेदन दिने?', 'बिदाको भत्ता कहिले पाउन सकिन्छ?'],
    legalNotice: 'एआई च्याटबोटको जवाफ गलत हुन सक्छ र यसको कुनै कानुनी प्रभाव हुँदैन।',
    share: 'साझा गर्नुहोस्',
    copied: 'प्रतिलिपि गरियो',
    send: 'पठाउनुहोस्',
    sourceTitle: 'कागजातमा आधारित जवाफ (उच्च विश्वसनीयता)',
    disclaimer: 'एआई च्याटबोटको जवाफ गलत हुन सक्छ र यसको कुनै कानुनी प्रभाव हुँदैन।',
    pageHeroTitle: '२४ घण्टा औद्योगिक दुर्घटना एआई परामर्श',
    pageHeroSubtitle: 'एआईले जटिल नियमहरू सजिलै र सही रूपमा व्याख्या गर्दछ।',
    footerSourceTitle: 'विश्वसनीय डाटा स्रोतहरू',
    footerSourceDesc: 'यस सेवाले RAG प्रविधि प्रयोग गरेर COMWEL र कानुन मन्त्रालयद्वारा प्रदान गरिएको औद्योगिक दुर्घटना नियमहरूको विश्लेषण गर्दछ।',
    footerLimitTitle: 'दायित्वको अस्वीकरण सूचना',
    footerLimitDesc: 'प्रदान गरिएका जवाफहरू सन्दर्भको लागि मात्र हुन्। स्पष्ट कानुनी प्रभावहरू सम्बन्धित निकायहरूको आधिकारिक परामर्श र परीक्षणबाट निर्धारण गरिन्छ।',
    loadingMessage: 'AI च्याटबोट सम्बन्धित नियमहरू खोज्दैछ।',
    errorTooShort: 'कृपया कम्तिमा २ अक्षरहरूको प्रश्न प्रविष्ट गर्नुहोस्।',
    errorServer: 'सर्भर त्रुटि: ',
    errorNoResponse: 'कुनै प्रतिक्रिया प्राप्त भएन।',
    errorTimeout: 'प्रतिक्रिया ढिलो भइरहेको छ। कृपया एकछिन पछि फेरि प्रयास गर्नुहोस्।',
    errorGeneric: 'च्याटबोट प्रतिक्रिया सिर्जना गर्दा त्रुटि भयो।',
    limitModalTitle: 'नि: शुल्क परीक्षण समाप्त भएको छ',
    limitModalDesc: '<strong>असीमित एआई परामर्श</strong> र <br/><strong>व्यक्तिगत औद्योगिक दुर्घटना जानकारी</strong> पहुँच गर्न साइन इन गर्नुहोस्!',
    limitModalButton: '३ सेकेन्डमा सुरु गर्नुहोस्',
    limitModalLater: 'पछि गर्नुहोस्',
  },
  hi: {
    title: 'स्मार्ट औद्योगिक दुर्घटना एआई सहायक',
    subtitle: 'अपनी मातृभाषा में बेझिझक पूछें, मैं कोरियाई सामग्री ढूंढकर आपको समझाऊंगा।',
    placeholder: 'औद्योगिक दुर्घटना के बारे में अपना प्रश्न दर्ज करें...',
    recQuestions: ['चिकित्सा लाभ क्या है?', 'औद्योगिक दुर्घटना के लिए आवेदन कैसे करें?', 'छुट्टी का भत्ता कब मिल सकता है?'],
    legalNotice: 'एआई चैटबॉट के जवाब गलत हो सकते हैं और इनका कोई कानूनी प्रभाव नहीं है।',
    share: 'साझा करें',
    copied: 'कॉपी किया गया',
    send: 'भेजें',
    sourceTitle: 'दस्तावेज़ आधारित उत्तर (उच्च विश्वसनीयता)',
    disclaimer: 'एआई चैटबॉट के जवाब गलत हो सकते हैं और इनका कोई कानूनी प्रभाव नहीं है.',
    pageHeroTitle: '24 घंटे औद्योगिक दुर्घटना एआई परामर्श',
    pageHeroSubtitle: 'एआई जटिल नियमों को आसानी से और सही ढंग से समझाता है।',
    footerSourceTitle: 'विश्वसनीय डेटा स्रोत',
    footerSourceDesc: 'यह सेवा RAG तकनीक का उपयोग करके COMWEL और कानून मंत्रालय द्वारा प्रदान किए गए औद्योगिक दुर्घटना नियमों का विश्लेषण करती है।',
    footerLimitTitle: 'दायित्व की सीमा सूचना',
    footerLimitDesc: 'दिए गए उत्तर केवल संदर्भ के लिए हैं। सटीक कानूनी प्रभाव संबंधित निकायों के आधिकारिक परामर्श और परीक्षण के माध्यम से निर्धारित किए जाते हैं।',
    loadingMessage: 'AI चैटबॉट संबंधित नियमों की खोज कर रहा है।',
    errorTooShort: 'कृपया कम से कम 2 अक्षरों का प्रश्न दर्ज करें।',
    errorServer: 'सर्वर त्रुटि: ',
    errorNoResponse: 'कोई प्रतिक्रिया प्राप्त नहीं हुई।',
    errorTimeout: 'प्रतिक्रिया में देरी हो रही है। कृपया थोड़ी देर बाद पुनः प्रयास करें।',
    errorGeneric: 'चैटबॉट प्रतिक्रिया उत्पन्न करते समय एक त्रुटि हुई।',
    limitModalTitle: 'निःशुल्क परीक्षण समाप्त हो गया है',
    limitModalDesc: '<strong>असीमित एआई परामर्श</strong> और <br/><strong>व्यक्तिगत औद्योगिक दुर्घटना जानकारी</strong> तक पहुंचने के लिए साइन इन करें!',
    limitModalButton: '3 सेकंड में शुरू करें',
    limitModalLater: 'बाद में करें',
  },
};

export const landingTranslations: Record<Locale, LandingTranslation> = {
  ko: {
    heroTitlePrefix: '복잡한 산재,',
    heroTitleSuffix: '혼자 감당하지 마세요.',
    heroDescription: '누구에게 물어봐야 할지 막막하셨죠? 산재 신청부터 보상까지, 엉킨 실타래를 풀듯 리워크케어가 차근차근 알려드릴게요.',
    heroCta: '산재 AI 무료로 사용하기',
    statsTitle: '저도 업무 중 사고를 겪었던 산재 근로자였습니다.',
    statsDescription: "치료만으로도 벅찬 시기에 겪었던 절차의 막막함. '누가 미리 알려줬더라면' 아쉬워했던 정보들을 모았습니다.",
    statDocsLabel: '서류 안내',
    statDocsDesc: '필수 서류 작성 가이드',
    statVideoLabel: '설명 동영상',
    statVideoDesc: '쉬운 이해를 돕는 영상',
    statHospitalLabel: '산재 병원',
    statHospitalDesc: '재활 인증 의료기관',
    statRehabLabel: '재활 기관',
    statRehabDesc: '직업훈련 및 재활 시설',
    statSource: '근로복지공단 공식 데이터 기반',
    feature1Title: '나에게 맞는 보상 항목, 한눈에 확인하세요',
    feature1Desc: '치료비와 휴업급여 외에도 챙겨야 할 항목이 많습니다. 장해급여, 재취업 교육 등 단계별로 받을 수 있는 다양한 지원 제도를 놓치지 않게 안내해 드립니다.',
    feature1Cta: '맞춤 보상 리포트 보기',
    feature2Title: '복잡한 산재 절차와 용어, 쉽게 물어보세요',
    feature2Desc: '산재 전문 AI가 어려운 용어와 궁금한 점을 즉시 답변해 드립니다. 사고부터 복귀까지의 모든 과정을 정리해 드리고, 지금 당신이 꼭 해야 할 일을 안내합니다.',
    feature2Cta: 'AI 산재 가이드 시작하기',
    feature3Title: '산재 지정 의료기관, 지도에서 바로 찾으세요',
    feature3Desc: '아픈 몸을 이끌고 아무 병원이나 갈 수 없습니다. 내 위치 주변의 산재 지정 의료기관만 쏙 뽑아 보여드립니다.',
    feature3Cta: '내 주변 산재 병원 찾기',
    feature4Title: '필요한 서류, 검색 한번으로 찾으세요',
    feature4Desc: '어렵고 낯선 산재 서류 때문에 더 이상 헤매지 마세요. 검색만 하면 필요한 필수 서류 양식과 설명이 바로 나옵니다.',
    feature4Cta: '필수 서류 찾아보기',
    bottomTitlePrefix: '나에게 필요한 산재 정보,',
    bottomTitleSuffix: '개인 대시보드에 다 모았습니다.',
    bottomDescription: '여기저기 찾아다니지 마세요. 회원가입만 하면 꼭 필요한 정보를 한눈에 정리해 보여드립니다.',
    bottomCta: '산재 AI 무료로 시작하기',
    imageNotice: '이미지 내 포함된 텍스트는 한국어 기준입니다.',
    nuanceDisclaimer: '이 내용은 이해를 돕기 위한 AI 번역본입니다. 정확한 법적 해석은 한국어 원본 자료를 확인하세요.',
  },
  en: {
    heroTitlePrefix: "Complex industrial accidents,",
    heroTitleSuffix: "Don't face them alone.",
    heroDescription: "Have you felt lost about where to ask? From application to compensation, ReworkCare will guide you step by step as if untangling a knot.",
    heroCta: "Use Industrial Accident AI for Free",
    statsTitle: "I too was an injured worker who experienced an accident on the job.",
    statsDescription: "I collected information that I wished someone had told me during the overwhelming time of treatment.",
    statDocsLabel: "Document Guide",
    statDocsDesc: "Essential document writing guide",
    statVideoLabel: "Explainer Video",
    statVideoDesc: "Videos for easy understanding",
    statHospitalLabel: "Accident Hospital",
    statHospitalDesc: "Rehabilitation certified medical institutions",
    statRehabLabel: "Rehab Center",
    statRehabDesc: "Vocational training and rehab facilities",
    statSource: "Based on COMWEL official data",
    feature1Title: "Check the benefits that fit you at a glance",
    feature1Desc: "There are many items to check besides medical costs and temporary disability benefits. We will guide you so you don't miss out on various support systems.",
    feature1Cta: "View Custom Compensation Report",
    feature2Title: "Ask complex industrial accident procedures and terms easily",
    feature2Desc: "Our specialized AI answers difficult terms and questions instantly. We organize the entire process from accident to return and guide you on what you must do now.",
    feature2Cta: "Start AI Accident Guide",
    feature3Title: "Industrial accident medical institutions, find directly on the map",
    feature3Desc: "You can't just go to any hospital with an injured body. We only show industrial accident-designated medical institutions near you.",
    feature3Cta: "Find Nearby Hospitals",
    feature4Title: "Required documents, find with a single search",
    feature4Desc: "Don't wander anymore due to difficult documents. Search to get required forms and explanations immediately.",
    feature4Cta: "Browse Essential Documents",
    bottomTitlePrefix: "All the information you need,",
    bottomTitleSuffix: "collected in your personal dashboard.",
    bottomDescription: "Don't look around everywhere. Sign up and get all essential information organized at a glance.",
    bottomCta: "Start Industrial Accident AI for Free",
    imageNotice: "The text in the images is based on Korean.",
    nuanceDisclaimer: "This is an AI-translated version for your convenience. Please check the original Korean documents for accurate legal interpretation.",
  },
  zh: {
    heroTitlePrefix: '复杂的工伤，',
    heroTitleSuffix: '不要独自承担。',
    heroDescription: '您是否曾因不知道该问谁而感到茫然？从申请到补偿，ReworkCare 将像解开乱麻一样，循序渐进地为您提供指导。',
    heroCta: '免费使用工伤 AI',
    statsTitle: '我也曾是在工作中遭遇事故的工伤人员。',
    statsDescription: '在忙于治疗的艰难时期，我收集了那些曾经多么渴望有人能提前告诉我的信息。我将成为您身边最可靠的向导。',
    statDocsLabel: '文件指南',
    statDocsDesc: '必备文件填写指南',
    statVideoLabel: '说明视频',
    statVideoDesc: '帮助轻松理解的视频',
    statHospitalLabel: '工伤医院',
    statHospitalDesc: '康复认证医疗机构',
    statRehabLabel: '康复机构',
    statRehabDesc: '职业培训及康复设施',
    statSource: '基于勤劳福祉公团官方数据',
    feature1Title: '一目了然地查看适合您的补偿项目',
    feature1Desc: '除了医疗费和休业补偿，还有很多项目需要关注。我们将引导您不遗漏地了解各种支援制度。',
    feature1Cta: '查看定制补偿报告',
    feature2Title: '轻松咨询复杂的工伤程序和术语',
    feature2Desc: '工伤专业 AI 立即回答难题。我们整理从事故到回归的整个过程，并指导您现在该做什么。',
    feature2Cta: '启动 AI 工伤指南',
    feature3Title: '家附近的工伤医院，使用过滤器查找',
    feature3Desc: '带着受伤的身体，不能随便去任何一家医院。我们将为您筛选并展示您位置周边的工伤指定医疗机构。',
    feature3Cta: '查找我身边的工伤医院',
    feature4Title: '所需文件，搜索一次即可找到',
    feature4Desc: '不要再因为陌生且困难的工伤文件而徘徊。只需搜索，即可立即获得所需的必备文件格式和填写示例。',
    feature4Cta: '查找必备文件',
    bottomTitlePrefix: '您所需的工伤信息，',
    bottomTitleSuffix: '全都聚集在个人仪表盘中。',
    bottomDescription: '不要到处寻找。只需注册会员，我们就会将您需要的信息一目了然地整理展示。',
    bottomCta: '免费开启工伤 AI',
    imageNotice: '图片中的文本以韩语为准。',
    nuanceDisclaimer: '本内容是为方便您理解而提供的 AI 翻译版本。准确的法律解释请查阅韩语原件资料。',
  },
  vi: {
    heroTitlePrefix: 'Tai nạn lao động phức tạp,',
    heroTitleSuffix: 'Đừng gánh chịu một mình.',
    heroDescription: 'Bạn có cảm thấy mờ mịt không biết phải hỏi ai không? Từ khâu đăng ký đến bồi thường, ReworkCare sẽ hướng dẫn bạn từng bước giống như đang gỡ rối một cuộn chỉ.',
    heroCta: 'Sử dụng AI Tai nạn lao động miễn phí',
    statsTitle: 'Tôi cũng từng là một người lao động bị tai nạn nghề nghiệp.',
    statsDescription: 'Tôi đã thu thập những thông tin mà bản thân từng mong ước có ai đó nói cho mình biết sớm hơn vào thời điểm điều trị đầy khó khăn. Tôi sẽ là người dẫn đường đáng tin cậy cho bạn.',
    statDocsLabel: 'Hướng dẫn giấy tờ',
    statDocsDesc: 'Cẩm nang viết hồ sơ bắt buộc',
    statVideoLabel: 'Video giải thích',
    statVideoDesc: 'Video giúp dễ hiểu hơn',
    statHospitalLabel: 'Bệnh viện tai nạn',
    statHospitalDesc: 'Cơ sở y tế chứng nhận phục hồi chức năng',
    statRehabLabel: 'Cơ sở phục hồi',
    statRehabDesc: 'Cơ sở đào tạo nghề và phục hồi chức năng',
    statSource: 'Dựa trên dữ liệu chính thức của COMWEL',
    feature1Title: 'Kiểm tra các hạng mục bồi thường phù hợp với bạn trong nháy mắt',
    feature1Desc: 'Ngoài chi phí điều trị và trợ cấp nghỉ việc, còn có nhiều hạng mục khác cần lưu ý. Chúng tôi sẽ hướng dẫn để bạn không bỏ lỡ các chế độ hỗ trợ đa dạng.',
    feature1Cta: 'Xem báo cáo bồi thường tùy chỉnh',
    feature2Title: 'Hỏi về các thủ tục và thuật ngữ tai nạn lao động phức tạp một cách dễ dàng',
    feature2Desc: 'AI chuyên về tai nạn lao động sẽ trả lời các thuật ngữ và thắc mắc khó ngay lập tức. Chúng tôi sắp xếp toàn bộ quá trình từ tai nạn đến khi quay lại và hướng dẫn bạn những việc cần làm ngay bây giờ.',
    feature2Cta: 'Bắt đầu Hướng dẫn AI Tai nạn',
    feature3Title: 'RS Tai nạn gần nhà, tìm bằng bộ lọc',
    feature3Desc: 'Với cơ thể đau đớn, bạn không thể đi bất cứ bệnh viện nào. Chúng tôi chỉ hiển thị các cơ sở y tế được chỉ định tai nạn lao động gần bạn.',
    feature3Cta: 'Tìm bệnh viện tai nạn quanh tôi',
    feature4Title: 'Hồ sơ cần thiết, tìm kiếm chỉ một lần',
    feature4Desc: 'Đừng đi lạc với những hồ sơ tai nạn lao động khó khăn. Chỉ cần tìm kiếm là có ngay các mẫu đơn và hướng dẫn.',
    feature4Cta: 'Tìm hồ sơ thiết yếu',
    bottomTitlePrefix: 'Thông tin tai nạn lao động bạn cần,',
    bottomTitleSuffix: 'đã có trong bảng điều khiển cá nhân.',
    bottomDescription: 'Đừng đi tìm ở khắp mọi nơi. Chỉ cần đăng ký thành viên là có mọi thông tin cần thiết.',
    bottomCta: 'Bắt đầu dùng AI Tai nạn lao động miễn phí',
    imageNotice: 'Văn bản trong hình ảnh dựa trên tiếng Hàn.',
    nuanceDisclaimer: 'Nội dung này là bản dịch AI để giúp bạn hiểu. Vui lòng kiểm tra tài liệu gốc tiếng Hàn để có giải thích pháp lý chính xác.',
  },
  th: {
    heroTitlePrefix: 'อุบัติเหตุจากการทำงานที่ซับซ้อน',
    heroTitleSuffix: 'อย่าเผชิญเพียงลำพัง',
    heroDescription: 'คุณเคยรู้สึกมืดแปดด้านไหมว่าจะต้องถามใคร? ตั้งแต่การสมัครไปจนถึงการจ่ายค่าชดเชย ReworkCare จะแนะนำคุณทีละขั้นตอนเหมือนกับการแก้ปมเชือกที่ยุ่งเหยิง',
    heroCta: 'ใช้งาน AI อุบัติเหตุจากการทำงานฟรี',
    statsTitle: 'ผมเองก็เคยเป็นผู้ประกันตนที่ประสบอุบัติเหตุจากการทำงานเช่นกัน',
    statsDescription: 'ในยามที่แค่รักษาก็ลำบากพอแล้ว ผมได้รวบรวมข้อมูลที่อยากจะให้มีคนบอกล่วงหน้าไว้ เราจะเป็นไกด์ที่พึ่งพาได้สำหรับทุกคนที่เดินบนเส้นทางเดียวกัน',
    statDocsLabel: 'แนะนำเอกสาร',
    statDocsDesc: 'คู่มือการเขียนเอกสารที่จำเป็น',
    statVideoLabel: 'วิดีโออธิบาย',
    statVideoDesc: 'วิดีโอเพื่อความเข้าใจที่ง่ายขึ้น',
    statHospitalLabel: 'โรงพยาบาลอุบัติเหตุ',
    statHospitalDesc: 'สถานพยาบาลที่ได้รับการรับรองด้านการฟื้นฟู',
    statRehabLabel: 'ศูนย์นันทนาการ',
    statRehabDesc: 'ศูนย์ฝึกวิชาชีพและการฟื้นฟูสมรรถภาพ',
    statSource: 'อ้างอิงจากข้อมูลทางการของ COMWEL',
    feature1Title: 'ตรวจสอบค่าชดเชยที่เหมาะสมกับคุณได้ทันที',
    feature1Desc: 'นอกจากค่ารักษาพยาบาลและเงินชดเชยการหยุดงานแล้ว ยังมีอีกหลายรายการที่ต้องดูแล เราจะแนะนำคุณเพื่อให้ไม่พลาดระบบสนับสนุนที่หลากหลาย',
    feature1Cta: 'ดูรายงานค่าชดเชยที่เหมาะสม',
    feature2Title: 'สอบถามขั้นตอนและคำศัพท์เกี่ยวกับอุบัติเหตุจากการทำงานที่ซับซ้อนได้อย่างง่ายดาย',
    feature2Desc: 'AI ผู้เชี่ยวชาญด้านอุบัติเหตุจากการทำงานตอบคำศัพท์และข้อสงสัยที่ยากโดยทันที เราจัดระเบียบกระบวนการทั้งหมดตั้งแต่เกิดอุบัติเหตุจนถึงการกลับมาทำงาน และแนะนำสิ่งที่คุณต้องทำในขณะนี้',
    feature2Cta: 'เริ่มต้นคู่มือ AI อุบัติเหตุ',
    feature3Title: 'โรงพยาบาลอุบัติเหตุใกล้บ้าน ค้นหาด้วยฟิลเตอร์',
    feature3Desc: 'เมื่อร่างกายเจ็บปวด คุณไม่สามารถไปโรงพยาบาลไหนก็ได้ เราจะคัดเลือกและแสดงเฉพาะสถานพยาบาลที่ได้รับแต่งตั้งให้ดูแลผู้ป่วยอุบัติเหตุจากการทำงานที่อยู่รอบตัวคุณ',
    feature3Cta: 'ค้นหาโรงพยาบาลอุบัติเหตุรอบตัวฉัน',
    feature4Title: 'เอกสารที่จำเป็น ค้นหาเพียงครั้งเดียว도เจอ',
    feature4Desc: 'อย่ามัวแต่สับสนกับเอกสารอุบัติเหตุจากการทำงานที่ยากและไม่คุ้นเคยอีกต่อไป เพียงแค่ค้นหา รูปแบบเอกสารที่จำเป็นและตัวอย่างการเขียนก็จะปรากฏขึ้นทันที',
    feature4Cta: 'ค้นข้อมูลเอกสารที่จำเป็น',
    bottomTitlePrefix: 'ข้อมูลอุบัติเหตุจากการทำงานที่คุณต้องการ',
    bottomTitleSuffix: 'ทั้งหมดรวบรวมไว้ในแผงควบคุมส่วนตัวของคุณแล้ว',
    bottomDescription: 'ไม่ต้องไปหาที่ไหนไกล เพียงแค่สมัครสมาชิก เราจะสรุปข้อมูลที่จำเป็นทั้งหมดมาให้คุณเห็นในที่เดียว',
    bottomCta: 'เริ่มใช้งาน AI อุบัติเหตุจากการทำงานฟรี',
    imageNotice: 'ข้อความในรูปภาพยึดตามภาษาเกาหลี',
    nuanceDisclaimer: 'เนื้อหานี้เป็นเวอร์ชันแปลโดย AI เพื่อช่วยให้เกิดความเข้าใจ โปรดตรวจสอบข้อมูลภาษาเกาหลีต้นฉบับเพื่อความถูกต้องทางกฎหมาย',
  },
  uz: {
    heroTitlePrefix: 'Murakkab mehnat jarohati,',
    heroTitleSuffix: 'Yolg’iz o’zingiz qolmang.',
    heroDescription: 'Kimdan so’rashni bilmay, boshingiz qotganmi? Ariza topshirishdan to kompensatsiya olishgacha, ReworkCare xuddi chigal ipni yozgandek, sizga bosqichma-bosqich yo’l ko’rsatadi.',
    heroCta: 'Mehnat jarohati AI dan bepul foydalanish',
    statsTitle: 'Men ham ish vaqtida baxtsiz hodisaga uchragan ishchi bo’lganman.',
    statsDescription: 'Davolanishning o’zi yetarli bo’lmagan qiyin davrda, qaniydi kimdir oldindan aytib bersa, degan ma’lumotlarni to’pladim. Sizga ishonchli yo’l ko’rsatuvchi bo’laman.',
    statDocsLabel: 'Hujjatlar qo’llanmasi',
    statDocsDesc: 'Zarur hujjatlarni to’ldirish bo’yicha qo’llanma',
    statVideoLabel: 'Tushuntiruvchi video',
    statVideoDesc: 'Oson tushunishga yordam beradigan videolar',
    statHospitalLabel: 'Jarohatlar shifoxonasi',
    statHospitalDesc: 'Reabilitatsiya sertifikatiga ega tibbiyot muassasalari',
    statRehabLabel: 'Reab. markazlari',
    statRehabDesc: 'Kasbga o’rgatish va reabilitatsiya inshootlari',
    statSource: 'COMWEL rasmiy ma’lumotlariga asosan',
    feature1Title: 'Sizga mos kompensatsiya turlarini bir qarashda ko’ring',
    feature1Desc: 'Davolanish va ish haqi to’lovlaridan tashqari, ko’plab boshqa yordam turlari ham mavjud. Turli xil qo’llab-quvvatlash tizimlarini o’tkazib yubormasligingiz uchun sizga yo’l ko’rsatamiz.',
    feature1Cta: 'Shaxsiy kompensatsiya hisobotini ko’ring',
    feature2Title: 'Murakkab ishlab chiqarishdagi baxtsiz hodisalar tartiblari va atamalarini osongina so\'rang',
    feature2Desc: 'Mutaxassis AI qiyin atamalar va savollarga darhol javob beradi. Biz baxtsiz hodisadan qaytishgacha bo\'lgan butun jarayonni tashkil qilamiz va hozir nima qilishingiz kerakligini ko\'rsatamiz.',
    feature2Cta: 'AI baxtsiz hodisalar bo\'yicha qo\'llanmani boshlash',
    feature3Title: 'Uy yaqinidagi jarohatlar shifoxonalari, filtr orqali toping',
    feature3Desc: 'Og’riq paytida har qanday shifoxonaga borib bo’lmaydi. Faqat sizning joylashuvingiz yaqinidagi mehnat jarohatlari bo’yicha ixtisoslashgan tibbiyot muassasalarini ko’rsatamiz.',
    feature3Cta: 'Yaqin atrofdagi shifoxonalarni topish',
    feature4Title: 'Zarur bo’lgan hujjatlar, bitta izlash bilan toping',
    feature4Desc: 'Murakkab hujjatlar tufayli boshqacha yo’llarni qidirmang. Kerakli shakllar va to’ldirish namunalarini darhol toping.',
    feature4Cta: 'Asosiy hujjatlarni ko’rish',
    bottomTitlePrefix: 'Sizga kerak bo’lgan barcha ma’lumotlar,',
    bottomTitleSuffix: 'shaxsiy boshqaruv panelida yig’ilgan.',
    bottomDescription: 'Hech qayerda qidirib yurmang. Ro’yxatdan o’tishingiz bilan kerakli ma’lumotlarni bir qarashda ko’rsatib beramiz.',
    bottomCta: 'Mehnat jarohati AI ni bepul boshlash',
    imageNotice: 'Suratlardagi matn koreys tilida yozilgan.',
    nuanceDisclaimer: 'Bu ma’lumot tushunish oson bo’lishi uchun AI tomonidan tarjima qilingan. Aniq huquqiy talqin uchun koreys tilidagi asl hujjatlarni tekshiring.',
  },
  mn: {
    heroTitlePrefix: 'Үйлдвэрлэлийн осол,',
    heroTitleSuffix: 'Ганцаараа битгий барьц алдаарай.',
    heroDescription: 'Хэнээс асуухаа мэдэхгүй гайхаж байна уу? Өргөдөл гаргахаас эхлээд нөхөн олговор авах хүртэл ReworkCare танд алхам алхмаар зааж өгөх болно.',
    heroCta: 'Үйлдвэрлэлийн ослын AI-г үнэгүй ашиглах',
    statsTitle: 'Би ч гэсэн ажлын үеэр осолд орж байсан үйлдвэрлэлийн ослын ажилтан байсан.',
    statsDescription: 'Эмчилгээ хийлгэхэд ч хэцүү байх үед хэн нэгэн надад урьдчилаад хэлээд өгсөн болоосой гэж хүсэж байсан мэдээллүүдийг би цуглуулсан. Таны найдвартай хөтөч байх болно.',
    statDocsLabel: 'Бичиг баримтын заавар',
    statDocsDesc: 'Зайлшгүй шаардлагатай бичиг баримт бөглөх заавар',
    statVideoLabel: 'Тайлбар видео',
    statVideoDesc: 'Ойлгоход хялбар видеонууд',
    statHospitalLabel: 'Ослын эмнэлэг',
    statHospitalDesc: 'Сэргээн засах сувилал, эмнэлгийн байгууллага',
    statRehabLabel: 'Сэргээн засах байгууллага',
    statRehabDesc: 'Мэргэжлийн сургалт, сэргээн засах байгууламж',
    statSource: 'COMWEL-ийн албан ёсны мэдээлэлд үндэслэв',
    feature1Title: 'Өөрт тохирсон нөхөн олговрын зүйлсийг нэг дороос шалгаарай',
    feature1Desc: 'Эмчилгээний зардал болон ажлаас чөлөөлөгдсөний тэтгэмжээс гадна анхаарах зүйл олон бий. Бид танд янз бүрийн дэмжлэгийн тогтолцоог орхигдуулахгүй байхад туслах болно.',
    feature1Cta: 'Нөхөн олговрын тайланг үзэх',
    feature2Title: 'Үйлдвэрлэлийн ослын нарийн төвөгтэй журам, нэр томъёог хялбархан асуугаарай',
    feature2Desc: 'Мэргэшсэн AI хэцүү нэр томъёо, асуултуудад шууд хариулна. Бид ослоос эхлээд эргэж ирэх хүртэлх бүх үйл явцыг зохион байгуулж, одоо юу хийх ёстойг тань зааж өгнө.',
    feature2Cta: 'AI ослын гарын авлагыг эхлүүлэх',
    feature3Title: 'Гэрийн ойролцоох үйлдвэрлэлийн ослын эмнэлгийг хайх',
    feature3Desc: 'Өвчтэй биеэрээ аль ч хамаагүй эмнэлэг явж болохгүй. Бид таны ойролцоох үйлдвэрлэлийн ослын эмнэлгүүдийг л шүүж харуулна.',
    feature3Cta: 'Ойролцоох ослын эмнэлэг хайх',
    feature4Title: 'Хэрэгтэй баримт бичгийг нэг хайлтаар олоорой',
    feature4Desc: 'Хэцүү бичиг баримтад бүү төөрсөн байдалтай бай. Хайлт хийхэд л шаардлагатай маягтууд болон бөглөх жишээнүүд шууд гарч ирнэ.',
    feature4Cta: 'Шаардлагатай бичиг баримт хайх',
    bottomTitlePrefix: 'Танд хэрэгтэй үйлдвэрлэлийн ослын мэдээлэл,',
    bottomTitleSuffix: 'хувийн хянах самбарт бүгд бий.',
    bottomDescription: 'Хаа сайгүй хайх хэрэггүй. Бүртгүүлээд л танд хэрэгтэй мэдээллийг нэг дороос харах боломжтой.',
    bottomCta: 'Үйлдвэрлэлийн ослын AI-г үнэгүй эхлүүлэх',
    imageNotice: 'Зурган дээрх текстийг солонгос хэл дээр үндэслэсэн болно.',
    nuanceDisclaimer: 'Энэ агуулга нь ойлгоход туслах зорилгоор AI-аар орчуулагдсан болно. Хууль зүйн үнэн зөв тайлбарыг солонгос хэл дээрх эх материалыг шалгана уу.',
  },
  id: {
    heroTitlePrefix: 'Kecelakaan kerja yang rumit,',
    heroTitleSuffix: 'Jangan hadapi sendirian.',
    heroDescription: 'Bingung harus bertanya kepada siapa? Dari pendaftaran hingga kompensasi, ReworkCare akan membimbing Anda selangkah demi selangkah seperti menguraikan benang yang kusut.',
    heroCta: 'Gunakan AI Kecelakaan Kerja secara Gratis',
    statsTitle: 'Saya juga pernah menjadi pekerja yang mengalami kecelakaan saat bekerja.',
    statsDescription: 'Selama masa pengobatan yang sulit, saya mengumpulkan informasi yang saya harap ada orang yang memberitahu saya sebelumnya. Saya akan menjadi pemandu yang andal bagi Anda.',
    statDocsLabel: 'Panduan Dokumen',
    statDocsDesc: 'Panduan pengisian dokumen penting',
    statVideoLabel: 'Video Penjelasan',
    statVideoDesc: 'Video untuk pemahaman yang lebih mudah',
    statHospitalLabel: 'RS Kecelakaan',
    statHospitalDesc: 'Lembaga medis bersertifikat rehabilitasi',
    statRehabLabel: 'Lembaga Rehab',
    statRehabDesc: 'Fasilitas pelatihan kejuruan dan rehabilitasi',
    statSource: 'Berdasarkan data resmi COMWEL',
    feature1Title: 'Periksa item kompensasi yang sesuai untuk Anda sekilas',
    feature1Desc: 'Selain biaya pengobatan dan tunjangan cuti sakit, masih banyak hal yang perlu diperhatikan. Kami akan memandu Anda agar tidak melewatkan berbagai sistem dukungan.',
    feature1Cta: 'Lihat Laporan Kompensasi Kustom',
    feature2Title: 'Tanyakan prosedur dan istilah kecelakaan kerja yang rumit dengan mudah',
    feature2Desc: 'AI ahli kecelakaan kerja menjawab istilah dan pertanyaan sulit secara instan. Kami mengatur seluruh proses dari kecelakaan hingga kembali bekerja dan memandu apa yang harus Anda lakukan sekarang.',
    feature2Cta: 'Mulai Panduan AI Kecelakaan',
    feature3Title: 'RS Kecelakaan dekat rumah, cari dengan filter',
    feature3Desc: 'Dengan tubuh yang sakit, Anda tidak bisa pergi ke sembarang rumah sakit. Kami hanya menampilkan lembaga medis yang ditunjuk untuk kecelakaan kerja di sekitar lokasi Anda.',
    feature3Cta: 'Cari RS Kecelakaan di Sekitar Saya',
    feature4Title: 'Dokumen yang dibutuhkan, temukan dengan satu pencarian',
    feature4Desc: 'Jangan bingung lagi dengan dokumen kecelakaan kerja yang sulit. Cukup cari untuk mendapatkan formulir wajib dan contoh pengisiannya segera.',
    feature4Cta: 'Cari Dokumen Penting',
    bottomTitlePrefix: 'Semua informasi kecelakaan kerja yang Anda butuhkan,',
    bottomTitleSuffix: 'terkumpul di dasbor pribadi Anda.',
    bottomDescription: 'Jangan mencari ke mana-mana. Cukup daftar dan lihat semua informasi penting yang dirangkum sekilas.',
    bottomCta: 'Mulai AI Kecelakaan Kerja secara Gratis',
    imageNotice: 'Teks dalam gambar berdasarkan bahasa Korea.',
    nuanceDisclaimer: 'Konten ini adalah versi terjemahan AI untuk membantu pemahaman. Silakan periksa dokumen asli bahasa Korea untuk interpretasi hukum yang akurat.',
  },
  ne: {
    heroTitlePrefix: 'जटिल औद्योगिक दुर्घटना,',
    heroTitleSuffix: 'एक्लै सामना नगर्नुहोस्।',
    heroDescription: 'कहाँ सोध्ने भनेर अन्योलमा हुनुहुन्छ? आवेदनदेखि क्षतिपूर्तिसम्म, ReworkCare ले तपाईंलाई गाँठो फुकाए जस्तै चरण-दर-चरण मार्गदर्शन गर्नेछ।',
    heroCta: 'औद्योगिक दुर्घटना एआई नि:शुल्क प्रयोग गर्नुहोस्',
    statsTitle: 'म पनि कामको क्रममा दुर्घटनामा परेको घाइते कामदार थिएँ।',
    statsDescription: 'उपचारको कठिन समयमा कसैले मलाई पहिल्यै भनिदिए हुन्थ्यो भनेर सोचेका जानकारीहरू मैले सङ्कलन गरेको छु। म तपाईंको भरपर्दो मार्गदर्शक बन्नेछु।',
    statDocsLabel: 'कागजात निर्देशन',
    statDocsDesc: 'आवश्यक कागजात लेखन गाइड',
    statVideoLabel: 'व्याख्यात्मक भिडियो',
    statVideoDesc: 'सजिलो बुझाइको लागि भिडियोहरू',
    statHospitalLabel: 'दुर्घटना अस्पताल',
    statHospitalDesc: 'पुनर्स्थापना प्रमाणित चिकित्सा संस्थाहरू',
    statRehabLabel: 'पुनर्स्थापना केन्द्र',
    statRehabDesc: 'व्यावसायिक तालिम र पुनर्स्थापना सुविधाहरू',
    statSource: 'COMWEL आधिकारिक डाटामा आधारित',
    feature1Title: 'तपाईंलाई सुहाउने क्षतिपूर्ति सुविधाहरू एक नजरमा हेर्नुहोस्',
    feature1Desc: 'उपचार खर्च र बिदा भत्ता बाहेक अन्य धेरै सुविधाहरू छन्। हामी तपाईंलाई कुनै पनि सहयोग प्रणाली नछुटाउन मार्गदर्शन गर्नेछौं।',
    feature1Cta: 'अनुकूल क्षतिपूर्ति रिपोर्ट हेर्नुहोस्',
    feature2Title: 'जटिल औद्योगिक दुर्घटना प्रक्रिया र सर्तहरू सजिलै सोध्नुहोस्',
    feature2Desc: 'विशेष AI ले कठिन सर्त र प्रश्नहरूको तुरुन्तै जवाफ दिन्छ। हामी दुर्घटना देखि फिर्ता सम्मको सम्पूर्ण प्रक्रिया व्यवस्थित गर्छौं र तपाईंले अहिले के गर्नुपर्छ भनेर मार्गदर्शन गर्छौं।',
    feature2Cta: 'AI दुर्घटना गाइड सुरु गर्नुहोस्',
    feature3Title: 'घर नजिकैको दुर्घटना अस्पताल, फिल्टरको साथ खोज्नुहोस्',
    feature3Desc: 'घाइते शरीरको साथ तपाईं जुनसुकै अस्पताल जान सक्नुहुन्न। हामी तपाईंको नजिकै औद्योगिक दुर्घटना तोकिएका अस्पतालहरू मात्र देखाउँछौं।',
    feature3Cta: 'मेरो वरिपरि दुर्घटना अस्पताल खोज्नुहोस्',
    feature4Title: 'आवश्यक कागजातहरू, एकै खोजमा फेला पार्नुहोस्',
    feature4Desc: 'गाह्रो कागजातहरूका कारण अब अलमलमा नपर्नुहोस्। खोज्नुहोस् र आवश्यक फारमहरू र लेखन उदाहरणहरू तुरुन्तै प्राप्त गर्नुहोस्।',
    feature4Cta: 'आवश्यक कागजातहरू खोज्नुहोस्',
    bottomTitlePrefix: 'तपाईंलाई चाहिने औद्योगिक दुर्घटना जानकारी,',
    bottomTitleSuffix: 'सबै तपाईंको व्यक्तिगत ड्यासबोर्डमा संकलन गरिएको छ।',
    bottomDescription: 'कतै खोज्दै नहिँड्नुहोस्। दर्ता गर्नुहोस् र सबै आवश्यक जानकारी एक नजरमा प्राप्त गर्नुहोस्।',
    bottomCta: 'औद्योगिक दुर्घटना एआई नि:शुल्क सुरु गर्नुहोस्',
    imageNotice: 'छविहरूमा भएका पाठहरू कोरियाली भाषामा आधारित छन्।',
    nuanceDisclaimer: 'यो सामग्री बुझाइमा मद्दत गर्न एआई अनुवादित संस्करण हो। सही कानूनी व्याख्याको लागि कृपया कोरियाली मूल कागजातहरू जाँच गर्नुहोस्।',
  },
  hi: {
    heroTitlePrefix: 'जटिल औद्योगिक दुर्घटनाएं,',
    heroTitleSuffix: 'अकेले सामना न करें।',
    heroDescription: 'क्या आप इस बात को लेकर उलझन में हैं कि किससे पूछें? आवेदन से लेकर मुआवजे तक, ReworkCare आपको चरण-दर-चरण मार्गदर्शन देगा जैसे किसी गांठ को सुलझाना हो।',
    heroCta: 'औद्योगिक दुर्घटना एआई का निःशुल्क उपयोग करें',
    statsTitle: 'मैं भी एक घायल कर्मचारी था जिसने काम के दौरान दुर्घटना का अनुभव किया था।',
    statsDescription: 'इलाज के कठिन समय में मैंने वह जानकारी एकत्र की जो मुझे लगा कि काश किसी ने मुझे पहले बता दी होती। मैं आपका भरोसेमंद मार्गदर्शक बनूंगा।',
    statDocsLabel: 'दस्तावेज़ गाइड',
    statDocsDesc: 'आवश्यक दस्तावेज़ लेखन गाइड',
    statVideoLabel: 'व्याख्यात्मक वीडियो',
    statVideoDesc: 'आसान समझ के लिए वीडियो',
    statHospitalLabel: 'दुर्घटना अस्पताल',
    statHospitalDesc: 'पुनर्वास प्रमाणित चिकित्सा संस्थान',
    statRehabLabel: 'पुनर्वास केंद्र',
    statRehabDesc: 'व्यावसायिक प्रशिक्षण और पुनर्वास सुविधाएं',
    statSource: 'COMWEL आधिकारिक डेटा पर आधारित',
    feature1Title: 'अपने लिए उपयुक्त मुआवजे की मदों को एक नज़र में देखें',
    feature1Desc: 'चिकित्सा खर्च और छुट्टी भत्ते के अलावा और भी कई चीजें हैं। हम आपका मार्गदर्शन करेंगे ताकि आप विभिन्न सहायता प्रणालियों को न चूकें।',
    feature1Cta: 'कस्टम मुआवजा रिपोर्ट देखें',
    feature2Title: 'जटिल औद्योगिक दुर्घटना प्रक्रियाओं और शर्तों को आसानी से पूछें',
    feature2Desc: 'विशेषज्ञ AI कठिन शर्तों और प्रश्नों का तुरंत उत्तर देता है। हम दुर्घटना से लेकर वापसी तक की पूरी प्रक्रिया को व्यवस्थित करते हैं और मार्गदर्शन करते हैं कि आपको अब क्या करना चाहिए।',
    feature2Cta: 'AI दुर्घटना गाइड शुरू करें',
    feature3Title: 'घर के पास दुर्घटना अस्पताल, फिल्टर के साथ खोजें',
    feature3Desc: 'घायल शरीर के साथ आप किसी भी अस्पताल में नहीं जा सकते। हम केवल आपके आस-पास औद्योगिक दुर्घटना के लिए निर्धारित चिकित्सा संस्थान दिखाते हैं।',
    feature3Cta: 'मेरे पास दुर्घटना अस्पताल खोजें',
    feature4Title: 'आवश्यक दस्तावेज़, एक ही खोज में पाएं',
    feature4Desc: 'कठिन दस्तावेज़ों के कारण अब और न भटकें। आवश्यक फॉर्म और लेखन उदाहरण तुरंत पाने के लिए बस खोजें।',
    feature4Cta: 'आवश्यक दस्तावेज़ ब्राउज़ करें',
    bottomTitlePrefix: 'आपकी ज़रूरत की सभी जानकारी,',
    bottomTitleSuffix: 'आपके व्यक्तिगत डैशबोर्ड में संकलित।',
    bottomDescription: 'इधर-उधर न भटकें। बस साइन अप करें और सभी आवश्यक जानकारी एक नज़र में व्यवस्थित पाएं।',
    bottomCta: 'औद्योगिक दुर्घटना एआई निःशुल्क शुरू करें',
    imageNotice: 'छवियों में दिए गए टेक्स्ट कोरियाई पर आधारित हैं।',
    nuanceDisclaimer: 'यह सामग्री समझ में मदद करने के लिए एआई अनुवादित संस्करण है। सटीक कानूनी व्याख्या के लिए कृपया कोरियाई मूल दस्तावेज़ों की जांच करें।',
  },
};

export const navTranslations: Record<'ko' | 'en', NavTranslation> = {
  ko: {
    brand: "리워크케어",
    dashboard: "대시보드",
    chatbot: "AI 산재 상담",
    timeline: "진행 절차",
    hospitals: "산재 지정 병원",
    documents: "산재 서류",
    counseling: "심리 회복실",
  },
  en: {
    brand: "ReWorkCare",
    dashboard: "Dashboard",
    chatbot: "AI Chatbot",
    timeline: "Timeline",
    hospitals: "Hospitals",
    documents: "Documents",
    counseling: "Counseling",
  },
};

export const footerTranslations: Record<'ko' | 'en', FooterTranslation> = {
  ko: {
    brand: "리워크케어",
    slogan: "산재 환자를 위한 통합 지원 플랫폼",
    description: "AI 기술을 활용하여 복잡한 산재 정보를 이해하기 쉽게 제공하고, 환자와 가족의 일상 회복을 돕습니다.",
    aboutLink: "서비스 소개 보기 →",
    notice: "공지사항",
    legalDisclaimer: "본 사이트의 정보는 참고용이며 법적 효력이 없습니다. 정확한 내용은 근로복지공단 또는 전문가와 상의하세요.",
    copyright: "© {year} ReWorkCare. All rights reserved.",
    terms: "이용약관",
    privacy: "개인정보처리방침",
    csContact: "1:1 문의하기",
    csTitle: "1:1 고객센터 문의",
    csPlaceholder: "문의 내용을 입력하세요...",
    csEmpty: "문의사항을 남겨주시면\n담당자가 답변해 드립니다.",
    csSendError: "메시지 전송 실패",
  },
  en: {
    brand: "ReWorkCare",
    slogan: "Integrated Support Platform for Injured Workers",
    description: "Using AI technology to analyze complex industrial accident regulations easily and help patients and families recover their daily lives.",
    aboutLink: "About Service →",
    notice: "Notice",
    legalDisclaimer: "Information on this site is for reference and has no legal effect. Consult with professionals for exact details.",
    copyright: "© {year} ReWorkCare. All rights reserved.",
    terms: "Terms of Service",
    privacy: "Privacy Policy",
    csContact: "1:1 Inquiry",
    csTitle: "1:1 Customer Support",
    csPlaceholder: "Enter your inquiry...",
    csEmpty: "Leave your inquiry and\nwe will get back to you.",
    csSendError: "Failed to send message",
  },
};

export const aboutTranslations: Record<Locale, AboutTranslation> = {
  ko: {
    heroBadge: "산재 근로자와 가족을 위한 이야기",
    heroTitle: "산재라는 막막한 시간, 기술보다 마음으로 먼저 다가가겠습니다.",
    heroDescription: "갑작스러운 사고와 복잡한 절차, 낯선 용어들까지... 치료에만 전념해야 할 시기에 겪게 되는 막막함을 누구보다 잘 알고 있습니다.",
    storyTitle: "왜 리워크케어를 만들었나요?",
    storyP1: "저 또한 산재로 인해 2년이라는 긴 시간 동안 병원에서 치료를 받았습니다. 몸이 아픈 것보다 더 힘들었던 것은 \"내가 지금 잘하고 있는 걸까?\", \"다음에 무엇을 해야 하지?\"라는 정보의 부재에서 오는 불안감이었습니다.",
    storyP2: "병원 로비에서 만난 중년의 환자분들이 키오스크 앞에서 서성이고, 한국말이 서툰 외국인 근로자가 복잡한 서류 뭉치를 든 채 어찌할 바를 모르는 모습을 보았습니다. 이런 정보의 격차는 결국 치료와 회복의 격차로 이어지는 안타까운 현실이었습니다.",
    storyP3: "\"가장 어려운 순간에, 누구에게나 평등한 조력자가 있다면 어떨까?\"",
    storyP4: "다행히 우리는 AI 기술이 비약적으로 발전하는 시대를 살아가고 있습니다. 어려운 법률 용어를 쉬운 말로 풀어서 설명해주고, 모국어로 질문해도 한국의 산재 정보를 찾아주는 AI라면 이 격차를 메울 수 있다고 믿었습니다. 그렇게 리워크케어는 시작되었습니다.",
    solutionsTitle: "기술보다 소중한 회복의 가치",
    solutionsDescription: "기술은 차갑지만, 그것을 사용하는 목적은 따뜻해야 한다고 생각합니다. 리워크케어가 당신의 곁에서 묵묵히 돕겠습니다.",
    solution1Title: "AI 산재 상담 파트너",
    solution1Desc: "최신 산재 법령과 판례 등 다양한 문서를 학습한 AI(RAG 기술)가 24시간 당신의 궁금증을 해결해 드립니다.",
    solution2Title: "검증된 산재 병원 찾기",
    solution2Desc: "근로복지공단이 인증한 '재활인증의료기관' 데이터를 기반으로, 내 주변의 믿을 수 있는 병원을 지도에서 바로 찾아드립니다.",
    solution3Title: "안심 휴업급여 계산기",
    solution3Desc: "복잡한 계산식은 몰라도 됩니다. 평균임금만 입력하면 예상 휴업급여를 즉시 계산해 드려, 미래를 계획할 수 있게 돕습니다.",
    solution4Title: "단계별 맞춤 가이드",
    solution4Desc: "산재 신청부터 요양, 장해 심사, 그리고 직귀 복귀까지. 내가 지금 어느 단계에 있고, 다음에 무엇을 준비해야 하는지 명확한 로드맵을 제시합니다.",
    aiBadge: "Powered by Google Gemini & RAG",
    aiTitle: "AI가 당신의 전담 매니저가 됩니다",
    aiDescription: "리워크케어의 인공지능은 단순히 정해진 답변만 하는 챗봇이 아닙니다. 당신의 상황을 이해하고, 다양한 산재 데이터와 법률 정보를 실시간으로 분석하여 가장 정확하고 개인화된 가이드를 제공합니다.",
    aiFeat1Title: "복잡한 문서 분석",
    aiFeat1Desc: "어려운 법률 용어를 쉬운 말로 번역",
    aiFeat2Title: "정확한 정보 검색",
    aiFeat2Desc: "RAG 기술로 할루시네이션 최소화",
    aiFeat3Title: "서류 작성 보조",
    aiFeat3Desc: "빈칸 채우기부터 제출까지 완벽 가이드",
    techStackTitle: "사용된 핵심 기술",
    techNextDesc: "React 기반 풀스택 프레임워크",
    techSupaDesc: "PostgreSQL 데이터베이스 및 백엔드",
    techGeminiDesc: "AI 기반 서류 가이드 생성",
    techRagDesc: "Supabase Vector 기반 AI 산재 상담",
    techMapDesc: "위치 기반 병원 정보 시각화",
    techAuthDesc: "사용자 인증 및 관리",
    closingTitle: "산재는 끝이 아니라, 다시 일어서는 시작입니다",
    closingDescription: "리워크케어는 당신이 다시 일상으로 건강하게 돌아가는 길목에서, 가장 믿음직하고 따뜻한 길잡이가 되고 싶습니다. 어려운 점이 있다면 언제든 편하게 물어봐 주세요.",
  },
  en: {
    heroBadge: "A Story for Workers and Families",
    heroTitle: "In the overwhelming time of an accident, we approach with heart before technology.",
    heroDescription: "Sudden accidents, complex procedures, unfamiliar terms... We know better than anyone the helplessness felt when you should be focusing only on treatment.",
    storyTitle: "Why did we create ReWorkCare?",
    storyP1: "I also received treatment in the hospital for a long time of 2 years due to an industrial accident. What was harder than the physical pain was the anxiety from the absence of information: \"Am I doing this right?\", \"What should I do next?\"",
    storyP2: "I saw middle-aged patients hovering in front of kiosks in the hospital lobby, and foreign workers who spoke little Korean feeling lost with a stack of complex documents. This gap in information was a sad reality that eventually led to a gap in treatment and recovery.",
    storyP3: "\"What if there was an equal assistant for everyone in their most difficult moment?\"",
    storyP4: "Fortunately, we live in an era where AI technology is developing rapidly. I believed that an AI that explains difficult legal terms in easy words and finds Korean accident information even if asked in one's native language could bridge this gap. That's how ReWorkCare began.",
    solutionsTitle: "The Value of Recovery Over Technology",
    solutionsDescription: "Technology is cold, but we believe the purpose of using it should be warm. ReWorkCare will silently help by your side.",
    solution1Title: "AI Accident Partner",
    solution1Desc: "AI (RAG technology) that has learned various documents like the latest laws and precedents will solve your questions 24/7.",
    solution2Title: "Find Certified Hospitals",
    solution2Desc: "Based on 'Rehabilitation Certified Medical Institution' data, we find reliable hospitals near you on the map immediately.",
    solution3Title: "Safe Salary Calculator",
    solution3Desc: "You don't need to know complex formulas. Just enter your average wage and we'll calculate your expected temporary disability benefit.",
    solution4Title: "Step-by-Step Custom Guide",
    solution4Desc: "From application to recovery and returning to work. We present a clear roadmap of where you are and what to prepare next.",
    aiBadge: "Powered by Google Gemini & RAG",
    aiTitle: "AI Becomes Your Dedicated Manager",
    aiDescription: "ReWorkCare's AI is not just a chatbot that gives fixed answers. It understands your situation and analyzes various accident data and legal info in real-time to provide the most accurate guide.",
    aiFeat1Title: "Complex Document Analysis",
    aiFeat1Desc: "Translates difficult legal terms into easy language",
    aiFeat2Title: "Accurate Info Search",
    aiFeat2Desc: "Minimizes hallucinations with RAG technology",
    aiFeat3Title: "Document Writing Assist",
    aiFeat3Desc: "Complete guide from filling blanks to submission",
    techStackTitle: "Core Technologies Used",
    techNextDesc: "React-based full-stack framework",
    techSupaDesc: "PostgreSQL database and backend",
    techGeminiDesc: "AI-based document guide generation",
    techRagDesc: "Supabase Vector-based AI counseling",
    techMapDesc: "Location-based hospital info visualization",
    techAuthDesc: "User authentication and management",
    closingTitle: "An accident is not the end, but a new beginning to stand up again",
    closingDescription: "ReWorkCare wants to be the most reliable and warm guide on your way back to daily life. If you have any difficulties, please feel free to ask anytime.",
  },
  zh: {
    heroBadge: "为工伤职工及其家属准备的故事",
    heroTitle: "在工伤那段茫然的时间里，我们将用真心而非技术先行一步。",
    heroDescription: "突发的事故、复杂的程序、陌生的术语……我们比任何人都清楚在应该专心治疗的时候所感受到的那种茫然。",
    storyTitle: "为什么要创立 ReWorkCare？",
    storyP1: "我也曾因工伤在医院接受了长达2年的治疗。比身体疼痛更让我感到痛苦的，是由于缺乏信息而产生的焦虑：“我现在做得对吗？”、“接下来该做什么？”",
    storyP2: "我看到在医院大厅的自助机前徘徊的中年患者，以及韩语生涩、拿着一叠复杂文件手足无措的外籍劳工。信息的不对称最终导致了治疗和康复效果的差异，这真是一个令人痛心的现实。",
    storyP3: "“如果在人们最艰难的时刻，能有一个对每个人都公平的助手，那该多好？”",
    storyP4: "幸运的是，我们生活在AI技术飞速发展的时代。我相信，如果有一个AI能用通俗易懂的语言解释艰涩的法律术语，即使是用母语提问也能查找到韩国的工伤信息，就能弥合这一鸿沟。ReWorkCare 便是由此诞生的。",
    solutionsTitle: "康复的价值重于技术",
    solutionsDescription: "技术是冰冷的，但我们相信使用它的目的应该是温暖的。ReWorkCare 将在您身边默默守护。",
    solution1Title: "AI 工伤咨询伙伴",
    solution1Desc: "学习了最新工伤法令、判例等各种文件的 AI（RAG 技术）将全天候为您解答疑问。",
    solution2Title: "查找认证工伤医院",
    solution2Desc: "基于“康复认证医疗机构”数据，为您实时在地图上查找周边值得信赖的医院。",
    solution3Title: "安心休业补偿计算器",
    solution3Desc: "无需了解复杂的计算公式。只需输入平均工资，即可估算预计的休业补偿费用。",
    solution4Title: "分阶段定制指南",
    solution4Desc: "从申请工伤到疗养、伤残评定及重返岗位，为您提供清晰的路线图，告知当前所处阶段及后续准备工作。",
    aiBadge: "由 Google Gemini & RAG 提供技术支持",
    aiTitle: "AI 成为您的专属管家",
    aiDescription: "ReWorkCare 的人工智能不仅是只会回答固定问题的聊天机器人。它能理解您的处境，实时分析各种工伤数据和法律信息，提供最准确和个性化的指南。",
    aiFeat1Title: "复杂文档分析",
    aiFeat1Desc: "将艰涩的法律术语转化为通俗易懂的语言",
    aiFeat2Title: "精准信息检索",
    aiFeat2Desc: "利用 RAG 技术将幻觉风险降至最低",
    aiFeat3Title: "辅助填写文件",
    aiFeat3Desc: "从填空白到最终提交的全方位指南",
    techStackTitle: "使用的核心技术",
    techNextDesc: "基于 React 的全栈框架",
    techSupaDesc: "PostgreSQL 数据库及后端",
    techGeminiDesc: "基于 AI 的文件指南生成",
    techRagDesc: "基于 Supabase Vector 的 AI 咨询",
    techMapDesc: "基于位置的医院信息可视化",
    techAuthDesc: "用户身份验证与管理",
    closingTitle: "工伤不是终点，而是重新站起来的新起点",
    closingDescription: "在您重返日常生活的道路上，ReWorkCare 希望成为您最可靠、最温暖的引路人。如有任何困难，请随时垂询。",
  },
  vi: {
    heroBadge: "Câu chuyện dành cho người lao động và gia đình",
    heroTitle: "Trong thời gian mờ mịt của tai nạn, chúng tôi tiếp cận bằng trái tim trước công nghệ.",
    heroDescription: "Tai nạn bất ngờ, thủ tục phức tạp, thuật ngữ xa lạ... Chúng tôi hiểu rõ hơn ai hết sự bất lực khi bạn chỉ nên tập trung vào điều trị.",
    storyTitle: "Tại sao chúng tôi tạo ra ReWorkCare?",
    storyP1: "Tôi cũng từng phải điều trị tại bệnh viện trong suốt 2 năm dài do tai nạn lao động. Điều khó khăn hơn cả nỗi đau thể xác chính là sự lo lắng do thiếu thông tin: \"Tôi làm thế này có đúng không?\", \"Tiếp theo tôi phải làm gì?\"",
    storyP2: "Tôi đã thấy những bệnh nhân trung niên lúng túng trước máy bán vé tự động ở sảnh bệnh viện, và những lao động nước ngoài không giỏi tiếng Hàn cảm thấy lạc lõng với một xấp tài liệu phức tạp. Khoảng cách về thông tin này là một thực tế đáng buồn, cuối cùng dẫn đến khoảng cách trong điều trị và phục hồi.",
    storyP3: "\"Sẽ ra sao nếu có một trợ lý bình đẳng cho tất cả mọi người trong khoảnh khắc khó khăn nhất của họ?\"",
    storyP4: "May mắn thay, chúng ta đang sống trong thời đại công nghệ AI phát triển nhanh chóng. Tôi tin rằng một AI giải thích các thuật ngữ pháp lý khó hiểu bằng những từ ngữ dễ hiểu và tìm thấy thông tin tai nạn tại Hàn Quốc ngay cả khi được hỏi bằng tiếng mẹ đẻ có thể lấp đầy khoảng cách này. Đó là cách ReWorkCare bắt đầu.",
    solutionsTitle: "Giá trị của sự phục hồi quan trọng hơn công nghệ",
    solutionsDescription: "Công nghệ thì lạnh lẽo, nhưng chúng tôi tin rằng mục đích sử dụng nó nên ấm áp. ReWorkCare sẽ âm thầm đồng hành bên cạnh bạn.",
    solution1Title: "Đối tác tư vấn AI",
    solution1Desc: "AI (công nghệ RAG) đã học nhiều tài liệu như luật và án lệ mới nhất sẽ giải đáp thắc mắc của bạn 24/7.",
    solution2Title: "Tìm bệnh viện chứng nhận",
    solution2Desc: "Dựa trên dữ liệu 'Cơ sở y tế chứng nhận phục hồi chức năng', chúng tôi tìm thấy các bệnh viện đáng tin cậy gần bạn trên bản đồ ngay lập tức.",
    solution3Title: "Máy tính lương nghỉ việc",
    solution3Desc: "Bạn không cần biết các công thức phức tạp. Chỉ cần nhập lương trung bình và chúng tôi sẽ tính toán mức trợ cấp nghỉ việc dự kiến.",
    solution4Title: "Hướng dẫn tùy chỉnh từng bước",
    solution4Desc: "Từ khâu nộp đơn đến phục hồi và quay lại làm việc. Chúng tôi trình bày một lộ trình rõ ràng về giai đoạn bạn đang ở và những gì cần chuẩn bị tiếp theo.",
    aiBadge: "Được hỗ trợ bởi Google Gemini & RAG",
    aiTitle: "AI trở thành quản lý tận tâm của bạn",
    aiDescription: "AI của ReWorkCare không chỉ là một chatbot đưa ra các câu trả lời cố định. Nó hiểu tình huống của bạn và phân tích dữ liệu tai nạn cũng như thông tin pháp lý đa dạng trong thời gian thực để cung cấp hướng dẫn chính xác nhất.",
    aiFeat1Title: "Phân tích tài liệu phức tạp",
    aiFeat1Desc: "Dịch các thuật ngữ pháp lý khó hiểu sang ngôn ngữ dễ hiểu",
    aiFeat2Title: "Tìm kiếm thông tin chính xác",
    aiFeat2Desc: "Giảm thiểu ảo giác bằng công nghệ RAG",
    aiFeat3Title: "Hỗ trợ viết hồ sơ",
    aiFeat3Desc: "Hướng dẫn hoàn chỉnh từ điền vào chỗ trống đến khi nộp hồ sơ",
    techStackTitle: "Công nghệ cốt lõi được sử dụng",
    techNextDesc: "Framework full-stack dựa trên React",
    techSupaDesc: "Cơ sở dữ liệu PostgreSQL và backend",
    techGeminiDesc: "Tạo hướng dẫn hồ sơ dựa trên AI",
    techRagDesc: "Tư vấn AI dựa trên Supabase Vector",
    techMapDesc: "Trực quan hóa thông tin bệnh viện dựa trên vị trí",
    techAuthDesc: "Xác thực và quản lý người dùng",
    closingTitle: "Tai nạn không phải là kết thúc, mà là một khởi đầu mới để đứng dậy lần nữa",
    closingDescription: "ReWorkCare muốn trở thành người dẫn đường tin cậy và ấm áp nhất trên con đường quay lại cuộc sống hàng ngày của bạn. Nếu bạn gặp bất kỳ khó khăn nào, đừng ngần ngại hỏi chúng tôi bất cứ lúc nào.",
  },
  th: {
    heroBadge: "เรื่องราวสำหรับคนงานและครอบครัว",
    heroTitle: "ในช่วงเวลาที่มืดแปดด้านจากอุบัติเหตุ เราเข้าหาด้วยหัวใจก่อนเทคโนโลยี",
    heroDescription: "อุบัติเหตุที่เกิดขึ้นกะทันหัน ขั้นตอนที่ซับซ้อน คำศัพท์ที่ไม่คุ้นเคย... เรารู้ดีกว่าใครถึงความรู้สึกหมดหนทางในช่วงเวลาที่คุณควรโฟกัสแค่การรักษา",
    storyTitle: "ทำไมเราถึงสร้าง ReWorkCare?",
    storyP1: "ผมเคยเข้ารับการรักษาในโรงพยาบาลเป็นเวลา 2 ปีเนื่องจากอุบัติเหตุจากการทำงาน สิ่งที่ยากกว่าความเจ็บปวดทางกายคือความกังวลจากการขาดข้อมูล: \"ผมทำถูกไหม?\", \"ผมต้องทำอะไรต่อ?\"",
    storyP2: "ผมเห็นผู้ป่วยวัยกลางคนยืนงงอยู่หน้าตู้คีออสก์ในล็อบบี้โรงพยาบาล และแรงงานต่างชาติที่พูดภาษาเกาหลีได้น้อยรู้สึกหลงทางกับกองเอกสารที่ซับซ้อน ช่องว่างของข้อมูลนี้เป็นความจริงที่น่าเศร้า ซึ่งสุดท้ายก็นำไปสู่ช่องว่างในการรักษาและการฟื้นฟู",
    storyP3: "\"จะเป็นอย่างไรถ้ามีผู้ช่วยที่เท่าเทียมสำหรับทุกคนใน่วงเวลาที่ยากลำบากที่สุดของพวกเขา?\"",
    storyP4: "โชคดีที่เราอยู่ในยุคที่เทคโนโลยี AI พัฒนาไปอย่างรวดเร็ว ผมเชื่อว่า AI ที่อธิบายข้อกฎหมายที่ยากด้วยถ้อยคำที่เข้าใจง่าย และค้นหาข้อมูลอุบัติเหตุในเกาหลีได้แม้จะถามเป็นภาษาแม่ ก็น่าจะช่วยเติมเต็มช่องว่างนี้ได้ นั่นคือจุดเริ่มต้นของ ReWorkCare",
    solutionsTitle: "คุณค่าของการฟื้นฟูที่เหนือกว่าเทคโนโลยี",
    solutionsDescription: "เทคโนโลยีนั้นเย็นชา แต่เราเชื่อว่าจุดประสงค์ในการใช้นั้นควรจะอบอุ่น ReWorkCare จะช่วยคุณอย่างเงียบๆ อยู่เคียงข้างคุณ",
    solution1Title: "คู่คิด AI ด้านอุบัติเหตุ",
    solution1Desc: "AI (เทคโนโลยี RAG) ที่เรียนรู้เอกสารต่างๆ เช่น กฎหมายและคำพิพากษาล่าสุด จะช่วยตอบคำถามของคุณได้ตลอด 24 ชั่วโมง",
    solution2Title: "ค้นหาโรงพยาบาลที่ได้รับการรับรอง",
    solution2Desc: "จากข้อมูล 'สถานพยาบาลที่ได้รับการรับรองด้านการฟื้นฟู' เราจะช่วยค้นหาโรงพยาบาลที่เชื่อถือได้ใกล้คุณบนแผนที่ได้ทันที",
    solution3Title: "เครื่องคำนวณเงินชดเชยที่ปลอดภัย",
    solution3Desc: "คุณไม่จำเป็นต้องรู้สูตรที่ซับซ้อน เพียงป้อนค่าจ้างเฉลี่ยของคุณ แล้วเราจะคำนวณเงินทดแทนการหยุดงานที่คาดการณ์ไว้ให้",
    solution4Title: "คู่มือปรับแต่งเองแบบทีละขั้นตอน",
    solution4Desc: "ตั้งแต่การสมัครไปจนถึงการพักฟื้นและการกลับเข้าทำงาน เรานำเสนอโรดแมปที่ชัดเจนว่าคุณอยู่ที่จุดไหนและต้องเตรียมอะไรต่อ",
    aiBadge: "ขับเคลื่อนโดย Google Gemini & RAG",
    aiTitle: "AI จะกลายเป็นผู้จัดการส่วนตัวของคุณ",
    aiDescription: "AI ของ ReWorkCare ไม่ใช่แค่แชทบอทที่ให้คำตอบตายตัว มันเข้าใจสถานการณ์ของคุณและวิเคราะห์ข้อมูลอุบัติเหตุและข้อกฎหมายที่หลากหลายแบบเรียลไทม์เพื่อให้คำแนะนำที่แม่นยำที่สุด",
    aiFeat1Title: "วิเคราะห์เอกสารที่ซับซ้อน",
    aiFeat1Desc: "แปลข้อกฎหมายที่ยากเป็นภาษาที่เข้าใจง่าย",
    aiFeat2Title: "ค้นหาข้อมูลที่แม่นยำ",
    aiFeat2Desc: "ลดการสร้างข้อมูลเท็จ (hallucination) ด้วยเทคโนโลยี RAG",
    aiFeat3Title: "ช่วยเขียนเอกสาร",
    aiFeat3Desc: "คู่มือที่สมบูรณ์ตั้งแต่การกรอกรายละเอียดไปจนถึงการยื่นเอกสาร",
    techStackTitle: "เทคโนโลยีหลักที่ใช้",
    techNextDesc: "ฟูลสแต็กเฟรมเวิร์กบนพื้นฐาน React",
    techSupaDesc: "ฐานข้อมูล PostgreSQL และแบ็กเอนด์",
    techGeminiDesc: "สร้างคู่มือเอกสารโดยใช้ AI",
    techRagDesc: "การให้คำปรึกษา AI บนพื้นฐาน Supabase Vector",
    techMapDesc: "การแสดงข้อมูลโรงพยาบาลในรูปแบบภาพตามตำแหน่งที่ตั้ง",
    techAuthDesc: "การยืนยันตัวตนและการจัดการผู้ใช้",
    closingTitle: "อุบัติเหตุไม่ใช่จุดจบ แต่เป็นจุดเริ่มต้นใหม่ที่จะลุกขึ้นอีกครั้ง",
    closingDescription: "ReWorkCare อยากเป็นไกด์ที่น่าเชื่อถือและอบอุ่นที่สุดบนเส้นทางกลับสู่ชีวิตประจำวันของคุณ หากคุณมีปัญหาใดๆ โปรดสอบถามเราได้ทุกเมื่อ",
  },
  uz: {
    heroBadge: "Ishchilar va oilalar uchun hikoya",
    heroTitle: "Mehnat jarohati paytidagi tushkunlikda, biz texnologiyadan oldin qalb bilan yondashamiz.",
    heroDescription: "Kutilmagan baxtsiz hodisalar, murakkab jarayonlar, notanish atamalar... Faqat davolanishga e'tibor qaratishingiz kerak bo'lgan paytdagi nochorlikni biz hamma dan ham yaxshiroq tushunamiz.",
    storyTitle: "Nima uchun ReWorkCare'ni yaratdik?",
    storyP1: "Men ham mehnat jarohati tufayli 2 yil davomida kasalxonada davolanganman. Jismoniy og'riqdan ko'ra, ma'lumot yo'qligi sababli kelib chiqadigan tashvish qiynagan: \"Men hamma narsani to'g'ri qilyapmanmi?\", \"Keyin nima qilishim kerak?\"",
    storyP2: "Kasalxona foyesidagi kiosklar oldida sumirilib yurgan o'rta yoshli bemorlarni va koreys tilini yaxshi bilmaydigan, murakkab hujjatlar to'plami bilan nima qilishni bilmay turgan chet ellik ishchilarni ko'rdim. Ma'lumotdagi ushbu farq, afsuski, davolanish va tiklanishdagi farqga olib kelar edi.",
    storyP3: "\"Eng og'ir damlarda hamma uchun teng bo'lgan yordamchi bo'lsa-chi?\"",
    storyP4: "Baxtimizga, biz AI texnologiyasi shiddat bilan rivojlanayotgan davrda yashayapmiz. Qiyin yuridik atamalarni oddiy so'zlar bilan tushuntirib beradigan va ona tilida so'ralganda ham Koreyadagi mehnat jarohati ma'lumotlarini topib beradigan AI bu bo'shliqni to'ldirishi mumkinligiga ishondim. ReWorkCare shunday boshlandi.",
    solutionsTitle: "Texnologiyadan ko'ra tiklanishning qadri baland",
    solutionsDescription: "Texnologiya sovuq, lekin biz undan foydalanish maqsadi iliq bo'lishi kerak deb hisoblaymiz. ReWorkCare sizning yoningizda jim yordam beradi.",
    solution1Title: "AI Jarohat Hamkori",
    solution1Desc: "Eng so'nggi qonunlar va sud qarorlari kabi turli hujjatlarni o'rgangan AI (RAG texnologiyasi) savollaringizga 24/7 javob beradi.",
    solution2Title: "Sertifikatlangan shifoxonalarni topish",
    solution2Desc: "\"Reabilitatsiya sertifikatiga ega tibbiyot muassasalari\" ma'lumotlariga tayanib, yaqin atrofdagi ishonchli shifoxonalarni xaritadan darhol topamiz.",
    solution3Title: "Xavfsiz maosh kalkulyatori",
    solution3Desc: "Murakkab formulalarni bilish shart emas. Shunchaki o'rtacha ish haqini kiriting va biz kutilayotgan ishlamaganlik nafaqasini hisoblab beramiz.",
    solution4Title: "Bosqichma-bosqich shaxsiy qo'llanma",
    solution4Desc: "Ariza topshirishdan tortib tiklanish va ishga qaytishgacha. Hozir qaysi bosqichda ekanligingizni va nimaga tayyorgarlik ko'rish kerakligini aniq ko'rsatib beramiz.",
    aiBadge: "Google Gemini va RAG tomonidan quvvatlanadi",
    aiTitle: "AI sizning maxsus menejeringizga aylanadi",
    aiDescription: "ReWorkCare AI shunchaki tayyor javoblarni beradigan chatbot emas. U sizning vaziyatingizni tushunadi va turli xil jarohat ma'lumotlari va huquqiy ma'lumotlarni real vaqt rejimida tahlil qilib, eng aniq qo'llanmani taqdim etadi.",
    aiFeat1Title: "Murakkab hujjatlarni tahlil qilish",
    aiFeat1Desc: "Qiyin yuridik atamalarni oddiy tilga tarjima qiladi",
    aiFeat2Title: "Aniq ma'lumot qidirish",
    aiFeat2Desc: "RAG texnologiyasi bilan noto'g'ri ma'lumotlarni kamaytiradi",
    aiFeat3Title: "Hujjat yozishda yordam",
    aiFeat3Desc: "Bo'shliqlarni to'ldirishdan tortib hujjat topshirishgacha to'liq qo'llanma",
    techStackTitle: "Foydalanilgan asosiy texnologiyalar",
    techNextDesc: "React-ga asoslangan full-stack freymvork",
    techSupaDesc: "PostgreSQL ma'lumotlar bazasi va backend",
    techGeminiDesc: "AI-ga asoslangan hujjat qo'llanmasini yaratish",
    techRagDesc: "Supabase Vector-ga asoslangan AI maslahati",
    techMapDesc: "Joylashuvga asoslangan shifoxona ma'lumotlarini vizuallashtirish",
    techAuthDesc: "Foydalanuvchi autentifikatsiyasi va boshqaruvi",
    closingTitle: "Baxtsiz hodisa yakun emas, balki qayta oyoqqa turish niyatida yangi boshlanishdir",
    closingDescription: "ReWorkCare kundalik hayotingizga qaytish yo'lida eng ishonchli va iliq yo'l ko'rsatuvchi bo'lishni xohlaydi. Agar qandaydir qiyinchiliklarga duch kelsangiz, istalgan vaqtda so'rashingiz mumkin.",
  },
  mn: {
    heroBadge: "Ажилчид болон гэр бүлд зориулсан түүх",
    heroTitle: "Ослын улмаас барьц алдсан тэр үед бид технологиос илүү сэтгэлээрээ түрүүлж алхах болно.",
    heroDescription: "Гэнэтийн осол, нарийн төвөгтэй процедур, танил бус нэр томьёо... Зөвхөн эмчилгээнд анхаарлаа хандуулах ёстой үед мэдрэгддэг тэрхүү мухардалыг бид хэнээс ч илүү сайн мэддэг.",
    storyTitle: "Бид яагаад ReWorkCare-ийг бүтээсэн бэ?",
    storyP1: "Би бас үйлдвэрлэлийн ослын улмаас 2 жилийн турш эмнэлэгт эмчлүүлсэн. Биеийн өвдөлтөөс илүү хэцүү байсан зүйл бол мэдээлэл дутмаг байсны улмаас үүссэн түгшүүр байв: \"Би үүнийг зөв хийж байна уу?\", \"Дараад нь би юу хийх ёстой вэ?\"",
    storyP2: "Би эмнэлгийн үүдний танхимд автомат машин (киоск) -ны өмнө гайхаж зогсох дунд эргэм насны өвчтөнүүд, солонгос хэлээр сайн ярьдаггүй, нарийн төвөгтэй бичиг баримтын овоолгоос болоод яахаа мэдэхгүй байгаа гадаад ажилчдыг харсан. Мэдээллийн энэхүү ялгаа нь харамсалтай бодит байдал байсан бөгөөд эцэст нь эмчилгээ, нөхөн сэргээлтийн үр дүнгийн ялгаанд хүргэдэг байв.",
    storyP3: "\"Хэрэв хамгийн хэцүү мөчид хүн бүрд ижил тэгш ханддаг туслах байсан бол яах байсан бол?\"",
    storyP4: "Аз болоход бид AI технологи эрчимтэй хөгжиж буй эрин үед амьдарч байна. Хууль зүйн хүнд нэр томьёог энгийн үгээр тайлбарлаж, төрөлх хэлээр нь асуухад ч Солонгос улсын ослын мэдээллийг олж өгдөг AI л энэ ялгааг арилгаж чадна гэдэгт би итгэсэн. Ингэж л ReWorkCare эхэлсэн юм.",
    solutionsTitle: "Технологиос илүү нөхөн сэргээлтийн үнэ цэнэ",
    solutionsDescription: "Технологи бол хүйтэн, гэхдээ бид түүнийг ашиглах зорилго нь дулаан байх ёстой гэж итгэдэг. ReWorkCare таны хажууд чимээгүйхэн туслах болно.",
    solution1Title: "AI ослын зөвлөх",
    solution1Desc: "Хамгийн сүүлийн үеийн хууль тогтоомж, шүүхийн шийдвэр зэрэг төрөл бүрийн бичиг баримтад суралцсан AI (RAG технологи) таны асуултад 24/7 хариулна.",
    solution2Title: "Мэргэжлийн эмнэлэг хайх",
    solution2Desc: "\"Нөхөн сэргээх сувилал, эмнэлгийн байгууллага\"-ын мэдээлэлд үндэслэн таны ойролцоох найдвартай эмнэлгүүдийг газрын зураг дээр шууд олж өгнө.",
    solution3Title: "Аюулгүй цалингийн тооцоолуур",
    solution3Desc: "Нарийн төвөгтэй томьёо мэдэх шаардлагагүй. Зөвхөн дундаж цалингаа оруулахад л бид таны авах боломжтой тэтгэмжийг тооцоолж өгнө.",
    solution4Title: "Алхам алхмаар хувийн заавар",
    solution4Desc: "Өргөдөл гаргахаас эхлээд эдгэрэх, ажилдаа эргэн орох хүртэл. Та одоо аль шатанд байгаа, дараа нь юу бэлтгэх ёстойг тодорхой харуулна.",
    aiBadge: "Google Gemini болон RAG-аар ажилладаг",
    aiTitle: "AI таны тусгай менежер болно",
    aiDescription: "ReWorkCare AI бол зөвхөн бэлэн хариулт өгдөг чатбот биш юм. Энэ нь таны нөхцөл байдлыг ойлгож, янз бүрийн ослын мэдээлэл болон хууль эрх зүйн мэдээллийг бодит цаг хугацаанд шинжлэн хамгийн үнэн зөв зааварчилгааг өгдөг.",
    aiFeat1Title: "Бичиг баримтын шинжилгээ",
    aiFeat1Desc: "Хууль зүйн хүнд нэр томьёог энгийн хэл рүү хөрвүүлнэ",
    aiFeat2Title: "Мэдээллийн үнэн зөв хайлт",
    aiFeat2Desc: "RAG технологиор буруу мэдээлэл өгөх эрсдэлийг бууруулна",
    aiFeat3Title: "Бичиг баримт бүрдүүлэх тусламж",
    aiFeat3Desc: "Маягт бөглөхөөс эхлээд илгээх хүртэлх бүрэн заавар",
    techStackTitle: "Ашиглагдсан гол технологиуд",
    techNextDesc: "React-д суурилсан full-stack 프레임워크 (framework)",
    techSupaDesc: "PostgreSQL өгөгдлийн сан болон backend",
    techGeminiDesc: "AI-д суурилсан бичиг баримтын заавар үүсгэх",
    techRagDesc: "Supabase Vector-д суурилсан AI зөвлөгөө",
    techMapDesc: "Байршилд суурилсан эмнэлгийн мэдээллийг дүрсжүүлэх",
    techAuthDesc: "Хэрэглэгчийн баталгаажуулалт ба удирдлага",
    closingTitle: "Осол бол төгсгөл биш, харин дахин босох шинэ эхлэл юм",
    closingDescription: "ReWorkCare нь таныг өдөр тутмын амьдралдаа эргэн орох замд хамгийн найдвартай, дулаахан хөтөч байхыг хүсэж байна. Хэрэв ямар нэгэн хүндрэл тулгарвал хэзээ ч хамаагүй асууж болно.",
  },
  id: {
    heroBadge: "Kisah untuk pekerja dan keluarga",
    heroTitle: "Di masa kecelakaan yang membingungkan, kami mendekat dengan hati sebelum teknologi.",
    heroDescription: "Kecelakaan mendadak, prosedur rumit, istilah asing... Kami memahami lebih baik dari siapa pun ketidakberdayaan yang dirasakan saat Anda seharusnya fokus pada pengobatan.",
    storyTitle: "Mengapa kami membuat ReWorkCare?",
    storyP1: "Saya juga menjalani perawatan di rumah sakit selama 2 tahun karena kecelakaan kerja. Yang lebih berat dari rasa sakit fisik adalah kecemasan karena kurangnya informasi: \"Apakah saya melakukan ini dengan benar?\", \"Apa yang harus saya lakukan selanjutnya?\"",
    storyP2: "Saya melihat pasien paruh baya kebingungan di depan kios di lobi rumah sakit, dan pekerja asing yang tidak mahir berbahasa Korea merasa tersesat dengan setumpuk dokumen rumit. Kesenjangan informasi ini adalah kenyataan menyedihkan yang akhirnya menyebabkan kesenjangan dalam pengobatan dan pemulihan.",
    storyP3: "\"Bagaimana jika ada asisten yang setara bagi semua orang di saat-saat tersulit mereka?\"",
    storyP4: "Untungnya, kita hidup di era di mana teknologi AI berkembang pesat. Saya percaya bahwa AI yang menjelaskan istilah hukum yang sulit dengan kata-kata yang mudah dan menemukan informasi kecelakaan Korea meskipun ditanya dalam bahasa ibu dapat menjembatani kesenjangan ini. Begitulah ReWorkCare dimulai.",
    solutionsTitle: "Nilai Pemulihan Lebih dari Teknologi",
    solutionsDescription: "Teknologi itu dingin, tapi kami percaya tujuan menggunakannya haruslah hangat. ReWorkCare akan membantu Anda dengan diam di sisi Anda.",
    solution1Title: "Mitra Kecelakaan AI",
    solution1Desc: "AI (teknologi RAG) yang telah mempelajari berbagai dokumen seperti hukum dan preseden terbaru akan menjawab pertanyaan Anda 24/7.",
    solution2Title: "Cari RS Bersertifikat",
    solution2Desc: "Berdasarkan data 'Lembaga Medis Bersertifikat Rehabilitasi', kami menemukan rumah sakit tepercaya di dekat Anda di peta secara instan.",
    solution3Title: "Kalkulator Gaji Aman",
    solution3Desc: "Anda tidak perlu tahu rumus yang rumit. Cukup masukkan upah rata-rata Anda dan kami akan menghitung perkiraan tunjangan cuti sakit Anda.",
    solution4Title: "Panduan Kustom Bertahap",
    solution4Desc: "Dari pengajuan hingga pemulihan dan kembali bekerja. Kami menyajikan panduan yang jelas tentang posisi Anda saat ini dan apa yang harus dipersiapkan selanjutnya.",
    aiBadge: "Didukung oleh Google Gemini & RAG",
    aiTitle: "AI Menjadi Manajer Khusus Anda",
    aiDescription: "AI ReWorkCare bukan hanya chatbot yang memberikan jawaban tetap. Ia memahami situasi Anda dan menganalisis berbagai data kecelakaan dan informasi hukum secara real-time untuk memberikan panduan yang paling akurat.",
    aiFeat1Title: "Analisis Dokumen Rumit",
    aiFeat1Desc: "Menerjemahkan istilah hukum yang sulit ke dalam bahasa yang mudah",
    aiFeat2Title: "Pencarian Informasi Akurat",
    aiFeat2Desc: "Meminimalkan halusinasi dengan teknologi RAG",
    aiFeat3Title: "Bantuan Penulisan Dokumen",
    aiFeat3Desc: "Panduan lengkap dari mengisi bagian kosong hingga pengiriman",
    techStackTitle: "Teknologi Inti yang Digunakan",
    techNextDesc: "Framework full-stack berbasis React",
    techSupaDesc: "Database PostgreSQL dan backend",
    techGeminiDesc: "Pembuatan panduan dokumen berbasis AI",
    techRagDesc: "Konsultasi AI berbasis Supabase Vector",
    techMapDesc: "Visualisasi informasi rumah sakit berbasis lokasi",
    techAuthDesc: "Autentikasi dan manajemen pengguna",
    closingTitle: "Kecelakaan bukanlah akhir, melainkan awal baru untuk bangkit kembali",
    closingDescription: "ReWorkCare ingin menjadi pemandu yang paling andal dan hangat di jalan Anda kembali ke kehidupan sehari-hari. Jika Anda memiliki kesulitan, silakan bertanya kapan saja.",
  },
  ne: {
    heroBadge: "कामदार र परिवारका लागि एउटा कथा",
    heroTitle: "दुर्घटनाको त्यो कठिन समयमा, हामी प्रविधि भन्दा पहिले मनले नजिक हुनेछौं।",
    heroDescription: "अचानक भएका दुर्घटनाहरू, जटिल प्रक्रियाहरू, अपरिचित शब्दहरू... जब तपाईंले उपचारमा मात्र ध्यान केन्द्रित गर्नुपर्छ, त्यतिबेला महसुस हुने असहायता हामीलाई कसैलाई भन्दा बढी थाहा छ।",
    storyTitle: "हामीले ReWorkCare किन बनायौं?",
    storyP1: "मैले पनि औद्योगिक दुर्घटनाका कारण २ वर्षसम्म अस्पतालमा उपचार गराएको थिएँ। शारीरिक पीडाभन्दा पनि कठिन कुरा जानकारीको अभावले गर्दा हुने चिन्ता थियो: \"के मैले यो सही गरिरहेको छु?\", \"म अब के गरुँ?\"",
    storyP2: "मैले अस्पतालको लबीमा किओस्क अगाडि अन्योलमा परेका मध्यम उमेरका बिरामीहरू र थोरै कोरियाली भाषा बोल्ने र जटिल कागजातहरूको थुप्रो देखेर अलमलमा परेका विदेशी कामदारहरूलाई देखें। जानकारीको यो खाडल एउटा दुखद वास्तविकता थियो, जसले अन्ततः उपचार र स्वास्थ्य लाभमा खाडल निम्त्याउँथ्यो।",
    storyP3: "\"यदि सबैका लागि उनीहरूको सबैभन्दा कठिन क्षणमा समान सहायक हुन्थ्यो भने के हुन्थ्यो होला?\"",
    storyP4: "सौभाग्यवश, हामी एआई प्रविधि द्रुत रूपमा विकास भइरहेको युगमा बाँचिरहेका छौं। मैले विश्वास गरें कि गाह्रो कानुनी शब्दहरूलाई सजिलो शब्दमा व्याख्या गर्ने र मातृभाषामा सोध्दा पनि कोरियाली दुर्घटना जानकारी फेला पार्ने एआईले यो खाडल भर्न सक्छ। ReWorkCare कसरी सुरु भयो भन्ने कुरा यही हो।",
    solutionsTitle: "प्रविधि भन्दा स्वास्थ्य लाभको मूल्य बढी छ",
    solutionsDescription: "प्रविधि चिसो हुन्छ, तर हामी विश्वास गर्छौं कि यसलाई प्रयोग गर्ने उद्देश्य न्यानो हुनुपर्छ। ReWorkCare ले तपाईंको छेउमा बसेर चुपचाप मद्दत गर्नेछ।",
    solution1Title: "एआई दुर्घटना साझेदार",
    solution1Desc: "नयाँ कानुन र अदालती फैसला जस्ता विभिन्न कागजातहरू सिकेको एआई (RAG प्रविधि) ले तपाईंको प्रश्नहरूको २४/७ जवाफ दिनेछ।",
    solution2Title: "प्रमाणित अस्पतालहरू खोज्नुहोस्",
    solution2Desc: "'पुनर्स्थापना प्रमाणित चिकित्सा संस्था' डाटामा आधारित भएर, हामी तपाईंको नजिकैका भरपर्दो अस्पतालहरू नक्सामा तुरुन्तै फेला पार्नेछौं।",
    solution3Title: "सुरक्षित तलब क्याल्कुलेटर",
    solution3Desc: "तपाईंले जटिल सूत्रहरू जान्नु पर्दैन। केवल आफ्नो औसत तलब प्रविष्ट गर्नुहोस् र हामी तपाईंको अपेक्षित बिदा भत्ता गणना गर्नेछौं।",
    solution4Title: "चरण-दर-चरण व्यक्तिगत गाइड",
    solution4Desc: "आवेदनदेखि स्वास्थ्य लाभ र काममा फिर्ता हुनेसम्म। तपाईं अहिले कुन चरणमा हुनुहुन्छ र अब के तयारी गर्ने भन्ने स्पष्ट रोडम्याप हामी देखाउनेछौं।",
    aiBadge: "Google Gemini र RAG द्वारा संचालित",
    aiTitle: "एआई तपाईंको समर्पित प्रबन्धक बन्नेछ",
    aiDescription: "ReWorkCare एआई केवल एउटा च्याटबोट मात्र होइन जसले तयार पारिएका जवाफहरू दिन्छ। यसले तपाईंको अवस्था बुझ्दछ र विभिन्न दुर्घटना जानकारी र कानुनी जानकारीलाई वास्तविक समयमा विश्लेषण गरेर सबैभन्दा सही गाइड प्रदान गर्दछ।",
    aiFeat1Title: "जटिल कागजात विश्लेषण",
    aiFeat1Desc: "गाह्रो कानुनी शब्दहरूलाई सजिलो भाषामा अनुवाद गर्दछ",
    aiFeat2Title: "सटीक सूचना खोज",
    aiFeat2Desc: "RAG प्रविधिले गलत जानकारीको जोखिम कम गर्दछ",
    aiFeat3Title: "कागजात लेखन सहयोग",
    aiFeat3Desc: "फारम भर्नेदेखि पेश गर्ने सम्मको पूर्ण गाइड",
    techStackTitle: "प्रयोग गरिएका मुख्य प्रविधिहरू",
    techNextDesc: "React मा आधारित full-stack framework",
    techSupaDesc: "PostgreSQL डाटाबेस र backend",
    techGeminiDesc: "एआईमा आधारित कागजात गाइड निर्माण",
    techRagDesc: "Supabase Vector मा आधारित एआई परामर्श",
    techMapDesc: "स्थानमा आधारित अस्पताल जानकारीको चित्रण",
    techAuthDesc: "प्रयोगकर्ता प्रमाणीकरण र व्यवस्थापन",
    closingTitle: "दुर्घटना अन्त्य होइन, तर फेरि उठ्ने नयाँ सुरुवात हो",
    closingDescription: "ReWorkCare तपाईंको दैनिक जीवनमा फिर्ता हुने बाटोमा सबैभन्दा भरपर्दो र न्यानो मार्गदर्शक बन्न चाहन्छ। यदि तपाईंलाई कुनै कठिनाइ भएमा, कुनै पनि समयमा सोध्न सक्नुहुन्छ।",
  },
  hi: {
    heroBadge: "श्रमिकों और परिवारों के लिए एक कहानी",
    heroTitle: "दुर्घटना के उस कठिन समय में, हम तकनीक से पहले दिल से करीब होंगे।",
    heroDescription: "अचानक हुई दुर्घटनाएं, जटिल प्रक्रियाएं, अपरिचित शब्द... जब आपको केवल इलाज पर ध्यान केंद्रित करना चाहिए, उस समय महसूस होने वाली बेबसी हमें किसी से भी बेहतर पता है।",
    storyTitle: "हमने ReWorkCare क्यों बनाया?",
    storyP1: "मैंने भी औद्योगिक दुर्घटना के कारण 2 साल तक अस्पताल में इलाज कराया था। शारीरिक दर्द से भी कठिन बात जानकारी की कमी के कारण होने वाली चिंता थी: \"क्या मैं यह सही कर रहा हूँ?\", \"मुझे आगे क्या करना चाहिए?\"",
    storyP2: "मैंने अस्पताल के लॉबी में कियोस्क के सामने उलझन में पड़े मध्यम आयु वर्ग के मरीजों और कम कोरियाई बोलने वाले और जटिल दस्तावेजों के ढेर को देखकर परेशान विदेशी श्रमिकों को देखा। जानकारी की यह खाई एक दुखद वास्तविकता थी, जो अंततः इलाज और स्वास्थ्य लाभ में अंतर पैदा करती थी।",
    storyP3: "\"क्या होगा यदि सभी के लिए उनके सबसे कठिन क्षण में एक समान सहायक होता?\"",
    storyP4: "सौभाग्य से, हम एआई तकनीक के तेजी से विकसित होने वाले युग में रह रहे हैं। मेरा मानना था कि एक एआई जो कठिन कानूनी शब्दों को आसान शब्दों में समझाता है और मातृभाषा में पूछने पर भी कोरियाई दुर्घटना जानकारी पाता है, इस खाई को भर सकता है। ReWorkCare कैसे शुरू हुआ, यह इसके बारे में है।",
    solutionsTitle: "तकनीक से अधिक स्वास्थ्य लाभ का मूल्य है",
    solutionsDescription: "तकनीक ठंडी होती है, लेकिन हमारा मानना है कि इसका उपयोग करने का उद्देश्य गर्म होना चाहिए। ReWorkCare आपके पास बैठकर चुपचाप मदद करेगा।",
    solution1Title: "एआई दुर्घटना साझेदार",
    solution1Desc: "नए कानून और अदालती फैसलों जैसे विभिन्न दस्तावेजों को सीखा हुआ एआई (RAG तकनीक) आपके सवालों का 24/7 जवाब देगा।",
    solution2Title: "प्रमाणित अस्पताल खोजें",
    solution2Desc: "'पुनर्वास प्रमाणित चिकित्सा संस्थान' डेटा के आधार पर, हम आपके पास के भरोसेमंद अस्पतालों को मानचित्र पर तुरंत ढूंढ पाएंगे।",
    solution3Title: "सुरक्षित वेतन कैलकुलेटर",
    solution3Desc: "आपको जटिल सूत्रों को जानने की आवश्यकता नहीं है। बस अपना औसत वेतन दर्ज करें और हम आपके अपेक्षित छुट्टी भत्ते की गणना करेंगे।",
    solution4Title: "चरण-दर-चरण व्यक्तिगत गाइड",
    solution4Desc: "आवेदन से लेकर स्वास्थ्य लाभ और काम पर लौटने तक। हम एक स्पष्ट रोडमैप दिखाएंगे कि आप अभी कहां हैं और आगे क्या तैयारी करनी है।",
    aiBadge: "Google Gemini और RAG द्वारा संचालित",
    aiTitle: "एआई आपका समर्पित प्रबंधक बन जाएगा",
    aiDescription: "ReWorkCare एआई केवल एक चैटबॉट नहीं है जो तैयार जवाब देता है। यह आपकी स्थिति को समझता है और विभिन्न दुर्घटना और कानूनी जानकारी का वास्तविक समय में विश्लेषण करके सबसे सटीक गाइड प्रदान करता है।",
    aiFeat1Title: "जटिल दस्तावेज विश्लेषण",
    aiFeat1Desc: "कठिन कानूनी शब्दों का आसान भाषा में अनुवाद करता है",
    aiFeat2Title: "सटीक सूचना खोज",
    aiFeat2Desc: "RAG तकनीक गलत जानकारी के जोखिम को कम करती है",
    aiFeat3Title: "दस्तावेज लेखन सहायता",
    aiFeat3Desc: "फॉर्म भरने से लेकर जमा करने तक का पूर्ण गाइड",
    techStackTitle: "उपयोग की गई मुख्य प्रौद्योगिकियां",
    techNextDesc: "React पर आधारित full-stack framework",
    techSupaDesc: "PostgreSQL डेटाबेस और backend",
    techGeminiDesc: "एआई पर आधारित दस्तावेज गाइड निर्माण",
    techRagDesc: "Supabase Vector पर आधारित एआई परामर्श",
    techMapDesc: "स्थान आधारित अस्पताल जानकारी का चित्रण",
    techAuthDesc: "उपयोगकर्ता प्रमाणीकरण और प्रबंधन",
    closingTitle: "दुर्घटना अंत नहीं है, बल्कि फिर से खड़े होने की एक नई शुरुआत है",
    closingDescription: "ReWorkCare आपके दैनिक जीवन में लौटने के रास्ते में सबसे विश्वसनीय और गर्म मार्गदर्शक बनना चाहता है। यदि आपको कोई कठिनाई हो, तो किसी भी समय पूछ सकते हैं।",
  },
};

export const timelineTranslations: Record<Locale, TimelineTranslation> = {
  ko: {
    heroTitle: "산재 처리 과정, 한눈에 확인하세요",
    heroDescription: "신청부터 복귀까지, 전체 흐름을 안내해 드립니다.",
    videoBtn: "전체 과정 영상 보기",
    videoTitle: "산재 보상 완벽 가이드",
    firstVisitTitle: "처음이신가요?",
    firstVisitDesc: "아래 단계를 순서대로 확인해보세요. 각 단계에서 해야 할 일, 필요한 서류, 주의사항을 확인할 수 있습니다.",
    videoTip: "💡 팁: YouTube에서 자막, 재생 속도 조절 등 다양한 기능을 사용할 수 있습니다.",
    aiVideoNotice: "※ 본 영상은 AI 기술을 활용하여 제작되었습니다.",
    aiDocNotice: "※ 본 문서는 AI 기술을 활용하여 작성되었습니다.",
    docDetailTip: "💡 이 서류에 대해 더 자세히 알고 싶으신가요?",
    docDetailBtn: "{step}단계 서류 안내 자세히 보기",
    legalTitle: "※ 법적 고지",
    legalNotice: "본 페이지는 일반적인 산재 절차 안내를 목적으로 하며, 실제 적용 여부는 근로복지공단의 판단과 개별 사안에 따라 달라질 수 있습니다. 본 정보는 법적 효력을 갖지 않습니다.",
    prevStep: "이전 단계",
    nextStep: "다음 단계 보기",
    nextCondition: "다음 단계",
    guideTitle: "이렇게 진행하시면 됩니다",
    tabs: {
      guide: "설명 보기",
      actions: "해야 할 일",
      documents: "서류",
      warnings: "주의사항",
    },
    stages: {
      1: {
        title: "산재 신청 이렇게 하세요",
        description: "다쳤을 때 가장 먼저 해야 할 일! 산재 신청부터 승인까지 전 과정을 안내합니다.",
        videoUrlTitle: "산재 신청 과정을 영상으로 확인하세요",
        videoDesc: "가이드 영상",
      },
      2: {
        title: "치료와 생활비 받으세요",
        description: "병원비는 어떻게 내나요? 일 못 하는 동안 생활비(휴업급여)는 어떻게 받나요?",
        videoUrlTitle: "병원에서 치료받고 급여 받는 과정을 영상으로 확인하세요",
        videoDesc: "가이드 영상",
      },
      3: {
        title: "후유증 보상금 받으세요",
        description: "치료 끝났는데 몸이 예전 같지 않다면? 후유증 보상금(장해급여) 받는 방법을 알려드립니다.",
        videoUrlTitle: "치료 끝나고 장해 등급 받는 과정을 영상으로 확인하세요",
        videoDesc: "가이드 영상",
      },
      4: {
        title: "직장 복귀 또는 재취업 지원 받기",
        description: "다시 일하고 싶은데 어떻게 해야 하나요? 직업훈련 지원부터 재취업까지 도와드립니다.",
        videoUrlTitle: "직장 복귀하거나 재취업하는 과정을 영상으로 확인하세요",
        videoDesc: "가이드 영상",
      },
    },
    status: {
      inProgress: "진행중",
      actions: "할일",
      documents: "서류",
      required: "필수",
      emptyActions: "해야 할 일이 없습니다.",
      emptyDocuments: "필수 서류가 없습니다.",
      emptyWarnings: "주의사항이 없습니다.",
    },
    dictionary: {},
  },
  en: {
    heroTitle: "Industrial Accident Process, Check at a Glance",
    heroDescription: "We will guide you through the entire flow from application to return.",
    videoBtn: "View Process Video",
    videoTitle: "Complete Guide to Accident Compensation",
    firstVisitTitle: "First time here?",
    firstVisitDesc: "Check the steps below in order. You can check tasks, required documents, and warnings for each step.",
    videoTip: "💡 Tip: You can use various functions like subtitles and playback speed control on YouTube.",
    aiVideoNotice: "※ This video was produced using AI technology.",
    aiDocNotice: "※ This document was produced using AI technology.",
    docDetailTip: "💡 Want to know more about this document?",
    docDetailBtn: "View Step {step} Document Details",
    legalTitle: "※ Legal Notice",
    legalNotice: "This page is for general information on industrial accident procedures. Actual application may vary. This information has no legal effect.",
    prevStep: "Previous Step",
    nextStep: "View Next Step",
    nextCondition: "Next Step",
    guideTitle: "How to proceed",
    tabs: {
      guide: "View Guide",
      actions: "To-do",
      documents: "Documents",
      warnings: "Warnings",
    },
    stages: {
      1: {
        title: "Apply for Accident Benefit",
        description: "The first thing to do when injured! Guidance on the entire process from application to approval.",
        videoUrlTitle: "Watch the accident application process in video",
        videoDesc: "Guide Video",
      },
      2: {
        title: "Get Treatment and Living Expenses",
        description: "How do I pay medical bills? How do I get living expenses (temporary disability benefit) while unable to work?",
        videoUrlTitle: "Watch the process of getting treatment and benefits in video",
        videoDesc: "Guide Video",
      },
      3: {
        title: "Get Disability Compensation",
        description: "What if your body is not the same after treatment? We show you how to receive disability benefits.",
        videoUrlTitle: "Watch the process of getting a disability grade in video",
        videoDesc: "Guide Video",
      },
      4: {
        title: "Return to Work or Re-employment",
        description: "Want to work again? We help from vocational training support to re-employment.",
        videoUrlTitle: "Watch the process of returning to work or re-employment in video",
        videoDesc: "Guide Video",
      },
    },
    status: {
      inProgress: "In Progress",
      actions: "Tasks",
      documents: "Docs",
      required: "Required",
      emptyActions: "No tasks to do.",
      emptyDocuments: "No required documents.",
      emptyWarnings: "No warnings.",
    },
    dictionary: {},
  },
  zh: {
    heroTitle: "工伤处理流程，一目了然",
    heroDescription: "我们为您提供从申请到回归的全程指南。",
    videoBtn: "观看全过程视频",
    videoTitle: "工伤补偿完美指南",
    firstVisitTitle: "第一次来吗？",
    firstVisitDesc: "请按顺序查看下面的步骤。您可以查看每个阶段的待办事项、所需文件和注意事项。",
    videoTip: "💡 提示：您可以在 YouTube 上使用字幕、播放速度调节等多种功能。",
    aiVideoNotice: "※ 本视频是利用 AI 技术制作的。",
    aiDocNotice: "※ 本文档是利用 AI 技术编写的。",
    docDetailTip: "💡 想了解更多关于此文档的信息吗？",
    docDetailBtn: "查看第 {step} 步文件详情",
    legalTitle: "※ 法律告示",
    legalNotice: "本页面旨在提供一般的工伤程序指南，实际适用情况可能因勤劳福祉公团的判断和具体情况而异。本信息不具有法律效力。",
    prevStep: "上一步",
    nextStep: "查看下一步",
    nextCondition: "下一步",
    guideTitle: "您可以这样进行",
    tabs: {
      guide: "查看说明",
      actions: "待办事项",
      documents: "文件",
      warnings: "注意事项",
    },
    stages: {
      1: {
        title: "工伤申请指南",
        description: "受伤时最先要做的事！指引从申请到批准的全过程。",
        videoUrlTitle: "通过视频查看工伤申请过程",
        videoDesc: "指南视频",
      },
      2: {
        title: "领取治疗费和生活费",
        description: "医院费用怎么付？不能工作期间的生活费（休业补偿）怎么领？",
        videoUrlTitle: "通过视频查看在医院接受治疗和领取补偿的过程",
        videoDesc: "指南视频",
      },
      3: {
        title: "领取后遗症补偿金",
        description: "治疗结束但身体不如从前？告诉您领取后遗症补偿（伤残津贴）的方法。",
        videoUrlTitle: "通过视频查看治疗结束后获得伤残等级的过程",
        videoDesc: "指南视频",
      },
      4: {
        title: "返回职场或支持再就业",
        description: "想重新工作该怎么办？提供从职业培训支持到再就业的帮助。",
        videoUrlTitle: "通过视频查看返回职场或再就业的过程",
        videoDesc: "指南视频",
      },
    },
    status: {
      inProgress: "进行中",
      actions: "待办",
      documents: "文件",
      required: "必填",
      emptyActions: "没有待办事项。",
      emptyDocuments: "没有必备文件。",
      emptyWarnings: "没有注意事项。",
    },
    dictionary: {},
  },
  vi: {
    heroTitle: "Quy trình xử lý tai nạn lao động, kiểm tra trong nháy mắt",
    heroDescription: "Chúng tôi hướng dẫn bạn toàn bộ quy trình từ khâu đăng ký đến khi quay lại làm việc.",
    videoBtn: "Xem video toàn bộ quy trình",
    videoTitle: "Cẩm nang hoàn hảo về bồi thường tai nạn lao động",
    firstVisitTitle: "Lần đầu tiên?",
    firstVisitDesc: "Hãy kiểm tra các bước dưới đây theo thứ tự. Bạn có thể kiểm tra việc cần làm, giấy tờ cần thiết và lưu ý cho từng bước.",
    videoTip: "💡 Mẹo: Bạn có thể sử dụng các tính năng khác nhau như phụ đề, điều chỉnh tốc độ phát trên YouTube.",
    aiVideoNotice: "※ Video này được sản xuất bằng công nghệ AI.",
    aiDocNotice: "※ Tài liệu này được viết bằng công nghệ AI.",
    docDetailTip: "💡 Bạn muốn biết thêm chi tiết về tài liệu này?",
    docDetailBtn: "Xem chi tiết tài liệu bước {step}",
    legalTitle: "※ Thông báo pháp lý",
    legalNotice: "Trang này nhằm mục đích hướng dẫn quy trình tai nạn lao động chung, việc áp dụng thực tế có thể thay đổi tùy theo quyết định của COMWEL và từng trường hợp cụ thể. Thông tin này không có giá trị pháp lý.",
    prevStep: "Bước trước",
    nextStep: "Xem bước tiếp theo",
    nextCondition: "Bước tiếp theo",
    guideTitle: "Bạn có thể tiến hành như sau",
    tabs: {
      guide: "Xem giải thích",
      actions: "Việc cần làm",
      documents: "Giấy tờ",
      warnings: "Lưu ý",
    },
    stages: {
      1: {
        title: "Cách đăng ký tai nạn lao động",
        description: "Việc đầu tiên cần làm khi bị thương! Hướng dẫn toàn bộ quy trình từ đăng ký đến phê duyệt.",
        videoUrlTitle: "Xem quy trình đăng ký tai nạn lao động qua video",
        videoDesc: "Video hướng dẫn",
      },
      2: {
        title: "Nhận chi phí điều trị và sinh hoạt",
        description: "Thanh toán viện phí như thế nào? Nhận trợ cấp sinh hoạt (trợ cấp nghỉ việc) trong thời gian không thể làm việc như thế nào?",
        videoUrlTitle: "Xem quy trình điều trị tại bệnh viện và nhận trợ cấp qua video",
        videoDesc: "Video hướng dẫn",
      },
      3: {
        title: "Nhận bồi thường di chứng",
        description: "Điều trị xong nhưng cơ thể không còn như trước? Chúng tôi hướng dẫn bạn cách nhận trợ cấp di chứng (trợ cấp thương tật).",
        videoUrlTitle: "Xem quy trình nhận xếp hạng thương tật sau khi kết thúc điều trị qua video",
        videoDesc: "Video hướng dẫn",
      },
      4: {
        title: "Quay lại làm việc hoặc hỗ trợ tái việc làm",
        description: "Muốn đi làm lại thì phải làm sao? Hỗ trợ từ đào tạo nghề đến tái việc làm.",
        videoUrlTitle: "Xem quy trình quay lại làm việc hoặc tái việc làm qua video",
        videoDesc: "Video hướng dẫn",
      },
    },
    status: {
      inProgress: "Đang tiến hành",
      actions: "Việc cần làm",
      documents: "Giấy tờ",
      required: "Bắt buộc",
      emptyActions: "Không có việc gì cần làm.",
      emptyDocuments: "Không có giấy tờ bắt buộc.",
      emptyWarnings: "Không có lưu ý nào.",
    },
    dictionary: {},
  },
  th: {
    heroTitle: "ตรวจสอบขั้นตอนการจัดการอุบัติเหตุจากการทำงานได้ในพริบตา",
    heroDescription: "เราจะแนะนำคุณตลอดเส้นทางตั้งแต่การสมัครไปจนถึงการกลับเข้าทำงาน",
    videoBtn: "ชมวิดีโอขั้นตอนทั้งหมด",
    videoTitle: "คู่มือฉบับสมบูรณ์เพื่อการชดเชยอุบัติเหตุจากการทำงาน",
    firstVisitTitle: "มาครั้งแรกใช่ไหม?",
    firstVisitDesc: "โปรดตรวจสอบขั้นตอนด้านล่างตามลำดับ คุณสามารถตรวจสอบสิ่งที่ต้องทำ เอกสารที่จำเป็น และข้อควรระวังในแต่ละขั้นตอน",
    videoTip: "💡 เคล็ดลับ: คุณสามารถใช้งานฟีเจอร์ต่างๆ เช่น คำบรรยาย การปรับความเร็วในการเล่นบน YouTube ได้",
    aiVideoNotice: "※ วิดีโอนี้สร้างขึ้นโดยใช้เทคโนโลยี AI",
    aiDocNotice: "※ เอกสารนี้เขียนขึ้นโดยใช้เทคโนโลยี AI",
    docDetailTip: "💡 ต้องการทราบข้อมูลเพิ่มเติมเกี่ยวกับเอกสารนี้หรือไม่?",
    docDetailBtn: "ดูรายละเอียดเอกสารขั้นตอนที่ {step}",
    legalTitle: "※ ประกาศทางกฎหมาย",
    legalNotice: "หน้านี้จัดทำขึ้นเพื่อแนะนำขั้นตอนอุบัติเหตุจากการทำงานทั่วไป การนำไปใช้จริงอาจแตกต่างกันไปตามดุลยพินิจของ COMWEL และกรณีส่วนบุคคล ข้อมูลนี้ไม่มีผลทางกฎหมาย",
    prevStep: "ขั้นตอนก่อนหน้า",
    nextStep: "ดูขั้นตอนถัดไป",
    nextCondition: "ขั้นตอนถัดไป",
    guideTitle: "คุณสามารถดำเนินการได้ดังนี้",
    tabs: {
      guide: "ดูคำอธิบาย",
      actions: "สิ่งที่ต้องทำ",
      documents: "เอกสาร",
      warnings: "ข้อควรระวัง",
    },
    stages: {
      1: {
        title: "วิธีการสมัครอุบัติเหตุจากการทำงาน",
        description: "สิ่งแรกที่ต้องทำเมื่อได้รับบาดเจ็บ! แนะนำขั้นตอนทั้งหมดตั้งแต่การสมัครจนถึงการอนุมัติ",
        videoUrlTitle: "ชมวิดีโอขั้นตอนการสมัครอุบัติเหตุจากการทำงาน",
        videoDesc: "วิดีโอแนะนำ",
      },
      2: {
        title: "รับค่ารักษาพยาบาลและค่าครองชีพ",
        description: "จ่ายค่าโรงพยาบาลอย่างไร? จะได้รับค่าครองชีพ (เงินทดแทนการหยุดงาน) ในช่วงที่ทำงานไม่ได้ได้อย่างไร?",
        videoUrlTitle: "ชมวิดีโอขั้นตอนการรับการรักษาที่โรงพยาบาลและการรับเงินทดแทน",
        videoDesc: "วิดีโอแนะนำ",
      },
      3: {
        title: "รับค่าชดเชยผลกระทบหลังการรักษา",
        description: "รักษาเสร็จแล้วแต่ร่างกายไม่เหมือนเดิม? แนะนำวิธีรับค่าชดเชยผลกระทบ (เงินทดแทนกรณีทุพพลภาพ)",
        videoUrlTitle: "ชมวิดีโอขั้นตอนการรับระดับความทุพพลภาพหลังจากสิ้นสุดการรักษา",
        videoDesc: "วิดีโอแนะนำ",
      },
      4: {
        title: "กลับเข้าทำงานหรือสนับสนุนการจ้างงานใหม่",
        description: "อยากกลับไปทำงานต้องทำอย่างไร? ช่วยเหลือตั้งแต่การสนับสนุนการฝึกอาชีพไปจนถึงการจ้างงานใหม่",
        videoUrlTitle: "ชมวิดีโอขั้นตอนการกลับเข้าทำงานหรือการจ้างงานใหม่",
        videoDesc: "วิดีโอแนะนำ",
      },
    },
    status: {
      inProgress: "กำลังดำเนินการ",
      actions: "งานที่ต้องทำ",
      documents: "เอกสาร",
      required: "จำเป็น",
      emptyActions: "ไม่มีสิ่งที่ต้องทำ",
      emptyDocuments: "ไม่มีเอกสารที่จำเป็น",
      emptyWarnings: "ไม่มีข้อควรระวัง",
    },
    dictionary: {},
  },
  uz: {
    heroTitle: "Mehnat jarohatini rasmiylashtirish jarayoni bilan tanishing",
    heroDescription: "Arizadan to ishga qaytgunga qadar bo’lgan barcha bosqichlarni ko’rsatib beramiz.",
    videoBtn: "Butun jarayon videosini ko’rish",
    videoTitle: "Mehnat jarohati kompensatsiyasi bo’yicha to’liq qo’llanma",
    firstVisitTitle: "Birinchi marta keldingizmi?",
    firstVisitDesc: "Quyidagi bosqichlarni tartib bilan tekshiring. Har bir bosqich uchun vazifalar, zarur hujjatlar va eslatmalarni tekshirishingiz mumkin.",
    videoTip: "💡 Maslahat: YouTube’da subtitrlar, ijro tezligini sozlash kabi turli funksiyalardan foydalanishingiz mumkin.",
    aiVideoNotice: "※ Ushbu video AI texnologiyasi yordamida yaratilgan.",
    aiDocNotice: "※ Ushbu hujjat AI texnologiyasi yordamida yozilgan.",
    docDetailTip: "💡 Ushbu hujjat haqida ko'proq bilmoqchimisiz?",
    docDetailBtn: "{step}-bosqich hujjat tafsilotlarini ko'rish",
    legalTitle: "※ Huquqiy eslatma",
    legalNotice: "Ushbu sahifa mehnat jarohati bo’yicha umumiy ma’lumot berish maqsadida yaratilgan bo’lib, amaldagi holat COMWEL qaroriga va individual vaziyatga qarab o’zgarishi mumkin. Ushbu ma’lumot huquqiy kuchga ega emas.",
    prevStep: "Oldingi bosqich",
    nextStep: "Keyingi bosqichni ko’rish",
    nextCondition: "Keyingi bosqich",
    guideTitle: "Quyidagicha yo’l tutishingiz mumkin",
    tabs: {
      guide: "Tushuntirishni ko’rish",
      actions: "Qilinadigan ishlar",
      documents: "Hujjatlar",
      warnings: "Eslatmalar",
    },
    stages: {
      1: {
        title: "Mehnat jarohatiga qanday ariza topshiriladi?",
        description: "Jarohatlanganda qilinadigan birinchi ish! Arizadan to tasdiqlangunga qadar bo’lgan butun jarayon haqida ma’lumot.",
        videoUrlTitle: "Mehnat jarohatiga ariza topshirish jarayonini videoda ko’ring",
        videoDesc: "Yo’riqnoma videosi",
      },
      2: {
        title: "Davolanish va yashash harajatlarini oling",
        description: "Kasalxona xarajatlari qanday to’lanadi? Ishlay olmaydigan vaqt uchun yashash xarajatlarini (ishlamaganlik nafaqasi) qanday olish mumkin?",
        videoUrlTitle: "Kasalxonada davolanish va nafaqa olish jarayonini videoda ko’ring",
        videoDesc: "Yo’riqnoma videosi",
      },
      3: {
        title: "Jarohat asoratlari uchun kompensatsiya oling",
        description: "Davolanish tugadi, lekin tana avvalgidek emasmi? Jarohat asoratlari uchun kompensatsiya (nogironlik nafaqasi) olish usullarini o’rgatamiz.",
        videoUrlTitle: "Davolanishdan so’ng nogironlik darajasini olish jarayonini videoda ko’ring",
        videoDesc: "Yo’riqnoma videosi",
      },
      4: {
        title: "Ishga qaytish yoki qayta ishga joylashish",
        description: "Yana ishlashni xohlaysizmi? Kasbga o’rgatishdan tortib qayta ishga joylashishshacha yordam beramiz.",
        videoUrlTitle: "Ishga qaytish yoki qayta ishga joylashish jarayonini videoda ko’ring",
        videoDesc: "Yo’riqnoma videosi",
      },
    },
    status: {
      inProgress: "Jarayonda",
      actions: "Vazifalar",
      documents: "Hujjatlar",
      required: "Majburiy",
      emptyActions: "Qilinadigan ishlar yo’q.",
      emptyDocuments: "Zarur hujjatlar yo’q.",
      emptyWarnings: "Eslatmalar yo’q.",
    },
    dictionary: {},
  },
  mn: {
    heroTitle: "Үйлдвэрлэлийн ослын процессыг нэг дороос шалгаарай",
    heroDescription: "Өргөдөл гаргахаас эхлээд ажилдаа орох хүртэлх бүх үйл явцыг зааж өгөх болно.",
    videoBtn: "Бүх үйл явцын видеог үзэх",
    videoTitle: "Үйлдвэрлэлийн ослын нөхөн олговрын бүрэн гарын авлага",
    firstVisitTitle: "Анх удаа ирж байна уу?",
    firstVisitDesc: "Доорх алхмуудыг дарааллаар нь шалгана уу. Та шат бүрт хийх ажил, шаардлагатай бичиг баримт, анхаарах зүйлсийг шалгаж болно.",
    videoTip: "💡 Зөвлөмж: Та YouTube дээр хадмал орчуулга, тоглуулах хурдны тохируулга зэрэг олон функцийг ашиглах боломжтой.",
    aiVideoNotice: "※ Энэхүү видеог хиймэл оюун ухааны технологи ашиглан бүтээсэн.",
    aiDocNotice: "※ Энэхүү баримт бичгийг хиймэл оюун ухааны технологи ашиглан бичсэн.",
    docDetailTip: "💡 Энэ баримт бичгийн талаар дэлгэрэнгүй мэдэхийг хүсч байна уу?",
    docDetailBtn: "{step}-р шатны баримт бичгийн дэлгэрэнгүйг үзэх",
    legalTitle: "※ Хууль эрх зүйн мэдэгдэл",
    legalNotice: "Энэхүү хуудас нь үйлдвэрлэлийн ослын ерөнхий зааварчилгаа бөгөөд бодит хэрэглээ нь COMWEL-ийн шийдвэр болон хувь хүний нөхцөл байдлаас шалтгаалж өөр байж болно. Энэхүү мэдээлэл нь хууль эрх зүйн хүчингүй болно.",
    prevStep: "Өмнөх алхам",
    nextStep: "Дараагийн шатыг үзэх",
    nextCondition: "Дараагийн шат",
    guideTitle: "Та дараах байдлаар үргэлжлүүлж болно",
    tabs: {
      guide: "Тайлбар үзэх",
      actions: "Хийх ажил",
      documents: "Бичиг баримт",
      warnings: "Анхаарах зүйл",
    },
    stages: {
      1: {
        title: "Үйлдвэрлэлийн ослын өргөдөл хэрхэн гаргах вэ",
        description: "Гэмтсэн үед хамгийн түрүүнд хийх ажил! Өргөдөл гаргахаас эхлээд батлагдах хүртэлх бүх процессыг заана.",
        videoUrlTitle: "Үйлдвэрлэлийн ослын өргөдөл гаргах үйл явцыг видеоноос үзнэ үү",
        videoDesc: "Зааварчилгаа видео",
      },
      2: {
        title: "Эмчилгээ болон амьжиргааны зардлаа аваарай",
        description: "Эмнэлгийн төлбөрийг хэрхэн төлөх вэ? Ажил хийж чадахгүй байх хугацааны амьжиргааны зардлыг (ажлаас чөлөөлөгдсөний тэтгэмж) хэрхэн авах вэ?",
        videoUrlTitle: "Эмнэлэгт эмчлүүлж, тэтгэмж авах үйл явцыг видеоноос үзнэ үү",
        videoDesc: "Зааварчилгаа видео",
      },
      3: {
        title: "Ослын дараах үр дагаврын нөхөн олговор аваарай",
        description: "Эмчилгээ дууссан ч бие тань өмнөх шигээ болохгүй байна уу? Үлдэх үр дагаврын нөхөн олговор (хөдөлмөрийн чадвар алдалтын тэтгэмж) авах аргыг зааж өгнө.",
        videoUrlTitle: "Эмчилгээ дууссаны дараа хөдөлмөрийн чадвар алдалтын зэрэглэл тогтоох үйл явцыг видеоноос үзнэ үү",
        videoDesc: "Зааварчилгаа видео",
      },
      4: {
        title: "Ажилдаа эргэн орох эсвэл дахин ажилд ороход дэмжлэг авах",
        description: "Дахин ажиллахыг хүсэж байвал яах вэ? Мэргэжлийн сургалтаас эхлээд дахин ажилд орох хүртэл тусламж үзүүлнэ.",
        videoUrlTitle: "Ажилдаа эргэн орох эсвэл дахин ажилд орох үйл явцыг видеоноос үзнэ үү",
        videoDesc: "Зааварчилгаа видео",
      },
    },
    status: {
      inProgress: "Явц дунд",
      actions: "Хийх ажил",
      documents: "Бичиг баримт",
      required: "Заавал",
      emptyActions: "Хийх ажил байхгүй байна.",
      emptyDocuments: "Зайлшгүй шаардлагатай бичиг баримт байхгүй байна.",
      emptyWarnings: "Анхаарах зүйл байхгүй байна.",
    },
    dictionary: {},
  },
  id: {
    heroTitle: "Proses Penanganan Kecelakaan Kerja, Cek Sekilas",
    heroDescription: "Kami akan memandu Anda melalui seluruh alur dari pendaftaran hingga kembali bekerja.",
    videoBtn: "Lihat Video Seluruh Proses",
    videoTitle: "Panduan Lengkap Kompensasi Kecelakaan Kerja",
    firstVisitTitle: "Baru pertama kali?",
    firstVisitDesc: "Silakan periksa langkah-langkah di bawah ini secara berurutan. Anda dapat memeriksa tugas, dokumen yang diperlukan, dan peringatan untuk setiap langkah.",
    videoTip: "💡 Tip: Anda dapat menggunakan berbagai fitur seperti subtitle, penyesuaian kecepatan pemutaran di YouTube.",
    aiVideoNotice: "※ Video ini diproduksi menggunakan teknologi AI.",
    aiDocNotice: "※ Dokumen ini ditulis menggunakan teknologi AI.",
    docDetailTip: "💡 Ingin tahu lebih banyak tentang dokumen ini?",
    docDetailBtn: "Lihat Detail Dokumen Langkah {step}",
    legalTitle: "※ Pemberitahuan Hukum",
    legalNotice: "Halaman ini ditujukan untuk panduan prosedur kecelakaan kerja umum, aplikasi aktual dapat bervariasi tergantung pada keputusan COMWEL dan kasus masing-masing. Informasi ini tidak memiliki efek hukum.",
    prevStep: "Langkah Sebelumnya",
    nextStep: "Lihat Langkah Berikutnya",
    nextCondition: "Langkah Berikutnya",
    guideTitle: "Anda dapat melanjutkan sebagai berikut",
    tabs: {
      guide: "Lihat Penjelasan",
      actions: "Hal yang Harus Dilakukan",
      documents: "Dokumen",
      warnings: "Peringatan",
    },
    stages: {
      1: {
        title: "Cara Mendaftar Kecelakaan Kerja",
        description: "Hal pertama yang harus dilakukan saat terluka! Panduan seluruh proses dari pendaftaran hingga persetujuan.",
        videoUrlTitle: "Lihat proses pendaftaran kecelakaan kerja melalui video",
        videoDesc: "Video Panduan",
      },
      2: {
        title: "Dapatkan Biaya Pengobatan dan Hidup",
        description: "Bagaimana cara membayar biaya rumah sakit? Bagaimana cara mendapatkan biaya hidup (tunjangan cuti sakit) selama tidak bisa bekerja?",
        videoUrlTitle: "Lihat proses pengobatan di rumah sakit dan penerimaan tunjangan melalui video",
        videoDesc: "Video Panduan",
      },
      3: {
        title: "Dapatkan Kompensasi Efek Samping",
        description: "Pengobatan selesai tapi tubuh tidak seperti dulu lagi? Kami memberi tahu Anda cara menerima kompensasi efek samping (tunjangan cacat).",
        videoUrlTitle: "Lihat proses mendapatkan tingkat cacat setelah pengobatan selesai melalui video",
        videoDesc: "Video Panduan",
      },
      4: {
        title: "Kembali Bekerja atau Dukungan Pekerjaan Kembali",
        description: "Ingin bekerja lagi tapi tidak tahu caranya? Bantuan dari dukungan pelatihan kejuruan hingga pekerjaan kembali.",
        videoUrlTitle: "Lihat proses kembali bekerja atau pekerjaan kembali melalui video",
        videoDesc: "Video Panduan",
      },
    },
    status: {
      inProgress: "Sedang Berlangsung",
      actions: "Tugas",
      documents: "Dokumen",
      required: "Wajib",
      emptyActions: "Tidak ada hal yang harus dilakukan.",
      emptyDocuments: "Tidak ada dokumen wajib.",
      emptyWarnings: "Tidak ada peringatan.",
    },
    dictionary: {},
  },
  ne: {
    heroTitle: "औद्योगिक दुर्घटना प्रक्रिया, एकै नजरमा जाँच गर्नुहोस्",
    heroDescription: "हामी तपाईंलाई आवेदनदेखि फिर्तासम्मको सम्पूर्ण प्रक्रियामा मार्गदर्शन गर्नेछौं।",
    videoBtn: "सम्पूर्ण प्रक्रियाको भिडियो हेर्नुहोस्",
    videoTitle: "औद्योगिक दुर्घटना क्षतिपूर्तिको पूर्ण गाइड",
    firstVisitTitle: "पहिलो पटक हो?",
    firstVisitDesc: "कृपया तलका चरणहरू क्रमबद्ध रूपमा जाँच गर्नुहोस्। तपाईं प्रत्येक चरणका लागि कार्यहरू, आवश्यक कागजातहरू र चेतावनीहरू जाँच गर्न सक्नुहुन्छ।",
    videoTip: "💡 सुझाव: तपाईंले YouTube मा उपशीर्षक, प्लेब्याक गति नियन्त्रण जस्ता विभिन्न सुविधाहरू प्रयोग गर्न सक्नुहुन्छ।",
    aiVideoNotice: "※ यो भिडियो एआई प्रविधि प्रयोग गरेर निर्माण गरिएको हो।",
    aiDocNotice: "※ यो कागजात एआई प्रविधि प्रयोग गरेर लेखिएको हो।",
    docDetailTip: "💡 यो कागजात बारे थप जान्न चाहनुहुन्छ?",
    docDetailBtn: "{step} चरण कागजात विवरण हेर्नुहोस्",
    legalTitle: "※ कानुनी सूचना",
    legalNotice: "यो पृष्ठ सामान्य औद्योगिक दुर्घटना प्रक्रिया जानकारीको लागि हो, वास्तविक आवेदन COMWEL को निर्णय र व्यक्तिगत मामला अनुसार फरक हुन सक्छ। यो जानकारीको कुनै कानुनी प्रभाव हुँदैन।",
    prevStep: "अघिल्लो चरण",
    nextStep: "अर्को चरण हेर्नुहोस्",
    nextCondition: "अर्को चरण",
    guideTitle: "तपाईं यसरी अगाडि बढ्न सक्नुहुन्छ",
    tabs: {
      guide: "विवरण हेर्नुहोस्",
      actions: "गर्ने काम",
      documents: "कागजात",
      warnings: "चेतावनी",
    },
    stages: {
      1: {
        title: "औद्योगिक दुर्घटनाको लागि यसरी आवेदन दिनुहोस्",
        description: "चोट लाग्दा सबैभन्दा पहिले गर्ने काम! आवेदनदेखि स्वीकृतिसम्मको सम्पूर्ण प्रक्रियाको मार्गदर्शन।",
        videoUrlTitle: "भिडियोमा औद्योगिक दुर्घटना आवेदन प्रक्रिया हेर्नुहोस्",
        videoDesc: "गाइड भिडियो",
      },
      2: {
        title: "उपचार र जीवन निर्वाह खर्च प्राप्त गर्नुहोस्",
        description: "अस्पतालको बिल कसरी तिर्ने? काम गर्न नसक्दा जीवन निर्वाह खर्च (बिदा भत्ता) कसरी प्राप्त गर्ने?",
        videoUrlTitle: "भिडियोमा अस्पतालमा उपचार और भत्ता प्राप्त गर्ने प्रक्रिया हेर्नुहोस्",
        videoDesc: "गाइड भिडियो",
      },
      3: {
        title: "दुर्घटना पछिको क्षतिपूर्ति प्राप्त गर्नुहोस्",
        description: "उपचार सकियो तर शरीर पहिले जस्तो छैन? हामी तपाईंलाई क्षतिपूर्ति (अपाङ्गता भत्ता) प्राप्त गर्ने तरिका बताउँछौं।",
        videoUrlTitle: "भिडियोमा उपचार पछि अपाङ्गता श्रेणी प्राप्त गर्ने प्रक्रिया हेर्नुहोस्",
        videoDesc: "गाइड भिडियो",
      },
      4: {
        title: "काममा फिर्ता वा पुन: रोजगारी सहयोग",
        description: "फेरि काम गर्न चाहनुहुन्छ? व्यावसायिक तालिम सहयोगदेखि पुन: रोजगारीसम्म मद्दत गर्छौं।",
        videoUrlTitle: "भिडियोमा काममा फिर्ता वा पुन: रोजगारीको प्रक्रिया हेर्नुहोस्",
        videoDesc: "गाइड भिडियो",
      },
    },
    status: {
      inProgress: "प्रगतिमा",
      actions: "गर्ने काम",
      documents: "कागजात",
      required: "अनिवार्य",
      emptyActions: "कुनै गर्ने काम छैन।",
      emptyDocuments: "कुनै अनिवार्य कागजात छैन।",
      emptyWarnings: "कुनै चेतावनी छैन।",
    },
    dictionary: {},
  },
  hi: {
    heroTitle: "औद्योगिक दुर्घटना प्रक्रिया, एक नज़र में देखें",
    heroDescription: "हम आवेदन से लेकर वापसी तक पूरे प्रवाह में आपका मार्गदर्शन करेंगे।",
    videoBtn: "पूरी प्रक्रिया का वीडियो देखें",
    videoTitle: "औद्योगिक दुर्घटना मुआवजे के लिए पूर्ण गाइड",
    firstVisitTitle: "क्या आप पहली बार आए हैं?",
    firstVisitDesc: "कृपया नीचे दिए गए चरणों को क्रम से देखें। आप प्रत्येक चरण के लिए कार्य, आवश्यक दस्तावेज़ और चेतावनी देख सकते हैं।",
    videoTip: "💡 सुझाव: आप YouTube पर उपशीर्षक, प्लेबैक गति नियंत्रण जैसी विभिन्न सुविधाओं का उपयोग कर सकते हैं।",
    aiVideoNotice: "※ यह वीडियो एआई तकनीक का उपयोग करके बनाया गया है।",
    aiDocNotice: "※ यह दस्तावेज़ एआई तकनीक का उपयोग करके लिखा गया है।",
    docDetailTip: "💡 क्या आप इस दस्तावेज़ के बारे में और जानना चाहते हैं?",
    docDetailBtn: "{step} चरण दस्तावेज़ विवरण देखें",
    legalTitle: "※ कानूनी नोटिस",
    legalNotice: "यह पृष्ठ सामान्य औद्योगिक दुर्घटना प्रक्रिया मार्गदर्शन के लिए है, वास्तविक आवेदन COMWEL के निर्णय और व्यक्तिगत मामले के अनुसार भिन्न हो सकता है। इस जानकारी का कोई कानूनी प्रभाव नहीं है।",
    prevStep: "पिछला चरण",
    nextStep: "अगला चरण देखें",
    nextCondition: "अगला चरण",
    guideTitle: "आप इस तरह आगे बढ़ सकते हैं",
    tabs: {
      guide: "विवरण देखें",
      actions: "करने योग्य कार्य",
      documents: "दस्तावेज़",
      warnings: "चेतावनी",
    },
    stages: {
      1: {
        title: "औद्योगिक दुर्घटना के लिए इस तरह आवेदन करें",
        description: "चोट लगने पर सबसे पहले करने वाला काम! आवेदन से लेकर स्वीकृति तक की पूरी प्रक्रिया का मार्गदर्शन।",
        videoUrlTitle: "वीडियो में औद्योगिक दुर्घटना आवेदन प्रक्रिया देखें",
        videoDesc: "गाइड वीडियो",
      },
      2: {
        title: "उपचार और जीवन निर्वाह खर्च प्राप्त करें",
        description: "अस्पताल का बिल कैसे भरें? काम न कर पाने के दौरान जीवन निर्वाह खर्च (छुट्टी भत्ता) कैसे प्राप्त करें?",
        videoUrlTitle: "वीडियो में अस्पताल में उपचार और भत्ता प्राप्त करने की प्रक्रिया देखें",
        videoDesc: "गाइड वीडियो",
      },
      3: {
        title: "दुर्घटना के बाद का मुआवजा प्राप्त करें",
        description: "इलाज खत्म हो गया लेकिन शरीर पहले जैसा नहीं है? हम आपको मुआवजा (विकलांगता भत्ता) प्राप्त करने का तरीका बताते हैं।",
        videoUrlTitle: "वीडियो में उपचार के बाद विकलांगता श्रेणी प्राप्त करने की प्रक्रिया देखें",
        videoDesc: "गाइड वीडियो",
      },
      4: {
        title: "काम पर वापसी या पुन: रोजगार सहायता",
        description: "फिर से काम करना चाहते हैं? व्यावसायिक प्रशिक्षण सहायता से लेकर पुन: रोजगार तक मदद करते हैं।",
        videoUrlTitle: "वीडियो में काम पर वापसी या पुन: रोजगार की प्रक्रिया देखें",
        videoDesc: "गाइड वीडियो",
      },
    },
    status: {
      inProgress: "प्रगति पर",
      actions: "कार्य",
      documents: "दस्तावेज़",
      required: "अनिवार्य",
      emptyActions: "कोई कार्य नहीं है।",
      emptyDocuments: "कोई अनिवार्य दस्तावेज़ नहीं है।",
      emptyWarnings: "कोई चेतावनी नहीं है।",
    },
    dictionary: {},
  },
};

export const calculatorTranslations: Record<Locale, CalculatorTranslation> = {
  ko: {
    title: '산재 급여 계산기',
    description: '본 계산기는 근로복지공단 규정에 따른 근사치 제공 목적입니다. 실제 지급액은 심사 과정 및 각종 수당 적용 여부에 따라 달라질 수 있습니다.',
    sections: {
      wageInput: {
        title: '급여 정보 입력',
        desc: '다치기 전 3개월 동안 받은 세전 급여를 입력하세요',
        labels: { m1: '첫 번째 달', m2: '두 번째 달', m3: '세 번째 달' },
      },
      ageCheck: {
        title: '만 61세 이상이신가요?',
        desc: '만 61세가 넘으시면 고령자 감액이 적용되어 급여가 단계적으로 감액됩니다.',
        realAge: '실제 만나이',
        note: '※ 65세 이상 동일 비율 적용',
      },
      result: {
        title: '예상 산재 보상금 리포트',
        averageWage: { title: '나의 1일 평균임금', btn: '상세 계산법 보기' },
        sickLeave: { title: '한 달 전액 휴업급여', btn: '계산 조건 수정' },
        disability: { title: '장해 시 예상 보상', desc: '14급 ~ 1급(연금 포함)', btn: '등급별 상세 보기' },
      },
      footer: {
        title: '추가 도움이 필요하신가요?',
        desc: '정확한 산재 급여액 산정 및 보상 권리 찾기는 전문 노무사 또는 근로복지공단(☎ 1588-0075) 전문가의 상담을 권장합니다.',
      },
    },
    buttons: {
      calculate: '산재 보상금 계산하기',
      viewReport: '전체 보상 가이드 리포트 확인하기',
      save: '결과 저장하기',
      saving: '저장 중...',
      backToDashboard: '대시보드로',
    },
    units: {
      won: '원',
      year: '년',
      days: '일',
      age: '세',
    },
    alerts: {
      calculateFirst: '먼저 평균임금을 계산해주세요.',
      inputRequired: '최소 한 달 이상의 급여를 입력해주세요.',
      saveSuccess: '평균임금이 저장되었습니다.',
      saveFail: '저장에 실패했습니다. 로그인을 확인해주세요.',
      disclaimerTitle: '꼭 확인해주세요!',
      disclaimerContent: '본 계산기는 근로복지공단 규정에 따른 근사치 제공 목적입니다. 실제 지급액은 심사 과정 및 각종 수당 적용 여부에 따라 달라질 수 있습니다.',
    },
    dialogs: {
      averageWage: {
        title: '평균임금 계산 상세',
        calculated: '계산된 1일 평균임금',
        basis: '계산 근거',
        basisDesc: '재해 발생일 이전 3개월 임금 총액을 90일로 나눈 금액입니다.',
        note: '※ 상여금, 연차수당 등 기타 수당 포함 여부에 따라 실제 공단 심사 금액과 다를 수 있습니다.',
      },
      sickLeave: {
        title: '휴업급여 상세 및 조건 수정',
        expected: '예상되는 총 휴업급여액',
        perDay: '일 기준',
        adjustDays: '휴업 일수 조정',
        specialCase: '저소득 특례 제도 적용됨',
        specialCaseDesc: '평균임금이 낮아 산재법상 최저보장 기준에 따라 소득의 90%가 적용되었습니다.',
        calculation: '상세 계산식',
      },
      disability: {
        title: '장해급여 등급별 리스트',
        grade: '장해 {grade}급',
        pensionOnly: '연금 전용',
        lumpOnly: '일시금 전용',
        choice: '선택 가능',
        pension: '예상 연금총액',
        lump: '예상 일시금',
        expectedPension: '연금(년)',
        expectedLump: '일시금',
      },
    },
  },
  en: {
    title: 'Compensation Calculator',
    description: 'This is an estimate based on COMWEL regulations. Actual payments may vary depending on the content of the review.',
    sections: {
      wageInput: {
        title: 'Enter Wage Info',
        desc: 'Enter your pre-tax wages for the 3 months before injury',
        labels: { m1: '1st Month', m2: '2nd Month', m3: '3rd Month' },
      },
      ageCheck: {
        title: 'Are you over 61?',
        desc: 'If you are over 61, benefits are reduced gradually according to age.',
        realAge: 'Actual Age',
        note: '※ Same rate for 65+',
      },
      result: {
        title: 'Estimated Compensation Report',
        averageWage: { title: 'Daily Average Wage', btn: 'View Details' },
        sickLeave: { title: 'Monthly Sick Leave Benefit', btn: 'Edit Conditions' },
        disability: { title: 'Disability Benefits', desc: 'Grade 14 ~ 1', btn: 'View Grades' },
      },
      footer: {
        title: 'Need more help?',
        desc: 'For exact calculations, we recommend consulting a labor attorney or COMWEL (☎ 1588-0075).',
      },
    },
    buttons: {
      calculate: 'Calculate',
      viewReport: 'View Full Report',
      save: 'Save Result',
      saving: 'Saving...',
      backToDashboard: 'Dashboard',
    },
    units: {
      won: 'KRW',
      year: 'YR',
      days: 'days',
      age: '',
    },
    alerts: {
      calculateFirst: 'Please calculate average wage first.',
      inputRequired: 'Please enter at least one month of wages.',
      saveSuccess: 'Average wage saved.',
      saveFail: 'Save failed. Please check login.',
      disclaimerTitle: 'Important!',
      disclaimerContent: 'This calculator provides estimates based on COMWEL regulations. Actual payments may vary upon review.',
    },
    dialogs: {
      averageWage: {
        title: 'Average Wage Details',
        calculated: 'Calculated Daily Wage',
        basis: 'Calculation Basis',
        basisDesc: 'Total wages for 3 months before injury divided by 90 days.',
        note: '※ Actual amount may vary depending on bonuses and other allowances.',
      },
      sickLeave: {
        title: 'Sick Leave Benefit Details',
        expected: 'Total Expected Benefit',
        perDay: 'per days',
        adjustDays: 'Adjust Days',
        specialCase: 'Low Income Exception Applied',
        specialCaseDesc: '90% of income applied due to low average wage.',
        calculation: 'Calculation Formula',
      },
      disability: {
        title: 'Disability Benefit List',
        grade: 'Grade {grade}',
        pensionOnly: 'Pension Only',
        lumpOnly: 'Lump Sum Only',
        choice: 'Choice Available',
        pension: 'Exp. Pension',
        lump: 'Exp. Lump Sum',
        expectedPension: 'Pension/Yr',
        expectedLump: 'Lump Sum',
      },
    },
  },
  zh: {
    title: '工伤赔偿计算器',
    description: '本计算器旨在提供基于勤劳福祉公团规定的估算值。实际支付金额可能因审查过程及各种津贴适用情况而异。',
    sections: {
      wageInput: {
        title: '输入工资信息',
        desc: '请输入受伤前3个月的税前工资',
        labels: { m1: '第一个月', m2: '第二个月', m3: '第三个月' },
      },
      ageCheck: {
        title: '您是否超过61岁？',
        desc: '如果超过61岁，将适用高龄减额，补助金会逐步减少。',
        realAge: '实际年龄',
        note: '※ 65岁以上适用相比率',
      },
      result: {
        title: '预计工伤赔偿报告',
        averageWage: { title: '日平均工资', btn: '查看详情' },
        sickLeave: { title: '月休业补助', btn: '修改条件' },
        disability: { title: '伤残预计赔偿', desc: '14级 ~ 1级', btn: '查看各等级详情' },
      },
      footer: {
        title: '需要更多帮助吗？',
        desc: '为了准确计算，建议咨询专业劳务师或勤劳福祉公团(☎ 1588-0075)。',
      },
    },
    buttons: {
      calculate: '计算工伤赔偿金',
      viewReport: '查看完整报告',
      save: '保存结果',
      saving: '保存中...',
      backToDashboard: '返回仪表盘',
    },
    units: {
      won: '韩元',
      year: '年',
      days: '天',
      age: '岁',
    },
    alerts: {
      calculateFirst: '请先计算平均工资。',
      inputRequired: '请输入至少一个月的工资。',
      saveSuccess: '平均工资已保存。',
      saveFail: '保存失败。请检查登录状态。',
      disclaimerTitle: '请务必确认！',
      disclaimerContent: '此计算为估算值，实际支付金额可能因勤劳福祉公团的审查而异。',
    },
    dialogs: {
      averageWage: {
        title: '平均工资计算详情',
        calculated: '计算出的日平均工资',
        basis: '计算依据',
        basisDesc: '灾害发生日前3个月的工资总额除以90天。',
        note: '※ 根据奖金、年假津贴等其他津贴的包含情况，实际金额可能会有所不同。',
      },
      sickLeave: {
        title: '休业补助详情及修改',
        expected: '预计总休业补助',
        perDay: '按天数',
        adjustDays: '调整休业天数',
        specialCase: '适用低收入特例',
        specialCaseDesc: '因平均工资较低，适用收入的90%。',
        calculation: '详细计算公式',
      },
      disability: {
        title: '伤残补助各等级列表',
        grade: '伤残 {grade}级',
        pensionOnly: '仅年金',
        lumpOnly: '仅一次性金',
        choice: '可选择',
        pension: '预计年金总额',
        lump: '预计一次性金',
        expectedPension: '年金(年)',
        expectedLump: '一次性金',
      },
    },
  },
  vi: {
    title: 'Máy tính bồi thường tai nạn',
    description: 'Đây là ước tính dựa trên quy định của COMWEL. Số tiền thực tế có thể thay đổi tùy thuộc vào quá trình xét duyệt.',
    sections: {
      wageInput: {
        title: 'Nhập thông tin lương',
        desc: 'Nhập lương trước thuế trong 3 tháng trước khi bị thương',
        labels: { m1: 'Tháng 1', m2: 'Tháng 2', m3: 'Tháng 3' },
      },
      ageCheck: {
        title: 'Bạn trên 61 tuổi?',
        desc: 'Nếu trên 61 tuổi, phúc lợi sẽ giảm dần theo độ tuổi.',
        realAge: 'Tuổi thực',
        note: '※ Áp dụng tỷ lệ tương tự cho 65+',
      },
      result: {
        title: 'Báo cáo bồi thường dự kiến',
        averageWage: { title: 'Lương bình quân ngày', btn: 'Xem chi tiết' },
        sickLeave: { title: 'Trợ cấp nghỉ việc tháng', btn: 'Sửa điều kiện' },
        disability: { title: 'Bồi thường thương tật', desc: 'Cấp 14 ~ 1', btn: 'Xem chi tiết cấp' },
      },
      footer: {
        title: 'Cần thêm trợ giúp?',
        desc: 'Để tính toán chính xác, vui lòng tham khảo ý kiến luật sư lao động hoặc COMWEL (☎ 1588-0075).',
      },
    },
    buttons: {
      calculate: 'Tính toán',
      viewReport: 'Xem báo cáo đầy đủ',
      save: 'Lưu kết quả',
      saving: 'Đang lưu...',
      backToDashboard: 'Về trang chủ',
    },
    units: {
      won: 'KRW',
      year: 'Năm',
      days: 'ngày',
      age: 'tuổi',
    },
    alerts: {
      calculateFirst: 'Vui lòng tính lương bình quân trước.',
      inputRequired: 'Vui lòng nhập ít nhất một tháng lương.',
      saveSuccess: 'Đã lưu lương bình quân.',
      saveFail: 'Lưu thất bại. Vui lòng kiểm tra đăng nhập.',
      disclaimerTitle: 'Quan trọng!',
      disclaimerContent: 'Tính toán này chỉ là ước tính dựa trên quy định của COMWEL. Số tiền thực tế có thể khác.',
    },
    dialogs: {
      averageWage: {
        title: 'Chi tiết lương bình quân',
        calculated: 'Lương ngày đã tính',
        basis: 'Căn cứ tính',
        basisDesc: 'Tổng lương 3 tháng trước tai nạn chia cho 90 ngày.',
        note: '※ Số tiền thực tế có thể khác tùy thuộc vào tiền thưởng và phụ cấp.',
      },
      sickLeave: {
        title: 'Chi tiết trợ cấp nghỉ việc',
        expected: 'Tổng trợ cấp dự kiến',
        perDay: 'theo ngày',
        adjustDays: 'Điều chỉnh ngày',
        specialCase: 'Áp dụng đặc lệ thu nhập thấp',
        specialCaseDesc: '90% thu nhập được áp dụng do lương bình quân thấp.',
        calculation: 'Công thức tính',
      },
      disability: {
        title: 'Danh sách cấp độ thương tật',
        grade: 'Cấp {grade}',
        pensionOnly: 'Chỉ lương hưu',
        lumpOnly: 'Chỉ nhận một lần',
        choice: 'Có thể chọn',
        pension: 'Lương hưu dự kiến',
        lump: 'Một lần dự kiến',
        expectedPension: 'Lương hưu/Năm',
        expectedLump: 'Một lần',
      },
    },
  },
  th: {
    title: 'เครื่องคำนวณเงินชดเชย',
    description: 'นี่เป็นเพียงการประมาณการตามระเบียบ COMWEL ยอดเงินจริงอาจแตกต่างกันไปขึ้นอยู่กับการพิจารณา',
    sections: {
      wageInput: {
        title: 'ข้อมูลค่าจ้าง',
        desc: 'กรอกค่าจ้างก่อนหักภาษีย้อนหลัง 3 เดือนก่อนเกิดอุบัติเหตุ',
        labels: { m1: 'เดือนที่ 1', m2: 'เดือนที่ 2', m3: 'เดือนที่ 3' },
      },
      ageCheck: {
        title: 'คุณอายุเกิน 61 ปีหรือไม่?',
        desc: 'หากอายุเกิน 61 ปี เงินชดเชยจะลดลงตามเกณฑ์อายุ',
        realAge: 'อายุจริง',
        note: '※ อัตราเดียวกันสำหรับ 65+',
      },
      result: {
        title: 'รายงานเงินชดเชยโดยประมาณ',
        averageWage: { title: 'ค่าจ้างเฉลี่ยรายวัน', btn: 'ดูรายละเอียด' },
        sickLeave: { title: 'เงินชดเชยการหยุดงาน', btn: 'แก้ไขเงื่อนไข' },
        disability: { title: 'เงินทดแทนความพิการ', desc: 'ระดับ 14 ~ 1', btn: 'ดูระดับ' },
      },
      footer: {
        title: 'ต้องการความช่วยเหลือเพิ่มเติม?',
        desc: 'เพื่อการคำนวณที่แม่นยำ แนะนำให้ปรึกษาทนายความแรงงานหรือ COMWEL (☎ 1588-0075)',
      },
    },
    buttons: {
      calculate: 'คำนวณ',
      viewReport: 'ดูรายงานฉบับเต็ม',
      save: 'บันทึก',
      saving: 'กำลังบันทึก...',
      backToDashboard: 'กลับหน้าหลัก',
    },
    units: {
      won: 'วอน',
      year: 'ปี',
      days: 'วัน',
      age: 'ปี',
    },
    alerts: {
      calculateFirst: 'กรุณาคำนวณค่าจ้างเฉลี่ยก่อน',
      inputRequired: 'กรุณากรอกค่าจ้างอย่างน้อยหนึ่งเดือน',
      saveSuccess: 'บันทึกค่าจ้างเฉลี่ยแล้ว',
      saveFail: 'บันทึกไม่สำเร็จ กรุณาตรวจสอบการเข้าสู่ระบบ',
      disclaimerTitle: 'สำคัญ!',
      disclaimerContent: 'การคำนวณนี้เป็นการประมาณการตามระเบียบ COMWEL ยอดจ่ายจริงอาจแตกต่างกัน',
    },
    dialogs: {
      averageWage: {
        title: 'รายละเอียดค่าจ้างเฉลี่ย',
        calculated: 'ค่าจ้างรายวันที่คำนวณได้',
        basis: 'เกณฑ์การคำนวณ',
        basisDesc: 'ค่าจ้างรวม 3 เดือนก่อนเกิดอุบัติเหตุ หารด้วย 90 วัน',
        note: '※ ยอดจริงอาจแตกต่างกันขึ้นอยู่กับโบนัสและเบี้ยเลี้ยง',
      },
      sickLeave: {
        title: 'รายละเอียดเงินหยุดงาน',
        expected: 'ยอดรวมโดยประมาณ',
        perDay: 'ตามวัน',
        adjustDays: 'ปรับจำนวนวัน',
        specialCase: 'กรณีพิเศษรายได้ต่ำ',
        specialCaseDesc: 'ใช้ 90% ของรายได้เนื่องจากค่าจ้างเฉลี่ยต่ำ',
        calculation: 'สูตรการคำนวณ',
      },
      disability: {
        title: 'รายการระดับความพิการ',
        grade: 'ระดับ {grade}',
        pensionOnly: 'บำนาญเท่านั้น',
        lumpOnly: 'เงินก้อนเท่านั้น',
        choice: 'เลือกได้',
        pension: 'คาดการณ์บำนาญ',
        lump: 'คาดการณ์เงินก้อน',
        expectedPension: 'บำนาญ/ปี',
        expectedLump: 'เงินก้อน',
      },
    },
  },
  uz: {
    title: 'Kompensatsiya Kalkulyatori',
    description: 'Bu COMWEL qoidalariga asoslangan taxmin. Haqiqiy to\'lovlar farq qilishi mumkin.',
    sections: {
      wageInput: {
        title: 'Ish haqi ma\'lumotlari',
        desc: 'Jarohatdan oldingi 3 oylik soliqsiz ish haqingizni kiriting',
        labels: { m1: '1-oy', m2: '2-oy', m3: '3-oy' },
      },
      ageCheck: {
        title: 'Yoshingiz 61 dan oshganmi?',
        desc: 'Agar 61 dan oshgan bo\'lsangiz, nafaqalar yoshga qarab kamayadi.',
        realAge: 'Haqiqiy yosh',
        note: '※ 65+ uchun bir xil foiz',
      },
      result: {
        title: 'Tahminiy Kompensatsiya Hisoboti',
        averageWage: { title: 'Kunlik O\'rtacha Ish Haqi', btn: 'Batafsil' },
        sickLeave: { title: 'Oylik Ishlamaganlik Nafaqasi', btn: 'Tahrirlash' },
        disability: { title: 'Nogironlik Nafaqasi', desc: '14 ~ 1 Daraja', btn: 'Darajalarni ko\'rish' },
      },
      footer: {
        title: 'Yordam kerakmi?',
        desc: 'Aniq hisob-kitob uchun mehnat huquqshunosi yoki COMWEL (☎ 1588-0075) bilan maslahatlashing.',
      },
    },
    buttons: {
      calculate: 'Hisoblash',
      viewReport: 'To\'liq hisobot',
      save: 'Saqlash',
      saving: 'Saqlanmoqda...',
      backToDashboard: 'Bosh sahifa',
    },
    units: {
      won: 'von',
      year: 'yil',
      days: 'kun',
      age: 'yosh',
    },
    alerts: {
      calculateFirst: 'Iltimos, avval o\'rtacha ish haqini hisoblang.',
      inputRequired: 'Iltimos, kamida bir oylik ish haqini kiriting.',
      saveSuccess: 'O\'rtacha ish haqi saqlandi.',
      saveFail: 'Saqlashda xatolik. Tizimga kirganingizni tekshiring.',
      disclaimerTitle: 'Muhim!',
      disclaimerContent: 'Bu hisob-kitob taxminiydir. Haqiqiy to\'lovlar COMWEL tekshiruviga bog\'liq.',
    },
    dialogs: {
      averageWage: {
        title: 'O\'rtacha ish haqi tafsilotlari',
        calculated: 'Hisoblangan Kunlik Ish Haqi',
        basis: 'Hisoblash asosi',
        basisDesc: 'Jarohatdan oldingi 3 oylik umumiy ish haqi 90 kunga bo\'lingan.',
        note: '※ Bonuslar va boshqa to\'lovlarga qarab farq qilishi mumkin.',
      },
      sickLeave: {
        title: 'Ishlamaganlik nafaqasi tafsilotlari',
        expected: 'Kutilayotgan Jami Nafaqa',
        perDay: 'kunlar bo\'yicha',
        adjustDays: 'Kunlarni o\'zgartirish',
        specialCase: 'Kam daromadli maxsus holat',
        specialCaseDesc: 'Past o\'rtacha ish haqi sababli daromadning 90% i qo\'llanildi.',
        calculation: 'Hisoblash formulasi',
      },
      disability: {
        title: 'Nogironlik darajalari ro\'yxati',
        grade: '{grade}-daraja',
        pensionOnly: 'Faqat pensiya',
        lumpOnly: 'Faqat bir martalik',
        choice: 'Tanlash mumkin',
        pension: 'Kut. Pensiya',
        lump: 'Kut. Bir martalik',
        expectedPension: 'Pensiya/Yil',
        expectedLump: 'Bir martalik',
      },
    },
  },
  mn: {
    title: 'Нөхөн олговрын тооцоолуур',
    description: 'Энэ нь COMWEL-ийн журамд үндэслэсэн тооцоо юм. Бодит төлбөр өөр байж болно.',
    sections: {
      wageInput: {
        title: 'Цалингийн мэдээлэл',
        desc: 'Осол гарахаас өмнөх 3 сарын татваргүй цалинг оруулна уу',
        labels: { m1: '1-р сар', m2: '2-р сар', m3: '3-р сар' },
      },
      ageCheck: {
        title: 'Та 61-ээс дээш настай юу?',
        desc: 'Хэрэв 61-ээс дээш бол наснаас хамааран тэтгэмж буурна.',
        realAge: 'Бодит нас',
        note: '※ 65+ дээш ижил хувь',
      },
      result: {
        title: 'Тооцоолсон Нөхөн Олговрын Тайлан',
        averageWage: { title: 'Өдрийн дундаж цалин', btn: 'Дэлгэрэнгүй' },
        sickLeave: { title: 'Сарын чөлөөний тэтгэмж', btn: 'Нөхцөл засах' },
        disability: { title: 'Тахир дутуугийн тэтгэмж', desc: 'Зэрэглэл 14 ~ 1', btn: 'Зэрэглэл харах' },
      },
      footer: {
        title: 'Тусламж хэрэгтэй юу?',
        desc: 'Нарийн тооцоо гаргахын тулд хөдөлмөрийн хуульч эсвэл COMWEL (☎ 1588-0075)-тэй зөвлөлдөхийг зөвлөж байна.',
      },
    },
    buttons: {
      calculate: 'Тооцоолох',
      viewReport: 'Бүрэн тайлан харах',
      save: 'Хадгалах',
      saving: 'Хадгалж байна...',
      backToDashboard: 'Хяналтын самбар',
    },
    units: {
      won: 'вон',
      year: 'жил',
      days: 'хоног',
      age: 'нас',
    },
    alerts: {
      calculateFirst: 'Эхлээд дундаж цалинг тооцоолно уу.',
      inputRequired: 'Дор хаяж нэг сарын цалинг оруулна уу.',
      saveSuccess: 'Дундаж цалин хадгалагдлаа.',
      saveFail: 'Хадгалж чадсангүй. Нэвтэрсэн эсэхээ шалгана уу.',
      disclaimerTitle: 'Чухал!',
      disclaimerContent: 'Энэ тооцоо нь зөвхөн баримжаа юм. Бодит дүн өөр байж болно.',
    },
    dialogs: {
      averageWage: {
        title: 'Дундаж цалингийн дэлгэрэнгүй',
        calculated: 'Тооцсон өдрийн цалин',
        basis: 'Тооцох үндэслэл',
        basisDesc: 'Осол гарахаас өмнөх 3 сарын нийт цалинг 90 хоногт хуваасан.',
        note: '※ Урамшуулал болон бусад нэмэгдлээс хамааран бодит дүн өөр байж болно.',
      },
      sickLeave: {
        title: 'Чөлөөний тэтгэмжийн дэлгэрэнгүй',
        expected: 'Нийт хүлээгдэж буй тэтгэмж',
        perDay: 'хоногоор',
        adjustDays: 'Хоног өөрчлөх',
        specialCase: 'Бага орлоготой тусгай тохиолдол',
        specialCaseDesc: 'Дундаж цалин бага тул орлогын 90%-ийг тооцсон.',
        calculation: 'Тооцооны томьёо',
      },
      disability: {
        title: 'Тахир дутуугийн зэрэглэлийн жагсаалт',
        grade: '{grade}-р зэрэглэл',
        pensionOnly: 'Зөвхөн тэтгэвэр',
        lumpOnly: 'Зөвхөн нэг удаагийн',
        choice: 'Сонгох боломжтой',
        pension: 'Хүлээгдэж буй тэтгэвэр',
        lump: 'Хүлээгдэж буй нэг удаагийн',
        expectedPension: 'Тэтгэвэр/Жил',
        expectedLump: 'Нэг удаагийн',
      },
    },
  },
  id: {
    title: 'Kalkulator Kompensasi',
    description: 'Ini adalah perkiraan berdasarkan peraturan COMWEL. Pembayaran aktual dapat bervariasi.',
    sections: {
      wageInput: {
        title: 'Info Upah',
        desc: 'Masukkan upah sebelum pajak selama 3 bulan sebelum cedera',
        labels: { m1: 'Bulan 1', m2: 'Bulan 2', m3: 'Bulan 3' },
      },
      ageCheck: {
        title: 'Apakah usia > 61?',
        desc: 'Jika > 61, manfaat dikurangi secara bertahap sesuai usia.',
        realAge: 'Usia Sebenarnya',
        note: '※ Tarif sama untuk 65+',
      },
      result: {
        title: 'Laporan Estimasi Kompensasi',
        averageWage: { title: 'Upah Rata-rata Harian', btn: 'Lihat Detail' },
        sickLeave: { title: 'Tunjangan Cuti Sakit', btn: 'Ubah Kondisi' },
        disability: { title: 'Manfaat Disabilitas', desc: 'Kelas 14 ~ 1', btn: 'Lihat Kelas' },
      },
      footer: {
        title: 'Butuh bantuan?',
        desc: 'Untuk perhitungan pasti, disarankan berkonsultasi dengan pengacara tenaga kerja atau COMWEL (☎ 1588-0075).',
      },
    },
    buttons: {
      calculate: 'Hitung',
      viewReport: 'Lihat Laporan',
      save: 'Simpan',
      saving: 'Menyimpan...',
      backToDashboard: 'Dashboard',
    },
    units: {
      won: 'KRW',
      year: 'Thn',
      days: 'hari',
      age: 'thn',
    },
    alerts: {
      calculateFirst: 'Harap hitung upah rata-rata terlebih dahulu.',
      inputRequired: 'Harap masukkan setidaknya satu bulan upah.',
      saveSuccess: 'Upah rata-rata disimpan.',
      saveFail: 'Gagal menyimpan. Periksa login.',
      disclaimerTitle: 'Penting!',
      disclaimerContent: 'Perhitungan ini adalah perkiraan. Pembayaran aktual tergantung pada tinjauan COMWEL.',
    },
    dialogs: {
      averageWage: {
        title: 'Rincian Upah Rata-rata',
        calculated: 'Upah Harian Dihitung',
        basis: 'Dasar Perhitungan',
        basisDesc: 'Total upah 3 bulan sebelum cedera dibagi 90 hari.',
        note: '※ Jumlah aktual bisa berbeda tergantung bonus dan tunjangan.',
      },
      sickLeave: {
        title: 'Rincian Tunjangan Cuti',
        expected: 'Total Estimasi',
        perDay: 'per hari',
        adjustDays: 'Ubah Hari',
        specialCase: 'Pengecualian Pendapatan Rendah',
        specialCaseDesc: '90% diterapkan karena upah rata-rata rendah.',
        calculation: 'Rumus Hitung',
      },
      disability: {
        title: 'Daftar Kelas Disabilitas',
        grade: 'Kelas {grade}',
        pensionOnly: 'Hanya Pensiun',
        lumpOnly: 'Hanya Tunai',
        choice: 'Bisa Pilih',
        pension: 'Est. Pensiun',
        lump: 'Est. Tunai',
        expectedPension: 'Pensiun/Thn',
        expectedLump: 'Tunai',
      },
    },
  },
  ne: {
    title: 'क्षतिपूर्ति क्याल्कुलेटर',
    description: 'यो COMWEL नियमहरूमा आधारित अनुमान हो। वास्तविक भुक्तानी फरक हुन सक्छ।',
    sections: {
      wageInput: {
        title: 'ज्याला विवरण',
        desc: 'चोट लाग्नु अघि ३ महिनाको कर अघीको ज्याला प्रविष्ट गर्नुहोस्',
        labels: { m1: 'पहिलो महिना', m2: 'दोस्रो महिना', m3: 'तेस्रो महिना' },
      },
      ageCheck: {
        title: 'के तपाइँ ६१ माथि हुनुहुन्छ?',
        desc: 'यदि ६१ माथि, उमेर अनुसार लाभहरू क्रमशः घटाइन्छ।',
        realAge: 'वास्तविक उमेर',
        note: '※ ६५+ को लागि समान दर',
      },
      result: {
        title: 'अनुमानित क्षतिपूर्ति रिपोर्ट',
        averageWage: { title: 'दैनिक औसत ज्याला', btn: 'विवरण हेर्नुहोस्' },
        sickLeave: { title: 'मासिक बिदा भत्ता', btn: 'सर्तहरू सम्पादन' },
        disability: { title: 'अपाङ्गता लाभ', desc: 'ग्रेड १४ ~ १', btn: 'ग्रेड हेर्नुहोस्' },
      },
      footer: {
        title: 'थप मद्दत चाहिन्छ?',
        desc: 'सटीक गणनाको लागि श्रम वकिल वा COMWEL (☎ 1588-0075) सँग परामर्श गर्न सिफारिस गरिन्छ।',
      },
    },
    buttons: {
      calculate: 'गणना गर्नुहोस्',
      viewReport: 'पूरा रिपोर्ट',
      save: 'बचत गर्नुहोस्',
      saving: 'बचत गर्दै...',
      backToDashboard: 'ड्यासबोर्ड',
    },
    units: {
      won: 'वोन',
      year: 'वर्ष',
      days: 'दिन',
      age: 'वर्ष',
    },
    alerts: {
      calculateFirst: 'कृपया पहिले औसत ज्याला गणना गर्नुहोस्।',
      inputRequired: 'कम्तिमा एक महिनाको ज्याला प्रविष्ट गर्नुहोस्।',
      saveSuccess: 'औसत ज्याला सुरक्षित गरियो।',
      saveFail: 'बचत असफल। लगइन जाँच गर्नुहोस्।',
      disclaimerTitle: 'महत्त्वपूर्ण!',
      disclaimerContent: 'यो गणना एक अनुमान हो। वास्तविक भुक्तानी COMWEL समीक्षामा भर पर्छ।',
    },
    dialogs: {
      averageWage: {
        title: 'औसत ज्याला विवरण',
        calculated: 'गणना गरिएको दैनिक ज्याला',
        basis: 'गणना आधार',
        basisDesc: 'चोट लाग्नु ३ महिना अघिको कुल ज्याला ९० दिनले भाग गरिएको।',
        note: '※ बोनस र भत्ताहरूमा निर्भर गर्दै वास्तविक रकम फरक हुन सक्छ।',
      },
      sickLeave: {
        title: 'बिदा भत्ता विवरण',
        expected: 'कुल अनुमानित भत्ता',
        perDay: 'प्रति दिन',
        adjustDays: 'दिन समायोजन',
        specialCase: 'न्यून आय विशेष नियम',
        specialCaseDesc: 'कम औसत ज्यालाका कारण आयको ९०% लागू गरियो।',
        calculation: 'गणना सूत्र',
      },
      disability: {
        title: 'अपाङ्गता ग्रेड सूची',
        grade: 'ग्रेड {grade}',
        pensionOnly: 'पेन्सन मात्र',
        lumpOnly: 'एकमुष्ट मात्र',
        choice: 'छनौट उपलब्ध',
        pension: 'अनुमानित पेन्सन',
        lump: 'अनुमानित एकमुष्ट',
        expectedPension: 'पेन्सन/वर्ष',
        expectedLump: 'एकमुष्ट',
      },
    },
  },
  hi: {
    title: 'मुआवजा कैलकुलेटर',
    description: 'यह COMWEL नियमों पर आधारित एक अनुमान है। वास्तविक भुगतान भिन्न हो सकते हैं।',
    sections: {
      wageInput: {
        title: 'मजदूरी विवरण',
        desc: 'चोट से पहले 3 महीने का कर-पूर्व वेतन दर्ज करें',
        labels: { m1: 'पहला महीना', m2: 'दूसरा महीना', m3: 'तीसरा महीना' },
      },
      ageCheck: {
        title: 'क्या आप 61 से ऊपर हैं?',
        desc: 'यदि 61 से ऊपर हैं, तो लाभ उम्र के अनुसार धीरे-धीरे कम हो जाते हैं।',
        realAge: 'वास्तविक आयु',
        note: '※ 65+ के लिए समान दर',
      },
      result: {
        title: 'अनुमानित मुआवजा रिपोर्ट',
        averageWage: { title: 'दैनिक औसत मजदूरी', btn: 'विवरण देखें' },
        sickLeave: { title: 'मासिक अवकाश लाभ', btn: 'शर्तें संपादित करें' },
        disability: { title: 'विकलांगता लाभ', desc: 'ग्रेड 14 ~ 1', btn: 'ग्रेड देखें' },
      },
      footer: {
        title: 'और मदद चाहिए?',
        desc: 'सटीक गणना के लिए श्रम वकील या COMWEL (☎ 1588-0075) से परामर्श करने की अनुशंसा की जाती है।',
      },
    },
    buttons: {
      calculate: 'गणना करें',
      viewReport: 'पूर्ण रिपोर्ट देखें',
      save: 'सहेजें',
      saving: 'सहेजा जा रहा है...',
      backToDashboard: 'डैशबोर्ड',
    },
    units: {
      won: ' KRW',
      year: 'वर्ष',
      days: 'दिन',
      age: 'वर्ष',
    },
    alerts: {
      calculateFirst: 'कृपया पहले औसत मज़दूरी की गणना करें।',
      inputRequired: 'कृपया कम से कम एक महीने का वेतन दर्ज करें।',
      saveSuccess: 'औसत मज़दूरी सहेजी गई।',
      saveFail: 'सहेजना विफल। कृपया लॉगिन जांचें।',
      disclaimerTitle: 'महत्वपूर्ण!',
      disclaimerContent: 'यह गणना एक अनुमान है। वास्तविक भुगतान समीक्षा पर निर्भर करते हैं।',
    },
    dialogs: {
      averageWage: {
        title: 'औसत मजदूरी विवरण',
        calculated: 'गणना की गई दैनिक मजदूरी',
        basis: 'गणना का आधार',
        basisDesc: 'चोट से 3 महीने पहले की कुल मजदूरी को 90 दिनों से विभाजित किया गया।',
        note: '※ बोनस और भत्तों के आधार पर वास्तविक राशि भिन्न हो सकती है।',
      },
      sickLeave: {
        title: 'अवकाश लाभ विवरण',
        expected: 'कुल अनुमानित लाभ',
        perDay: 'प्रति दिन',
        adjustDays: 'दिन समायोजित करें',
        specialCase: 'कम आय विशेष नियम',
        specialCaseDesc: 'कम औसत मजदूरी के कारण आय का 90% लागू किया गया।',
        calculation: 'गणना सूत्र',
      },
      disability: {
        title: 'विकलांगता ग्रेड सूची',
        grade: 'ग्रेड {grade}',
        pensionOnly: 'केवल पेंशन',
        lumpOnly: 'केवल एकमुष्ट',
        choice: 'विकल्प उपलब्ध',
        pension: 'अनुमानित पेंशन',
        lump: 'अनुमानित एकमुष्ट',
        expectedPension: 'पेंशन/वर्ष',
        expectedLump: 'एकमुष्ट',
      },
    },
  },
};

export interface OnboardingTranslation {
  steps: {
    role: string;
    details: string;
    injury: string;
    region: string;
  };
  roles: {
    patient: string;
    family: string;
  };
  status: {
    step1: { label: string; desc: string };
    step2: { label: string; desc: string };
    step3: { label: string; desc: string };
    step4: { label: string; desc: string };
  };
  injury: {
    hand_arm: string;
    foot_leg: string;
    spine: string;
    brain_neuro: string;
    other: string;
  };
  region: {
    placeholder: string;
  };
  consent: {
    terms: string;
    termsLink: string;
    sensitive: string;
    sensitiveLink: string;
    sensitiveDesc: string;
  };
  buttons: {
    next: string;
    complete: string;
    cancel: string;
    modify: string;
    keep: string;
  };
  summary: {
    title: string;
    desc: string;
    labels: {
      role: string;
      status: string;
      injury: string;
      region: string;
    };
  };
}

export const onboardingTranslations: Record<Locale, OnboardingTranslation> = {
  ko: {
    steps: {
      role: '누구를 위해 이용하시나요?',
      details: '현재 산재 진행 상황은 어떠신가요?',
      injury: '치료받고 계신 부위는 어디인가요?',
      region: '어느 지역에서 요양 중이신가요?',
    },
    roles: {
      patient: '제가\n산재 환자예요',
      family: '저는\n보호자(가족)예요',
    },
    status: {
      step1: { label: '산재 신청 준비 단계', desc: '아직 산재 승인을 받지 못했어요' },
      step2: { label: '산재 치료 받는 중', desc: '승인받고 치료 중이며, 휴업급여를 받고 있어요' },
      step3: { label: '산재 치료 종결 단계', desc: '치료가 끝났거나, 장해 등급 심사를 준비해야 해요' },
      step4: { label: '종결 후 직업 복귀 단계', desc: '회사 복귀를 준비하거나 직업 훈련이 필요해요' },
    },
    injury: {
      hand_arm: '팔 / 손 (상지)',
      foot_leg: '다리 / 발 (하지)',
      spine: '척추 / 허리',
      brain_neuro: '뇌심혈관 / 신경',
      other: '기타 / 잘 모르겠음',
    },
    region: {
      placeholder: '지역을 선택해주세요',
    },
    consent: {
      terms: '이용약관 및 개인정보 수집 이용 동의 (필수)',
      termsLink: '약관 보기',
      sensitive: '[민감정보] 건강 관련 정보 수집 및 이용 동의 (필수)',
      sensitiveLink: '내용 보기',
      sensitiveDesc: '부상 부위 및 진행 단계 정보를 통한 서비스 제공을 위함',
    },
    buttons: {
      next: '다음으로',
      complete: '수정 완료',
      cancel: '취소',
      modify: '정보 수정하기',
      keep: '그대로 유지하기',
    },
    summary: {
      title: '내 정보 확인',
      desc: '현재 설정된 맞춤 정보입니다.\n변경사항이 있으신가요?',
      labels: {
        role: '이용 유형',
        status: '진행 단계',
        injury: '치료 부위',
        region: '거주 지역',
      },
    },
  },
  en: {
    steps: {
      role: 'Who is this for?',
      details: 'What is your current status?',
      injury: 'Where is the injury?',
      region: 'Where are you currently treated?',
    },
    roles: {
      patient: 'I am the\npatient',
      family: 'I am a\nfamily member',
    },
    status: {
      step1: { label: 'Preparing to apply', desc: 'Not yet approved for industrial accident' },
      step2: { label: 'Under treatment', desc: 'Approved and receiving treatment/benefits' },
      step3: { label: 'Treatment ending', desc: 'Treatment finished or preparing for disability review' },
      step4: { label: 'Return to work', desc: 'Preparing to return to work or training' },
    },
    injury: {
      hand_arm: 'Arm / Hand',
      foot_leg: 'Leg / Foot',
      spine: 'Spine / Back',
      brain_neuro: 'Brain / Neuro',
      other: 'Other / Not sure',
    },
    region: {
      placeholder: 'Select Region',
    },
    consent: {
      terms: 'Agree to Terms & Privacy Policy (Required)',
      termsLink: 'View Terms',
      sensitive: '[Sensitive] Agree to Health Info Collection (Required)',
      sensitiveLink: 'View Details',
      sensitiveDesc: 'To provide services based on injury and status',
    },
    buttons: {
      next: 'Next',
      complete: 'Complete',
      cancel: 'Cancel',
      modify: 'Edit Info',
      keep: 'Keep Current',
    },
    summary: {
      title: 'Confirm Info',
      desc: 'Your current customized info.\nAny changes?',
      labels: {
        role: 'User Type',
        status: 'Status',
        injury: 'Injury',
        region: 'Region',
      },
    },
  },
  zh: {
    steps: {
      role: '您是为谁使用？',
      details: '目前的工伤状况如何？',
      injury: '受伤部位在哪里？',
      region: '目前在哪里接受治疗？',
    },
    roles: {
      patient: '我是\n工伤患者',
      family: '我是\n家属(监护人)',
    },
    status: {
      step1: { label: '准备申请工伤', desc: '尚未获得工伤认定' },
      step2: { label: '正在治疗中', desc: '已获认定，正在治疗并领取休业津贴' },
      step3: { label: '治疗结束阶段', desc: '治疗结束或准备伤残等级审查' },
      step4: { label: '重返工作阶段', desc: '准备复职或需要职业培训' },
    },
    injury: {
      hand_arm: '手臂 / 手 (上肢)',
      foot_leg: '腿 / 脚 (下肢)',
      spine: '脊柱 / 腰部',
      brain_neuro: '脑血管 / 神经',
      other: '其他 / 不清楚',
    },
    region: {
      placeholder: '请选择地区',
    },
    consent: {
      terms: '同意使用条款及个人信息收集 (必选)',
      termsLink: '查看条款',
      sensitive: '[敏感信息] 同意收集健康信息 (必选)',
      sensitiveLink: '查看内容',
      sensitiveDesc: '用于根据受伤部位和阶段提供服务',
    },
    buttons: {
      next: '下一步',
      complete: '完成修改',
      cancel: '取消',
      modify: '修改信息',
      keep: '保持现状',
    },
    summary: {
      title: '确认信息',
      desc: '当前设置的定制信息。\n有变更吗？',
      labels: {
        role: '用户类型',
        status: '进行阶段',
        injury: '治疗部位',
        region: '居住地区',
      },
    },
  },
  vi: {
    steps: {
      role: 'Bạn sử dụng cho ai?',
      details: 'Tình trạng tai nạn lao động hiện tại?',
      injury: 'Vị trí bị thương ở đâu?',
      region: 'Bạn đang điều trị ở khu vực nào?',
    },
    roles: {
      patient: 'Tôi là\nbệnh nhân',
      family: 'Tôi là\nngười nhà',
    },
    status: {
      step1: { label: 'Chuẩn bị đăng ký', desc: 'Chưa được phê duyệt tai nạn lao động' },
      step2: { label: 'Đang điều trị', desc: 'Đã phê duyệt và đang nhận trợ cấp nghỉ việc' },
      step3: { label: 'Giai đoạn kết thúc', desc: 'Kết thúc điều trị hoặc chuẩn bị thẩm định thương tật' },
      step4: { label: 'Quay lại làm việc', desc: 'Chuẩn bị đi làm lại hoặc cần đào tạo nghề' },
    },
    injury: {
      hand_arm: 'Tay / Cánh tay',
      foot_leg: 'Chân / Bàn chân',
      spine: 'Cột sống / Lưng',
      brain_neuro: 'Tim mạch / Thần kinh',
      other: 'Khác / Không rõ',
    },
    region: {
      placeholder: 'Chọn khu vực',
    },
    consent: {
      terms: 'Đồng ý Điều khoản & Thu thập TT Cá nhân (Bắt buộc)',
      termsLink: 'Xem điều khoản',
      sensitive: '[Nhạy cảm] Đồng ý Thu thập TT Sức khỏe (Bắt buộc)',
      sensitiveLink: 'Xem nội dung',
      sensitiveDesc: 'Để cung cấp dịch vụ dựa trên chấn thương',
    },
    buttons: {
      next: 'Tiếp theo',
      complete: 'Hoàn tất',
      cancel: 'Hủy',
      modify: 'Sửa thông tin',
      keep: 'Giữ nguyên',
    },
    summary: {
      title: 'Xác nhận thông tin',
      desc: 'Thông tin tùy chỉnh hiện tại.\nCó thay đổi không?',
      labels: {
        role: 'Loại người dùng',
        status: 'Giai đoạn',
        injury: 'Vị trí',
        region: 'Khu vực',
      },
    },
  },
  th: {
    steps: {
      role: 'คุณใช้บริการนี้เพื่อใคร?',
      details: 'สถานะอุบัติเหตุงานปัจจุบันคืออะไร?',
      injury: 'บาดเจ็บที่ส่วนไหน?',
      region: 'รักษาตัวอยู่ที่ไหน?',
    },
    roles: {
      patient: 'ฉันเป็น\nผู้ป่วย',
      family: 'ฉันเป็น\nญาติ (ครอบครัว)',
    },
    status: {
      step1: { label: 'เตรียมยื่นคําร้อง', desc: 'ยังไม่ได้รับการอนุมัติอุบัติเหตุงาน' },
      step2: { label: 'กําลังรักษา', desc: 'อนุมัติแล้วและกําลังรับเงินทดแทนการขาดรายได้' },
      step3: { label: 'สิ้นสุดการรักษา', desc: 'รักษาจบแล้วหรือเตรียมประเมินความพิการ' },
      step4: { label: 'กลับเข้าทํางาน', desc: 'เตรียมกลับไปทํางานหรือฝึกอาชีพ' },
    },
    injury: {
      hand_arm: 'แขน / มือ',
      foot_leg: 'ขา / เท้า',
      spine: 'กระดูกสันหลัง / เอว',
      brain_neuro: 'สมอง / เส้นประสาท',
      other: 'อื่นๆ / ไม่แน่ใจ',
    },
    region: {
      placeholder: 'เลือกพื้นที่',
    },
    consent: {
      terms: 'ยอมรับเงื่อนไขและการเก็บข้อมูลส่วนบุคคล (จําเป็น)',
      termsLink: 'ดูเงื่อนไข',
      sensitive: '[ข้อมูลอ่อนไหว] ยอมรับการเก็บข้อมูลสุขภาพ (จําเป็น)',
      sensitiveLink: 'ดูรายละเอียด',
      sensitiveDesc: 'เพื่อให้บริการตามข้อมูลการบาดเจ็บ',
    },
    buttons: {
      next: 'ถัดไป',
      complete: 'เสร็จสิ้น',
      cancel: 'ยกเลิก',
      modify: 'แก้ไขข้อมูล',
      keep: 'คงไว้ตามเดิม',
    },
    summary: {
      title: 'ยืนยันข้อมูล',
      desc: 'ข้อมูลที่ตั้งค่าไว้\nมีการเปลี่ยนแปลงไหม?',
      labels: {
        role: 'ประเภทผู้ใช้',
        status: 'ขั้นตอน',
        injury: 'ส่วนที่บาดเจ็บ',
        region: 'พื้นที่',
      },
    },
  },
  uz: {
    steps: {
      role: 'Kim uchun foydalanasiz?',
      details: 'Hozirgi holatingiz qanday?',
      injury: 'Qayeringiz jarohatlangan?',
      region: 'Qaysi hududda davolanyapsiz?',
    },
    roles: {
      patient: 'Men\nbemor',
      family: 'Men\nvasiy (oila)',
    },
    status: {
      step1: { label: 'Ariza tayyorlash', desc: 'Hali ishlab chiqarish baxtsiz hodisasi tasdiqlanmagan' },
      step2: { label: 'Davolanishda', desc: 'Tasdiqlangan va kasallik nafaqasi olyapti' },
      step3: { label: 'Davolash yakuni', desc: 'Davolash tugadi yoki nogironlikni baholash' },
      step4: { label: 'Ishga qaytish', desc: 'Ishga qaytish yoki kasbiy tayyorgarlik' },
    },
    injury: {
      hand_arm: 'Qo\'l / Yelkalar',
      foot_leg: 'Oyoq / Tovon',
      spine: 'Umurtqa / Bel',
      brain_neuro: 'Miya / Nerv',
      other: 'Boshqa / Aniq emas',
    },
    region: {
      placeholder: 'Hududni tanlang',
    },
    consent: {
      terms: 'Foydalanish shartlari va shaxsiy ma\'lumotlar (Majburiy)',
      termsLink: 'Shartlarni ko\'rish',
      sensitive: '[Maxsus] Sog\'liqni saqlash ma\'lumotlari (Majburiy)',
      sensitiveLink: 'Batafsil',
      sensitiveDesc: 'Xizmat ko\'rsatish uchun kerak',
    },
    buttons: {
      next: 'Keyingi',
      complete: 'Yakunlash',
      cancel: 'Bekor qilish',
      modify: 'Tahrirlash',
      keep: 'O\'zgarishsiz',
    },
    summary: {
      title: 'Ma\'lumotni tasdiqlsh',
      desc: 'Hozirgi sozlangan ma\'lumot.\nO\'zgartirasizmi?',
      labels: {
        role: 'Foydalanuvchi',
        status: 'Bosqich',
        injury: 'Jarohat',
        region: 'Hudud',
      },
    },
  },
  mn: {
    steps: {
      role: 'Хэн ашиглах вэ?',
      details: 'Одоогийн нөхцөл байдал?',
      injury: 'Гэмтсэн хэсэг хаана вэ?',
      region: 'Аль бүсэд эмчлүүлж байна вэ?',
    },
    roles: {
      patient: 'Би бол\nөвчтөн',
      family: 'Би бол\nасран хамгаалагч',
    },
    status: {
      step1: { label: 'Өргөдөл бэлтгэх', desc: 'Үйлдвэрлэлийн осол хараахан батлагдаагүй' },
      step2: { label: 'Эмчилгээ хийгдэж байна', desc: 'Батлагдсан, амралттай байгаа' },
      step3: { label: 'Эмчилгээ дуусах', desc: 'Эмчилгээ дууссан эсвэл хөгжлийн бэрхшээл тогтоох' },
      step4: { label: 'Ажилд орох', desc: 'Ажилд орох бэлтгэл эсвэл мэргэжлийн сургалт' },
    },
    injury: {
      hand_arm: 'Гар / Бугуй',
      foot_leg: 'Хөл / Шагай',
      spine: 'Нуруу / Бүсэлхий',
      brain_neuro: 'Тархи / Мэдрэл',
      other: 'Бусад / Мэдэхгүй',
    },
    region: {
      placeholder: 'Бүс нутаг сонгох',
    },
    consent: {
      terms: 'Үйлчилгээний нөхцөл, хувийн мэдээлэл (Заавал)',
      termsLink: 'Нөхцөл харах',
      sensitive: '[Эмзэг] Эрүүл мэндийн мэдээлэл (Заавал)',
      sensitiveLink: 'Дэлгэрэнгүй',
      sensitiveDesc: 'Үйлчилгээ үзүүлэхэд шаардлагатай',
    },
    buttons: {
      next: 'Дараах',
      complete: 'Дуусгах',
      cancel: 'Цуцлах',
      modify: 'Засах',
      keep: 'Хэвээр үлдээх',
    },
    summary: {
      title: 'Мэдээлэл баталгаажуулах',
      desc: 'Одоогийн тохиргоо.\nӨөрчлөх үү?',
      labels: {
        role: 'Хэрэглэгч',
        status: 'Үе шат',
        injury: 'Гэмтэл',
        region: 'Бүс нутаг',
      },
    },
  },
  id: {
    steps: {
      role: 'Untuk siapa ini?',
      details: 'Bagaimana status saat ini?',
      injury: 'Di mana letak cederanya?',
      region: 'Di mana Anda dirawat?',
    },
    roles: {
      patient: 'Saya\npasien',
      family: 'Saya\nkeluarga',
    },
    status: {
      step1: { label: 'Persiapan Aplikasi', desc: 'Belum disetujui untuk kecelakaan kerja' },
      step2: { label: 'Sedang Dirawat', desc: 'Disetujui dan menerima tunjangan cuti' },
      step3: { label: 'Akhir Pengobatan', desc: 'Pengobatan selesai atau persiapan evaluasi cacat' },
      step4: { label: 'Kembali Bekerja', desc: 'Persiapan kembali kerja atau pelatihan kerja' },
    },
    injury: {
      hand_arm: 'Lengan / Tangan',
      foot_leg: 'Kaki / Telapak',
      spine: 'Tulang Belakang / Pinggang',
      brain_neuro: 'Otak / Saraf',
      other: 'Lainnya / Tidak Tahu',
    },
    region: {
      placeholder: 'Pilih Wilayah',
    },
    consent: {
      terms: 'Setuju Syarat & Privasi (Wajib)',
      termsLink: 'Lihat Syarat',
      sensitive: '[Sensitif] Setuju Info Kesehatan (Wajib)',
      sensitiveLink: 'Lihat Detail',
      sensitiveDesc: 'Untuk layanan berdasarkan cedera',
    },
    buttons: {
      next: 'Lanjut',
      complete: 'Selesai',
      cancel: 'Batal',
      modify: 'Ubah Info',
      keep: 'Tetap',
    },
    summary: {
      title: 'Konfirmasi Info',
      desc: 'Info yang disesuaikan saat ini.\nAda perubahan?',
      labels: {
        role: 'Tipe Pengguna',
        status: 'Tahap',
        injury: 'Cedera',
        region: 'Wilayah',
      },
    },
  },
  ne: {
    steps: {
      role: 'यो कसको लागि हो?',
      details: 'वर्तमान स्थिति के छ?',
      injury: 'चोट कहाँ लागेको छ?',
      region: 'तपाईं कहाँ उपचार गराउँदै हुनुहुन्छ?',
    },
    roles: {
      patient: 'म\nबिरामी हुँ',
      family: 'म\nअभिभावक (परिवार) हुँ',
    },
    status: {
      step1: { label: 'आवेदन तयारी', desc: 'औद्योगिक दुर्घटना स्वीकृत भएको छैन' },
      step2: { label: 'उपचार भइरहेको', desc: 'स्वीकृत र बिदा भत्ता प्राप्त गर्दै' },
      step3: { label: 'उपचार अन्त्य', desc: 'उपचार समाप्त वा असक्षमता मूल्याङ्कन तयारी' },
      step4: { label: 'काममा फर्कने', desc: 'काममा फर्कने तयारी वा व्यावसायिक प्रशिक्षण' },
    },
    injury: {
      hand_arm: 'हात / पाखुरा',
      foot_leg: 'खुट्टा / पैताला',
      spine: 'ढाड / कमर',
      brain_neuro: 'मस्तिष्क / स्नायु',
      other: 'अन्य / थाहा छैन',
    },
    region: {
      placeholder: 'क्षेत्र छान्नुहोस्',
    },
    consent: {
      terms: 'सर्त र गोपनीयता स्वीकार (अनिवार्य)',
      termsLink: 'सर्त हेर्नुहोस्',
      sensitive: '[संवेदनशील] स्वास्थ्य जानकारी स्वीकार (अनिवार्य)',
      sensitiveLink: 'विवरण हेर्नुहोस्',
      sensitiveDesc: 'चोट र स्थितिमा आधारित सेवाका लागि',
    },
    buttons: {
      next: 'अर्को',
      complete: 'पूरा भयो',
      cancel: 'रद्ध गर्नुहोस्',
      modify: 'जानकारी सच्याउनुहोस्',
      keep: 'यस्तै राख्नुहोस्',
    },
    summary: {
      title: 'जानकारी पुष्टि',
      desc: 'हालको जानकारी.\nकेही परिवर्तन छ?',
      labels: {
        role: 'प्रयोगकर्ता प्रकार',
        status: 'चरण',
        injury: 'चोट',
        region: 'क्षेत्र',
      },
    },
  },
  hi: {
    steps: {
      role: 'यह किसके लिए है?',
      details: 'वर्तमान स्थिति क्या है?',
      injury: 'चोट कहाँ लगी है?',
      region: 'आप कहाँ इलाज करा रहे हैं?',
    },
    roles: {
      patient: 'मैं\nरोगी हूँ',
      family: 'मैं\nअभिभावक (परिवार) हूँ',
    },
    status: {
      step1: { label: 'आवेदन की तैयारी', desc: 'औद्योगिक दुर्घटना अभी स्वीकृत नहीं हुई है' },
      step2: { label: 'उपचार चल रहा है', desc: 'स्वीकृत और अवकाश भत्ता प्राप्त कर रहे हैं' },
      step3: { label: 'उपचार समाप्ति', desc: 'उपचार समाप्त या विकलांगता मूल्यांकन की तैयारी' },
      step4: { label: 'काम पर वापसी', desc: 'काम पर लौटने की तैयारी या व्यावसायिक प्रशिक्षण' },
    },
    injury: {
      hand_arm: 'हाथ / बांह',
      foot_leg: 'पैर / तलवा',
      spine: 'रीढ़ / कमर',
      brain_neuro: 'मस्तिष्क / तंत्रिका',
      other: 'अन्य / सुनिश्चित नहीं',
    },
    region: {
      placeholder: 'क्षेत्र चुनें',
    },
    consent: {
      terms: 'शर्तें और गोपनीयता स्वीकार करें (अनिवार्य)',
      termsLink: 'शर्तें देखें',
      sensitive: '[संवेदनशील] स्वास्थ्य जानकारी स्वीकार करें (अनिवार्य)',
      sensitiveLink: 'विवरण देखें',
      sensitiveDesc: 'चोट और स्थिति के आधार पर सेवा के लिए',
    },
    buttons: {
      next: 'अगला',
      complete: 'पूर्ण',
      cancel: 'रद्द करें',
      modify: 'जानकारी बदलें',
      keep: 'ऐसे ही रखें',
    },
    summary: {
      title: 'जानकारी की पुष्टि',
      desc: 'वर्तमान अनुकूलित जानकारी।\nकोई परिवर्तन?',
      labels: {
        role: 'उपयोगकर्ता प्रकार',
        status: 'चरण',
        injury: 'चोट',
        region: 'क्षेत्र',
      },
    },
  },
};

export interface DocumentsTranslation {
  hero: {
    title: string;
    description: string;
  };
  ui: {
    tabs: {
      all: string;
      step1: string;
      step2: string;
      step3: string;
      step4: string;
    };
    search: {
      placeholder: string;
      result: string;
    };
    banner: {
      title: string;
      desc: string;
      button: string;
    };
    sections: {
      write: string;
      request: string;
      requestGuide: string;
    };
    badges: {
      hospital: string;
      company: string;
      court: string;
      other: string;
      optional: string;
    };
  };
  items: Record<string, { name: string; description: string }>;
}

export const documentsTranslations: Record<Locale, DocumentsTranslation> = {
  ko: {
    hero: {
      title: '복잡한 산재 서류, 리워크케어가 챙겨드립니다',
      description: '양식부터 작성 방법까지, 누구나 쉽게 이해하도록 정리했습니다.',
    },
    ui: {
      tabs: {
        all: '전체 보기',
        step1: '1. 신청 단계',
        step2: '2. 치료 중',
        step3: '3. 장해 평가',
        step4: '4. 사회 복귀',
      },
      search: {
        placeholder: '찾으시는 서류 이름이 있나요?',
        result: '{n}개의 서류를 찾았습니다',
      },
      banner: {
        title: '현재 단계에서 꼭 필요한 서류입니다',
        desc: '총 {n}개의 서류가 필요합니다.',
        button: '전체 서류 보기',
      },
      sections: {
        write: '직접 작성해주세요',
        request: '발급 요청해주세요',
        requestGuide: '이 서류들은 환자가 직접 작성하는 것이 아닙니다. 병원 원무과나 담당 의사 선생님께 "발급해 주세요"라고 요청하시면 됩니다.',
      },
      badges: {
        hospital: '병원',
        company: '회사',
        court: '법원/기타',
        other: '기타',
        optional: '선택',
      },
    },
    items: {
      'workplace-accident-application': { name: '산재 최초 신청서', description: '일하다 다쳤을 때 산재로 인정받기 위해 가장 먼저 내는 신청서입니다.' },
      'accident-report': { name: '사고 경위서', description: '어떻게 다쳤는지 상황을 자세히 설명하는 서류입니다.' },
      'medical-benefit-application': { name: '요양비 청구서', description: '내 돈으로 먼저 낸 병원비와 약값을 돌려받는 신청서입니다.' },
      'sick-leave-benefit-application': { name: '휴업급여 청구서', description: '치료 때문에 일을 못 한 기간의 생활비를 받는 신청서입니다.' },
      'disability-rating-application': { name: '장해급여 청구서', description: '치료 후 남은 후유증에 대한 보상금을 받는 신청서입니다.' },
      'employment-support-application': { name: '취업지원서비스 신청서', description: '다친 후 새로운 일자리를 찾거나 직업교육을 받을 때 지원받는 신청서입니다.' },
      're-treatment-application': { name: '재요양신청서', description: '치료 가 끝난 후 다시 아프거나 핀을 빼야 할 때 재치료를 신청하는 서류입니다.' },
      'hospital-transfer-application': { name: '전원요양 신청서', description: '치료받는 병원을 다른 곳으로 옮기고 싶을 때 내는 신청서입니다.' },
      'additional-disease-application': { name: '추가상병 신청서', description: '처음 신청할 때 몰랐던 다른 부상이나 질병을 추가로 인정받는 신청서입니다.' },
      'nursing-care-benefit-application': { name: '간병급여 청구서', description: '혼자 거동이 어려워 간병인이 필요할 때 간병비를 받는 신청서입니다.' },
      'concurrent-treatment-application': { name: '병행진료 신청서', description: '현재 병원에 없는 진료를 다른 병원에서 함께 받고 싶을 때 내는 신청서입니다.' },
      'transportation-expense-application': { name: '이송비 청구서', description: '병원 갈 때 쓴 교통비를 청구하는 서류입니다.' },
      'medical-opinion-certificate': { name: '산재용 소견서/진단서', description: '산재 신청 시 의사가 작성하는 전문 소견서입니다.' },
      'medical-records-copy': { name: '의무기록사본', description: '사고 당시부터 현재까지의 모든 치료 내역이 담긴 병원 기록입니다.' },
      'medical-expense-detail': { name: '진료비 영수증/상세내역서', description: '본인이 먼저 부담한 병원비(요양비)를 돌려받기 위한 필수 증빙 서류입니다.' },
      'disability-certificate': { name: '장해진단서', description: '치료가 끝난 후에 도 신체에 남은 영구적인 훼손 상태를 평가하는 서류입니다.' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: '장해 상태를 확인할 수 있는 객관적인 영상 자료입니다.' },
      'employer-confirmation': { name: '사업주 확인서', description: '재해 발생 사실에 대해 회사 사장님의 확인을 받는 서류입니다.' },
      'settlement-judgment': { name: '합의서/판결문', description: '회사와 별도로 합의하거나 소송을 통해 돈을 받은 경우 신고하는 서류입니다.' },
    },
  },
  en: {
    hero: {
      title: 'Complex Documents, ReworkCare Handling It',
      description: 'From forms to guidelines, organized for everyone to understand easily.',
    },
    ui: {
      tabs: {
        all: 'View All',
        step1: '1. Initial',
        step2: '2. Treatment',
        step3: '3. Disability',
        step4: '4. Return',
      },
      search: {
        placeholder: 'Search for documents...',
        result: 'Found {n} documents',
      },
      banner: {
        title: 'Documents Required for This Stage',
        desc: 'Total {n} documents needed.',
        button: 'View All Documents',
      },
      sections: {
        write: 'Fill Out Yourself',
        request: 'Request Issuance',
        requestGuide: 'These documents are requested from hospitals/companies, not written by patients.',
      },
      badges: {
        hospital: 'Hospital',
        company: 'Company',
        court: 'Court/Other',
        other: 'Other',
        optional: 'Optional',
      },
    },
    items: {
      'workplace-accident-application': { name: 'Initial Application', description: 'First form to apply for industrial accident recognition.' },
      'accident-report': { name: 'Accident Report', description: 'Detailed explanation of how the accident occurred.' },
      'medical-benefit-application': { name: 'Medical Expense Claim', description: 'Claim for reimbursement of medical expenses paid personally.' },
      'sick-leave-benefit-application': { name: 'Lost Wage Claim', description: 'Claim for living expenses during treatment period.' },
      'disability-rating-application': { name: 'Disability Benefit Claim', description: 'Claim for compensation for permanent aftereffects.' },
      'employment-support-application': { name: 'Vocational Training App', description: 'Application for new job support or training.' },
      're-treatment-application': { name: 'Re-treatment Application', description: 'Application for treatment after case closure (relapse).' },
      'hospital-transfer-application': { name: 'Transfer Application', description: 'Application to change hospitals.' },
      'additional-disease-application': { name: 'Additional Injury App', description: 'Application for newly discovered injuries/diseases.' },
      'nursing-care-benefit-application': { name: 'Nursing Care Claim', description: 'Claim for caregiver expenses if assistance is needed.' },
      'concurrent-treatment-application': { name: 'Concurrent Treatment App', description: 'Application to treat at two hospitals simultaneously.' },
      'transportation-expense-application': { name: 'Transport Expense Claim', description: 'Claim for transportation costs to hospital.' },
      'medical-opinion-certificate': { name: 'Medical Opinion', description: 'Professional opinion written by doctor for application.' },
      'medical-records-copy': { name: 'Medical Records Copy', description: 'Full hospital records from accident to present.' },
      'medical-expense-detail': { name: 'Detailed Medical Receipt', description: 'Detailed receipt required for reimbursement.' },
      'disability-certificate': { name: 'Disability Certificate', description: 'Evaluation of permanent body damage after treatment.' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: 'Objective imaging data to verify disability.' },
      'employer-confirmation': { name: 'Employer Confirmation', description: 'Confirmation of accident by employer (Optional).' },
      'settlement-judgment': { name: 'Settlement/Judgment', description: 'Report of any civil settlement or lawsuit money received.' },
    },
  },
  zh: {
    hero: {
      title: '复杂的工伤文件，ReworkCare 帮您搞定',
      description: '从表格到填写方法，整理得简单易懂。',
    },
    ui: {
      tabs: {
        all: '查看全部',
        step1: '1. 申请阶段',
        step2: '2. 治疗中',
        step3: '3. 伤残评估',
        step4: '4. 重返社会',
      },
      search: {
        placeholder: '搜索文件名称...',
        result: '找到 {n} 个文件',
      },
      banner: {
        title: '当前阶段必需的文件',
        desc: '共需要 {n} 个文件。',
        button: '查看所有文件',
      },
      sections: {
        write: '请亲自填写',
        request: '请申请签发',
        requestGuide: '这些文件不是由患者填写的，请向医院或负责医生申请签发。',
      },
      badges: {
        hospital: '医院',
        company: '公司',
        court: '法院/其他',
        other: '其他',
        optional: '可选',
      },
    },
    items: {
      'workplace-accident-application': { name: '工伤认定申请书', description: '受伤后申请工伤认定时提交的最初申请书。' },
      'accident-report': { name: '事故经过书', description: '详细说明事故发生经过的文件。' },
      'medical-benefit-application': { name: '疗养费申请书', description: '申请报销垫付医药费的文件。' },
      'sick-leave-benefit-application': { name: '休业津贴申请书', description: '申请治疗期间因无法工作的生活费。' },
      'disability-rating-application': { name: '伤残津贴申请书', description: '治疗后申请后遗症赔偿金的文件。' },
      'employment-support-application': { name: '就业支援服务申请书', description: '申请新工作或职业培训支援。' },
      're-treatment-application': { name: '再疗养申请书', description: '治疗终结后因复发等需要再次治疗时申请。' },
      'hospital-transfer-application': { name: '转院申请书', description: '想要变更治疗医院时提交的申请书。' },
      'additional-disease-application': { name: '追加伤病申请书', description: '申请认定最初未发现的其他伤病。' },
      'nursing-care-benefit-application': { name: '看护费申请书', description: '行动不便需要看护人时申请看护费。' },
      'concurrent-treatment-application': { name: '并行诊疗申请书', description: '需要在其他医院同时接受治疗时申请。' },
      'transportation-expense-application': { name: '移送费申请书', description: '申请去医院产生的交通费。' },
      'medical-opinion-certificate': { name: '工伤用诊断书', description: '医生填写的用于工伤申请的专业意见书。' },
      'medical-records-copy': { name: '病历复印件', description: '包含从事故至今所有治疗内容的记录。' },
      'medical-expense-detail': { name: '诊疗费详细清单', description: '报销垫付费用必需的详细凭证。' },
      'disability-certificate': { name: '伤残诊断书', description: '评价治疗后身体永久性损伤状态的文件。' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: '确认伤残状态的客观影像资料。' },
      'employer-confirmation': { name: '雇主确认书', description: '雇主确认事故发生的文书（可选）。' },
      'settlement-judgment': { name: '协议书/判决书', description: '申报收到公司民事赔偿或诉讼金的文件。' },
    },
  },
  vi: {
    hero: {
      title: 'Hồ sơ TNLĐ phức tạp, ReworkCare lo liệu',
      description: 'Từ biểu mẫu đến hướng dẫn, sắp xếp dễ hiểu cho mọi người.',
    },
    ui: {
      tabs: {
        all: 'Xem tất cả',
        step1: '1. Đăng ký',
        step2: '2. Điều trị',
        step3: '3. Thương tật',
        step4: '4. Trở lại',
      },
      search: {
        placeholder: 'Tìm kiếm tên tài liệu...',
        result: 'Tìm thấy {n} tài liệu',
      },
      banner: {
        title: 'Tài liệu cần thiết cho giai đoạn này',
        desc: 'Cần tổng cộng {n} tài liệu.',
        button: 'Xem tất cả',
      },
      sections: {
        write: 'Tự điền đơn',
        request: 'Yêu cầu cấp',
        requestGuide: 'Bệnh nhân không tự viết mà yêu cầu bệnh viện/bác sĩ cấp.',
      },
      badges: {
        hospital: 'Bệnh viện',
        company: 'Công ty',
        court: 'Tòa án',
        other: 'Khác',
        optional: 'Tùy chọn',
      },
    },
    items: {
      'workplace-accident-application': { name: 'Đơn xin TNLĐ lần đầu', description: 'Đơn nộp đầu tiên để được công nhận TNLĐ.' },
      'accident-report': { name: 'Bản tường trình tai nạn', description: 'Tài liệu giải thích chi tiết tai nạn xảy ra thế nào.' },
      'medical-benefit-application': { name: 'Đơn xin phí điều trị', description: 'Đơn xin hoàn trả chi phí y tế đã tự chi trả.' },
      'sick-leave-benefit-application': { name: 'Đơn xin trợ cấp nghỉ việc', description: 'Đơn xin chi phí sinh hoạt khi không thể làm việc.' },
      'disability-rating-application': { name: 'Đơn xin trợ cấp thương tật', description: 'Đơn xin bồi thường di chứng sau điều trị.' },
      'employment-support-application': { name: 'Đơn xin hỗ trợ việc làm', description: 'Đơn xin hỗ trợ tìm việc mới hoặc đào tạo nghề.' },
      're-treatment-application': { name: 'Đơn xin tái điều trị', description: 'Xin điều trị lại khi tái phát sau khi đã kết thúc.' },
      'hospital-transfer-application': { name: 'Đơn xin chuyển viện', description: 'Đơn nộp khi muốn chuyển sang bệnh viện khác.' },
      'additional-disease-application': { name: 'Đơn xin bổ sung thương bệnh', description: 'Xin công nhận thêm chấn thương chưa phát hiện ban đầu.' },
      'nursing-care-benefit-application': { name: 'Đơn xin phí hộ lý', description: 'Xin phí thuê người chăm sóc khi khó khăn đi lại.' },
      'concurrent-treatment-application': { name: 'Đơn xin điều trị song song', description: 'Xin điều trị cùng lúc tại bệnh viện khác.' },
      'transportation-expense-application': { name: 'Đơn xin phí di chuyển', description: 'Xin chi phí đi lại đến bệnh viện.' },
      'medical-opinion-certificate': { name: 'Giấy chứng nhận y tế', description: 'Ý kiến chuyên môn của bác sĩ để xin TNLĐ.' },
      'medical-records-copy': { name: 'Bản sao hồ sơ bệnh án', description: 'Hồ sơ điều trị từ lúc tai nạn đến nay.' },
      'medical-expense-detail': { name: 'Hóa đơn chi tiết viện phí', description: 'Chứng từ cần thiết để hoàn trả viện phí.' },
      'disability-certificate': { name: 'Giấy chứng nhận thương tật', description: 'Đánh giá tổn thương vĩnh viễn sau điều trị.' },
      'medical-imaging-cd': { name: 'Đĩa CD MRI / X-ray', description: 'Dữ liệu hình ảnh khách quan xác nhận thương tật.' },
      'employer-confirmation': { name: 'Xác nhận của chủ lao động', description: 'Chủ lao động xác nhận tai nạn (Tùy chọn).' },
      'settlement-judgment': { name: 'Biên bản hòa giải/Phán quyết', description: 'Kha khai tiền bồi thường dân sự đã nhận.' },
    },
  },
  th: {
    hero: {
      title: 'เอกสารซับซ้อน ReworkCare จัดการให้',
      description: 'จัดระเบียบตั่งแต่แบบฟอร์มถึงวิธีเขียนให้เข้าใจง่าย',
    },
    ui: {
      tabs: {
        all: 'ดูทั้งหมด',
        step1: '1. ขั้นตอนการสมัคร',
        step2: '2. ระหว่างรักษา',
        step3: '3. ประเมินความพิการ',
        step4: '4. กลับสู่สังคม',
      },
      search: {
        placeholder: 'ค้นหาชื่อเอกสาร...',
        result: 'พบ {n} เอกสาร',
      },
      banner: {
        title: 'เอกสารที่จำเป็นในขั้นตอนนี้',
        desc: 'ต้องการเอกสารทั้งหมด {n} ฉบับ',
        button: 'ดูเอกสารทั้งหมด',
      },
      sections: {
        write: 'กรอกด้วยตนเอง',
        request: 'ขอออกเอกสาร',
        requestGuide: 'ผู้ป่วยไม่ได้เขียนเอง แต่ต้องขอให้โรงพยาบาล/แพทย์ออกให้',
      },
      badges: {
        hospital: 'โรงพยาบาล',
        company: 'บริษัท',
        court: 'ศาล/อื่น ๆ',
        other: 'อื่น ๆ',
        optional: 'ไม่บังคับ',
      },
    },
    items: {
      'workplace-accident-application': { name: 'ใบสมัครเงินทดแทนครั้งแรก', description: 'แบบฟอร์มแรกเพื่อขอรับรองอุบัติเหตุงาน' },
      'accident-report': { name: 'รายงานอุบัติเหตุ', description: 'เอกสารอธิบายรายละเอียดการเกิดอุบัติเหตุ' },
      'medical-benefit-application': { name: 'ใบเบิกค่ารักษาพยาบาล', description: 'ขอคืนเงินค่ารักษาที่จ่ายไปก่อน' },
      'sick-leave-benefit-application': { name: 'ใบขอเงินทดแทนการหยุดงาน', description: 'ขอค่าครองชีพช่วงที่ทำงานไม่ได้' },
      'disability-rating-application': { name: 'ใบขอเงินทดแทนความพิการ', description: 'ขอเงินชดเชยสำหรับผลกระทบถาวรหลังรักษา' },
      'employment-support-application': { name: 'ใบสมัครบริการจัดหางาน', description: 'ขอสนับสนุนงานใหม่หรือฝึกอาชีพ' },
      're-treatment-application': { name: 'ใบขอรักษาซ้ำ', description: 'ขอรักษาอีกครั้งเมื่อกำเริบหลังจบการรักษา' },
      'hospital-transfer-application': { name: 'ใบขอย้ายโรงพยาบาล', description: 'แบบฟอร์มเมื่อต้องการย้ายโรงพยาบาล' },
      'additional-disease-application': { name: 'ใบขอเพิ่มโรค/บาดเจ็บ', description: 'ขอรับรองการบาดเจ็บเพิ่มเติมที่เพิ่งพบ' },
      'nursing-care-benefit-application': { name: 'ใบเบิกค่าดูแล', description: 'ขอค่าจ้างผู้ดูแลเมื่อช่วยเหลือตัวเองไม่ได้' },
      'concurrent-treatment-application': { name: 'ใบขอรักษาขนาน', description: 'ขอรักษาที่โรงพยาบาลอื่นไปพร้อมกัน' },
      'transportation-expense-application': { name: 'ใบเบิกค่าพาหนะ', description: 'ขอค่าเดินทางไปโรงพยาบาล' },
      'medical-opinion-certificate': { name: 'ใบรับรองแพทย์ (อุบัติเหตุ)', description: 'ความเห็นแพทย์เฉพาะทางสำหรับสมัคร' },
      'medical-records-copy': { name: 'สำเนาระเบียนประวัติแพทย์', description: 'บันทึกการรักษาทั้งหมดตั้งแต่เกิดเหตุ' },
      'medical-expense-detail': { name: 'ใบแจ้งหนี้ค่ารักษาโดยละเอียด', description: 'หลักฐานจำเป็นเพื่อขอคืนเงิน' },
      'disability-certificate': { name: 'ใบรับรองความพิการ', description: 'ประเมินความเสียหายถาวรของร่างกาย' },
      'medical-imaging-cd': { name: 'แผ่น CD MRI / X-ray', description: 'ข้อมูลภาพเพื่อยืนยันความพิการ' },
      'employer-confirmation': { name: 'ใบยืนยันจากนายจ้าง', description: 'นายจ้างยืนยันการเกิดอุบัติเหตุ (ไม่บังคับ)' },
      'settlement-judgment': { name: 'หนังสือสัญญาประนีประนอม', description: 'รายงานเงินชดเชยที่ได้รับจากบริษัท' },
    },
  },
  uz: {
    hero: {
      title: 'Murakkab hujjatlar, ReworkCare yordam beradi',
      description: 'Shakllardan tortib ko\'rsatmalargacha oson tushuntirilgan.',
    },
    ui: {
      tabs: {
        all: 'Hammasini ko\'rish',
        step1: '1. Ariza',
        step2: '2. Davolanish',
        step3: '3. Nogironlik',
        step4: '4. Qaytish',
      },
      search: {
        placeholder: 'Hujjat nomini qidiring...',
        result: '{n} ta hujjat topildi',
      },
      banner: {
        title: 'Ushbu bosqich uchun kerakli hujjatlar',
        desc: 'Jami {n} ta hujjat kerak.',
        button: 'Barcha hujjatlar',
      },
      sections: {
        write: 'O\'zingiz to\'ldiring',
        request: 'Berishni so\'rang',
        requestGuide: 'Bemor to\'ldirmaydi, shifoxona yoki shifokordan so\'raladi.',
      },
      badges: {
        hospital: 'Shifoxona',
        company: 'Kompaniya',
        court: 'Sud/Boshqa',
        other: 'Boshqa',
        optional: 'Ixtiyoriy',
      },
    },
    items: {
      'workplace-accident-application': { name: 'Dastlabki ariza', description: 'Baxtsiz hodisani tan oldirish uchun birinchi ariza.' },
      'accident-report': { name: 'Baxtsiz hodisa hisoboti', description: 'Hodisa qanday yuz berganini batafsil tushuntirish.' },
      'medical-benefit-application': { name: 'Davolanish pulini so\'rash', description: 'O\'zingiz to\'lagan xarajatlarni qaytarish arizasi.' },
      'sick-leave-benefit-application': { name: 'Ish haqi kompensatsiyasi', description: 'Ishlay olmagan davr uchun yashash xarajati.' },
      'disability-rating-application': { name: 'Nogironlik nafaqasi', description: 'Qolgan asoratlar uchun kompensatsiya arizasi.' },
      'employment-support-application': { name: 'Ish bilan ta\'minlash', description: 'Yangi ish yoki kasbiy ta\'lim yordami.' },
      're-treatment-application': { name: 'Qayta davolanish', description: 'Tugatilgandan keyin qayta davolanish arizasi.' },
      'hospital-transfer-application': { name: 'Shifoxonani o\'zgartirish', description: 'Boshqa shifoxonaga ko\'chish arizasi.' },
      'additional-disease-application': { name: 'Qo\'shimcha kasallik', description: 'Yangi aniqlangan jarohatni qo\'shish.' },
      'nursing-care-benefit-application': { name: 'Parvarish nafaqasi', description: 'Yordamga muhtoj bo\'lganda parvarish puli.' },
      'concurrent-treatment-application': { name: 'Parallel davolanish', description: 'Bir vaqtda boshqa shifoxonada davolanish.' },
      'transportation-expense-application': { name: 'Transport xarajati', description: 'Shifoxonaga borib kelish yo\'lkirasini so\'rash.' },
      'medical-opinion-certificate': { name: 'Tibbiy xulosa', description: 'Ariza uchun shifokorning professional xulosasi.' },
      'medical-records-copy': { name: 'Kasallik tarixi nusxasi', description: 'Barcha davolanish yozuvlari (nusxasi).' },
      'medical-expense-detail': { name: 'Batafsil hisob-kitob', description: 'Pulni qaytarish uchun kerakli batafsil chek.' },
      'disability-certificate': { name: 'Nogironlik ma\'lumotnomasi', description: 'Doimiy jarohat holatini baholash.' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: 'Nogironlikni tasdiqlovchi tasviriy dalillar.' },
      'employer-confirmation': { name: 'Ish beruvchi tasdig\'i', description: 'Hodisani ish beruvchi tasdiqlashi (Ixtiyoriy).' },
      'settlement-judgment': { name: 'Kelishuv/Hukm', description: 'Kompaniyadan olingan tovon puli haqida hisobot.' },
    },
  },
  mn: {
    hero: {
      title: 'Төвөгтэй бичиг баримт, ReworkCare тусална',
      description: 'Маягтаас эхлээд бөглөх заавар хүртэл хялбар.',
    },
    ui: {
      tabs: {
        all: 'Бүгдийг харах',
        step1: '1. Өргөдөл',
        step2: '2. Эмчилгээ',
        step3: '3. Бэрхшээл',
        step4: '4. Буцах',
      },
      search: {
        placeholder: 'Баримтын нэр хайх...',
        result: '{n} баримт олдлоо',
      },
      banner: {
        title: 'Энэ үе шатанд шаардлагатай баримтууд',
        desc: 'Нийт {n} баримт хэрэгтэй.',
        button: 'Бүх баримтыг харах',
      },
      sections: {
        write: 'Өөрөө бөглөнө үү',
        request: 'Олгохыг хүснэ үү',
        requestGuide: 'Өвчтөн бичихгүй, эмнэлэг/эмчээс авна.',
      },
      badges: {
        hospital: 'Эмнэлэг',
        company: 'Компани',
        court: 'Шүүх/Бусад',
        other: 'Бусад',
        optional: 'Сонголт',
      },
    },
    items: {
      'workplace-accident-application': { name: 'Анхны өргөдөл', description: 'Үйлдвэрлэлийн ослыг хүлээн зөвшөөрүүлэх анхны өргөдөл.' },
      'accident-report': { name: 'Ослын тайлан', description: 'Осол хэрхэн болсныг дэлгэрэнгүй тайлбарлах.' },
      'medical-benefit-application': { name: 'Эмчилгээний зардал', description: 'Өөрөө төлсөн эмчилгээний төлбөрийг буцаан авах.' },
      'sick-leave-benefit-application': { name: 'Амралтын тэтгэмж', description: 'Ажиллах боломжгүй үеийн амьжиргааны зардал.' },
      'disability-rating-application': { name: 'Тархины бэрхшээлийн тэтгэмж', description: 'Үлдсэн 후유증-д авах нөхөн төлбөр.' },
      'employment-support-application': { name: 'Ажил эрхлэлтийн дэмжлэг', description: 'Шинэ ажил эсвэл сургалтын дэмжлэг.' },
      're-treatment-application': { name: 'Дахин эмчилгээ', description: 'Эмчилгээ дууссаны дараа дахин эмчлүүлэх хүсэлт.' },
      'hospital-transfer-application': { name: 'Эмнэлэг шилжүүлэх', description: 'Эмнэлгээ солих хүсэлт.' },
      'additional-disease-application': { name: 'Нэмэлт өвчин', description: 'Шинээр илэрсэн гэмтлийг нэмж хүлээн зөвшөөрүүлэх.' },
      'nursing-care-benefit-application': { name: 'Асрамжийн тэтгэмж', description: 'Асрагч хэрэгтэй үед авах зардал.' },
      'concurrent-treatment-application': { name: 'Зэрэгцээ эмчилгээ', description: 'Өөр эмнэлэгт зэрэг эмчлүүлэх хүсэлт.' },
      'transportation-expense-application': { name: 'Тээврийн зардал', description: 'Эмнэлэгт очих зардлыг нэхэмжлэх.' },
      'medical-opinion-certificate': { name: 'Эмчийн дүгнэлт', description: 'Өргөдөл гаргахад эмчийн бичсэн мэргэжлийн санал.' },
      'medical-records-copy': { name: 'Өвчний түүхийн хуулбар', description: 'Осолдсоноос хойшх эмчилгээний бүх тэмдэглэл.' },
      'medical-expense-detail': { name: 'Төлбөрийн дэлгэрэнгүй', description: 'Мөнгөө буцааж авахад шаардлагатай баримт.' },
      'disability-certificate': { name: 'Бэрхшээлийн онош', description: 'Байнгын гэмтлийг үнэлэх баримт.' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: 'Гэмтлийг батлах дүрс бичлэгийн материал.' },
      'employer-confirmation': { name: 'Ажил олгогчийн баталгаа', description: 'Ослыг ажил олгогч баталгаажуулах (Сонголт).' },
      'settlement-judgment': { name: 'Тохиролцоо/Шийдвэр', description: 'Компаниас авсан төлбөрийг мэдээлэх.' },
    },
  },
  id: {
    hero: {
      title: 'Dokumen Rumit, ReworkCare Bantu Anda',
      description: 'Dari formulir hingga panduan, diatur agar mudah dipahami semua orang.',
    },
    ui: {
      tabs: {
        all: 'Lihat Semua',
        step1: '1. Aplikasi',
        step2: '2. Perawatan',
        step3: '3. Cacat',
        step4: '4. Kembali',
      },
      search: {
        placeholder: 'Cari nama dokumen...',
        result: 'Ditemukan {n} dokumen',
      },
      banner: {
        title: 'Dokumen Wajib Tahap Ini',
        desc: 'Total {n} dokumen dibutuhkan.',
        button: 'Lihat Semua',
      },
      sections: {
        write: 'Isi Sendiri',
        request: 'Minta Penerbitan',
        requestGuide: 'Bukan diisi pasien, tapi minta ke RS/dokter.',
      },
      badges: {
        hospital: 'Rumah Sakit',
        company: 'Perusahaan',
        court: 'Pengadilan',
        other: 'Lainnya',
        optional: 'Opsional',
      },
    },
    items: {
      'workplace-accident-application': { name: 'Aplikasi Awal', description: 'Formulir pertama untuk pengakuan kecelakaan kerja.' },
      'accident-report': { name: 'Laporan Kecelakaan', description: 'Penjelasan rinci tentang kejadian kecelakaan.' },
      'medical-benefit-application': { name: 'Klaim Biaya Medis', description: 'Klaim pengembalian biaya yang dibayar sendiri.' },
      'sick-leave-benefit-application': { name: 'Klaim Tunjangan Cuti', description: 'Biaya hidup selama tidak bisa bekerja.' },
      'disability-rating-application': { name: 'Klaim Cacat', description: 'Kompensasi untuk dampak permanen pasca perawatan.' },
      'employment-support-application': { name: 'Layanan Kerja', description: 'Dukungan cari kerja baru atau pelatihan.' },
      're-treatment-application': { name: 'Perawatan Ulang', description: 'Aplikasi perawatan lagi setelah kasus ditutup.' },
      'hospital-transfer-application': { name: 'Pindah Rumah Sakit', description: 'Aplikasi untuk pindah ke RS lain.' },
      'additional-disease-application': { name: 'Penyakit Tambahan', description: 'Menambahkan cedera yang baru ditemukan.' },
      'nursing-care-benefit-application': { name: 'Klaim Perawatan', description: 'Biaya perawat jika butuh bantuan aktivitas.' },
      'concurrent-treatment-application': { name: 'Perawatan Simultan', description: 'Berobat di dua RS sekaligus.' },
      'transportation-expense-application': { name: 'Biaya Transportasi', description: 'Klaim ongkos pergi ke rumah sakit.' },
      'medical-opinion-certificate': { name: 'Pendapat Medis', description: 'Opini profesional dokter untuk aplikasi.' },
      'medical-records-copy': { name: 'Salinan Rekam Medis', description: 'Catatan pengobatan lengkap dari kecelakaan.' },
      'medical-expense-detail': { name: 'Rincian Biaya', description: 'Bukti rinci untuk penggantian biaya.' },
      'disability-certificate': { name: 'Sertifikat Cacat', description: 'Evaluasi kerusakan tubuh permanen.' },
      'medical-imaging-cd': { name: 'CD MRI / X-ray', description: 'Bukti visual objektif untuk verifikasi cacat.' },
      'employer-confirmation': { name: 'Konfirmasi Majikan', description: 'Konfirmasi kecelakaan oleh majikan (Opsional).' },
      'settlement-judgment': { name: 'Penyelesaian/Putusan', description: 'Laporan uang kompensasi dari perusahaan.' },
    },
  },
  ne: {
    hero: {
      title: 'जटिल कागजात, ReworkCare ले सघाउँछ',
      description: 'फारमदेखि निर्देशनसम्म, सबैले बुझ्ने गरी मिलाइएको।',
    },
    ui: {
      tabs: {
        all: 'सबै हेर्नुहोस्',
        step1: '1. आवेदन',
        step2: '2. उपचार',
        step3: '3. अपाङ्गता',
        step4: '4. फिर्ती',
      },
      search: {
        placeholder: 'कागजात खोज्नुहोस्...',
        result: '{n} कागजात फेला पर्यो',
      },
      banner: {
        title: 'यस चरणका लागि आवश्यक कागजात',
        desc: 'जम्मा {n} कागजात आवश्यक।',
        button: 'सबै कागजात',
      },
      sections: {
        write: 'आफै भर्नुहोस्',
        request: 'जारी गर्न अनुरोध गर्नुहोस्',
        requestGuide: 'बिरामीले भर्ने होइन, अस्पताल/डाक्टरसँग माग्नुपर्छ।',
      },
      badges: {
        hospital: 'अस्पताल',
        company: 'कम्पनी',
        court: 'अदालत',
        other: 'अन्य',
        optional: 'ऐच्छिक',
      },
    },
    items: {
      'workplace-accident-application': { name: 'पहिलो आवेदन', description: 'औद्योगिक दुर्घटना स्वीकृतिको लागि पहिलो फारम।' },
      'accident-report': { name: 'दुर्घटना प्रतिवेदन', description: 'दुर्घटना कसरी भयो विस्तृत विवरण।' },
      'medical-benefit-application': { name: 'उपचार खर्च दाबी', description: 'आफैले तिरेको खर्च फिर्ता पाउन आवेदन।' },
      'sick-leave-benefit-application': { name: 'बिदा भत्ता दाबी', description: 'काम गर्न नसक्दाको जीवन निर्वाह खर्च।' },
      'disability-rating-application': { name: 'अपाङ्गता लाभ', description: 'उपचार पछि बाँकी समस्याको क्षतिपूर्ति।' },
      'employment-support-application': { name: 'रोजगार सहयोग', description: 'नयाँ काम वा तालिम सहयोग आवेदन।' },
      're-treatment-application': { name: 'पुन: उपचार', description: 'समाप्त भएपछि फेरि उपचार गर्न आवेदन।' },
      'hospital-transfer-application': { name: 'अस्पताल स्थानान्तरण', description: 'अर्को अस्पतालमा सर्ने आवेदन।' },
      'additional-disease-application': { name: 'थप रोग आवेदन', description: 'नयाँ पत्ता लागेको चोट थप्न।' },
      'nursing-care-benefit-application': { name: 'स्याहार खर्च', description: 'सहयोग चाहिने भएमा कुरुवा खर्च।' },
      'concurrent-treatment-application': { name: 'दुई ठाउँ उपचार', description: 'एकै साथ अर्को अस्पतालमा उपचार गर्न।' },
      'transportation-expense-application': { name: 'यातायात खर्च', description: 'अस्पताल जाँदाको भाडा दाबी।' },
      'medical-opinion-certificate': { name: 'चिकित्सीय राय', description: 'आवेदनको लागि डाक्टरको राय।' },
      'medical-records-copy': { name: 'मेडिकल रेकर्ड प्रतिलिपि', description: 'दुर्घटना देखिको सबै उपचार रेकर्ड।' },
      'medical-expense-detail': { name: 'विस्तृत बिल', description: 'पैसा फिर्ता पाउन आवश्यक विस्तृत बिल।' },
      'disability-certificate': { name: 'अपाङ्गता प्रमाणपत्र', description: 'शरीरको स्थायी क्षतिको मूल्याङ्कन।' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: 'अपाङ्गता पुष्टि गर्ने दृश्य प्रमाण।' },
      'employer-confirmation': { name: 'रोजगारदाता पुष्टि', description: 'मालिकद्वारा दुर्घटना पुष्टि (ऐच्छिक)।' },
      'settlement-judgment': { name: 'सम्झौता/फैसला', description: 'कम्पनीबाट पाएको क्षतिपूर्ति रिपोर्ट।' },
    },
  },
  hi: {
    hero: {
      title: 'जटिल दस्तावेज, ReworkCare संभालेगा',
      description: 'फॉर्म से लेकर निर्देशों तक, आसान समझ के लिए व्यवस्थित।',
    },
    ui: {
      tabs: {
        all: 'सभी देखें',
        step1: '1. आवेदन',
        step2: '2. उपचार',
        step3: '3. विकलांगता',
        step4: '4. वापसी',
      },
      search: {
        placeholder: 'दस्तावेज़ खोजें...',
        result: '{n} दस्तावेज़ मिले',
      },
      banner: {
        title: 'इस चरण के लिए आवश्यक दस्तावेज़',
        desc: 'कुल {n} दस्तावेज़ आवश्यक।',
        button: 'सभी दस्तावेज़',
      },
      sections: {
        write: 'स्वयं भरें',
        request: 'जारी करने का अनुरोध करें',
        requestGuide: 'रोगी नहीं भरता, अस्पताल/डॉक्टर से मांगें।',
      },
      badges: {
        hospital: 'अस्पताल',
        company: 'कंपनी',
        court: 'अदालत/अन्य',
        other: 'अन्य',
        optional: 'वैकल्पिक',
      },
    },
    items: {
      'workplace-accident-application': { name: 'पहला आवेदन', description: 'औद्योगिक दुर्घटना स्वीकृति के लिए पहला फॉर्म।' },
      'accident-report': { name: 'दुर्घटना रिपोर्ट', description: 'दुर्घटना कैसे हुई, इसका विस्तृत विवरण।' },
      'medical-benefit-application': { name: 'चिकित्सा व्यय दावा', description: 'स्वयं भुगतान किए गए खर्च की वापसी।' },
      'sick-leave-benefit-application': { name: 'अवकाश भत्ता दावा', description: 'काम न कर पाने पर निर्वाह भत्ता।' },
      'disability-rating-application': { name: 'विकलांगता लाभ', description: 'उपचार के बाद शेष प्रभावों का मुआवजा।' },
      'employment-support-application': { name: 'रोजगार सहायता', description: 'नई नौकरी या प्रशिक्षण सहायता आवेदन।' },
      're-treatment-application': { name: 'पुन: उपचार', description: 'समाप्ति के बाद फिर से इलाज का आवेदन।' },
      'hospital-transfer-application': { name: 'अस्पताल स्थानांतरण', description: 'दूसरे अस्पताल में जाने का आवेदन।' },
      'additional-disease-application': { name: 'अतिरिक्त रोग', description: 'नई खोजी गई चोट को जोड़ने के लिए।' },
      'nursing-care-benefit-application': { name: 'देखभाल भत्ता', description: 'सहायता की आवश्यकता होने पर देखभाल खर्च।' },
      'concurrent-treatment-application': { name: 'समवर्ती उपचार', description: 'एक साथ दूसरे अस्पताल में इलाज के लिए।' },
      'transportation-expense-application': { name: 'परिवहन व्यय', description: 'अस्पताल जाने का किराया दावा।' },
      'medical-opinion-certificate': { name: 'चिकित्सा राय', description: 'आवेदन के लिए डॉक्टर की पेशेवर राय।' },
      'medical-records-copy': { name: 'मेडिकल रिकॉर्ड कॉपी', description: 'दुर्घटना से अब तक का पूरा रिकॉर्ड।' },
      'medical-expense-detail': { name: 'विस्तृत बिल', description: 'पैसे वापसी के लिए आवश्यक विस्तृत रसीद।' },
      'disability-certificate': { name: 'विकलांगता प्रमाण पत्र', description: 'स्थायी शारीरिक क्षति का मूल्यांकन।' },
      'medical-imaging-cd': { name: 'MRI / X-ray CD', description: 'विकलांगता सत्यापित करने वाले दृश्य प्रमाण।' },
      'employer-confirmation': { name: 'नियोक्ता पुष्टि', description: 'मालिक द्वारा दुर्घटना की पुष्टि (वैकल्पिक)।' },
      'settlement-judgment': { name: 'समझौता/निर्णय', description: 'कंपनी से मिली क्षतिपूर्ति की रिपोर्ट।' },
    },
  },
};

export interface DashboardTranslation {
  header: {
    level: string;
    basedOn: string;
    greeting: string;
    guestGreeting: string;
    editProfile: string;
    stepNames: Record<number, string>;
    status: string;
    allProgress: string;
    remaining: string;
  };
  hero: {
    title: string;
    highlight: string;
    subtitle: string;
  };
  checklist: {
    title: string;
    remaining: string;
    complete: string;
    empty: string;
    items: Record<string, { title: string; description?: string }>;
  };
  documents: Record<string, string>;
  quickActions: {
    guestTitle: string;
    commonTitle: string;
    customerCenter: string;
    download: string;
    guide: string;
    hospitals: string;
    calculator: string;
    counseling: string;
    aiChat: string;
    transfer: string;
    sickLeave: string;
    disability: string;
    inquiry: string;
    returnCounseling: string;
    training: string;
    rehabApp: string;
    jobSupport: string;
    hospitalTransfer: string;
  };
  benefits: {
    title: string;
    postTreatmentTitle?: string;
    returnTitle?: string;
    viewAll: string;
    defaultTitle: string;
    items: Record<string, { question: string; answer: string }>;
  };
  curatedContent: {
    title: string;
    noRequiredDocuments: string;
    noticesTitle: string;
    noNotices: string;
  };
  communityWidget: {
    title: string;
    viewAll: string;
    injuryBoard: string;
    regionBoard: string;
    noticesTitle: string;
    noNotices: string;
  };
  videoCard: {
    noVideo: string;
    preparing: string;
    badges: {
      helpful: string;
      recommended: string;
      reference: string;
      personalized: string;
    };
  };
  statsWidget: {
    title: string;
    error: string;
    toggle: {
      accident: string;
      disease: string;
    };
    labels: {
      avgApproval: string;
      processingTime: string;
      treatmentDuration: string;
    };
    descriptions: {
      approval: string;
      processing: string;
      treatment: string;
    };
    noInfo: string;
  };

  guest: {
    banner: {
      mode: string;
      start: string;
    };
  };
  localResources: {
    title: string;
    loginTitle: string;
    loginDesc: string;
    loginBtn: string;
    setRegionTitle: string;
    setRegionDesc: string;
    setRegionBtn: string;
    changeRegion: string;
    dialogTitle: string;
    saveBtn: string;
    viewFullScreen: string;
    hospital: string;
    pharmacy: string;
    rehab: string;
    certified: string;
    countUnit: string;
  };

}

export const dashboardTranslations: Record<Locale, DashboardTranslation> = {
  ko: {
    header: {
      level: 'Level',
      basedOn: '기준',
      greeting: '안녕하세요, {name}님!',
      guestGreeting: '회원님!',
      status: '현재 {step}입니다.',
      allProgress: '전체 진행률',
      remaining: '완료까지 {pct}% 남음',
      editProfile: '프로필 이름 수정하기',
      stepNames: {
        0: '산재 신청 준비 단계',
        1: '산재 신청 준비 단계',
        2: '산재 치료 받는 중',
        3: '산재 치료 종결 단계',
        4: '종결 후 직업 복귀 단계',
      },
    },
    hero: {
      title: '복잡한 산재, ',
      highlight: '길잡이가 되어 드립니다',
      subtitle: '리워크케어가 개인 대시보드에 정리해 드립니다.',
    },
    guest: {
      banner: {
        mode: '현재 <strong>체험 모드</strong>입니다. 내 정보를 저장하고 맞춤형 가이드를 계속 받으시려면?',
        start: '3초 만에 시작하기',
      },
    },
    localResources: {
      title: '{name}님 지역 산재 치료기관',
      loginTitle: '로그인하고 병원 찾기',
      loginDesc: '로그인하면 우리 동네 산재 의료기관 <br/>지도를 바로 확인하실 수 있습니다.',
      loginBtn: '3초 만에 로그인하기',
      setRegionTitle: '우리 동네 설정하기',
      setRegionDesc: '현재 계신 곳 근처의 산재 지정 <br/>의료기관 정보를 실시간으로 알려드립니다.',
      setRegionBtn: '지역 설정하기',
      changeRegion: '지역 변경',
      dialogTitle: '지역 설정',
      saveBtn: '저장하고 확인하기',
      viewFullScreen: '전체 화면 보기',
      hospital: '산재 병원',
      pharmacy: '산재 약국',
      rehab: '재활기관',
      certified: '재활인증',
      countUnit: '건',
    },
    documents: {
      'workplace-accident-application': '산재 최초 신청서',
      'accident-report': '사고 경위서',
      'medical-benefit-application': '요양비 청구서',
      'sick-leave-benefit-application': '휴업급여 청구서',
      'disability-rating-application': '장해급여 청구서',
      'employment-support-application': '취업지원서비스 신청서',
      're-treatment-application': '재요양신청서',
      'hospital-transfer-application': '전원요양 신청서',
      'additional-disease-application': '추가상병 신청서',
      'nursing-care-benefit-application': '간병급여 청구서',
      'concurrent-treatment-application': '병행진료 신청서',
      'transportation-expense-application': '이송비 청구서',
      'medical-opinion-certificate': '산재용 소견서',
      'medical-records-copy': '의무기록사본',
      'medical-expense-detail': '진료비 상세 내역서',
      'disability-certificate': '장해진단서',
      'medical-imaging-cd': '영상자료(MRI/CT) CD',
      'employer-confirmation': '사업주 확인서',
      'settlement-judgment': '합의서/판결문',
    },
    checklist: {
      title: '단계별 필수 체크리스트',
      remaining: '{count}개 남음',
      complete: '완료',
      empty: '모든 할 일을 완료했습니다!',
      items: {
        'stage1-1': { title: '진료 시 "일하다 다쳤음" 말하기', description: '의무기록에 남겨야 유리합니다.' },
        'stage1-2': { title: '원무과에 "산재로 처리" 요청', description: '건강보험이 아닌 산재보험으로 접수하세요.' },
        'stage1-3': { title: '현장 사진·목격자 확보', description: '치우기 전에 빨리 찍어두세요.' },
        'stage1-5': { title: '요양급여신청서 제출', description: '근로복지공단에 사고를 알리는 서류입니다.' },
        'stage2-1': { title: '정기적으로 병원 방문하여 치료 지속하기', description: '치료를 중단하면 요양 중단 판정을 받을 수 있습니다.' },
        'stage2-2': { title: '매월 휴업급여 청구서 제출하기', description: '치료 기간 동안 매월 휴업급여를 청구하세요.' },
        'stage2-3': { title: '진료비 영수증 보관하기', description: '나중에 요양비 청구 시 필요할 수 있습니다.' },
        'stage2-4': { title: '치료 중 무단 근로 절대 금지', description: '무단 근로 적발 시 급여가 환수될 수 있습니다.' },
        'stage3-1': { title: '치료 종결 후 장해급여 청구 여부 결정', description: '영구적인 장해가 남았다면 장해급여를 청구하세요.' },
        'stage3-2': { title: '장해진단서 및 MRI/X-ray CD 준비', description: '영상 자료 없이는 심사가 불가능합니다.' },
        'stage3-3': { title: '간편심사로 장해 등급 확정', description: '장해급여 청구서를 제출하고 결과를 기다리세요.' },
        'stage3-4': { title: '불인정 시 이의 제기 준비', description: '등급이 낮거나 불인정되면 심사 청구를 고려하세요.' },
        'stage4-1': { title: '원직장 복귀 상담', description: '원래 직장으로 돌아갈 수 있는지 상담하세요.' },
        'stage4-2': { title: '새로운 직업 훈련 신청', description: '재활 훈련을 통해 새로운 직업을 준비하세요.' },
        'stage4-3': { title: '직업재활급여 신청서 제출', description: '직업 재활 지원을 받기 위한 신청서를 제출하세요.' },
        'stage4-4': { title: '재취업 지원 프로그램 참여', description: '공단의 재취업 지원 프로그램을 활용하세요.' },
      },
    },
    quickActions: {
      download: '서류 다운로드',
      guide: '산재 신청 가이드',
      hospitals: '병원 찾기',
      calculator: '급여 계산기',
      counseling: '심리 상담',
      aiChat: 'AI 산재 상담',
      transfer: '병원 옮기기',
      sickLeave: '휴업급여 청구',
      disability: '장해진단서 발급',
      inquiry: '심사 문의하기',
      returnCounseling: '원직장 복귀 상담',
      training: '직업 훈련 신청',
      rehabApp: '재활 신청',
      jobSupport: '취업 지원',
      hospitalTransfer: '병원 이송',
      guestTitle: '님께 필요한 추가 기능',
      commonTitle: '{name}님께 필요한 추가 기능',
      customerCenter: '고객센터',
    },
    benefits: {
      title: '치료받는 동안 받을 수 있는 지원금이에요',
      items: {
        TRANSPORT: { question: '교통비(이송비)', answer: '가까운 병원이 없어 먼 병원으로 다닐 때 교통비 지원' },
        TREATMENT: { question: '보조기구', answer: '휠체어, 보청기 등 신체 기능을 대신할 장비 구입비 지원' },
        SICK_LEAVE: { question: '휴업급여', answer: '일하지 못하는 기간 동안 평균임금의 70% 지급' },
        DISABILITY: { question: '장해급여', answer: '치료 후에도 장해가 남으면 등급에 따라 연금/일시금 지급' },
        NURSING: { question: '간병료', answer: '간병인이 필요하다는 소견이 있으면 간병 비용 지원' },
        REHAB: { question: '재활스포츠비', answer: '월 최대 60만원 한도로 스포츠 활동 비용 지원' },
        TRAINING_ALLOWANCE: { question: '직업훈련수당', answer: '새로운 일을 배울 때 월 최대 120만원 지원' },
        RETURN_GRANT: { question: '직장복귀지원금', answer: '원래 직장으로 복귀하면 월 최대 80만원 지원' },
        NURSING_POST: { question: '간병급여 (종결 후)', answer: '상시/수시 간병 비용 지원' },
        TRAINING_COST: { question: '직업훈련비용', answer: '1인당 최대 600만원 지원' },
      },
      postTreatmentTitle: '치료가 끝나도 보상은 계속돼요',
      returnTitle: '{name}님께 필요한 추가 지원',
      viewAll: '전체 혜택 보기',
      defaultTitle: '지금 알아야 하는 보상이에요',
    },
    curatedContent: {
      title: '{name}님께 필요한 서류들',
      noRequiredDocuments: '필요한 문서가 없습니다.',
      noticesTitle: '단계별 주의사항',
      noNotices: '특별한 주의사항이 없습니다.',
    },
    communityWidget: {
      title: '{name}님을 위한 커뮤니티',
      viewAll: '전체보기',
      injuryBoard: '{injury} 게시판',
      regionBoard: '{region} 게시판',
      noticesTitle: '공지사항',
      noNotices: '등록된 공지사항이 없습니다.',
    },
    videoCard: {
      noVideo: '관련된 영상이 없습니다.',
      preparing: '추천 영상 준비 중...',
      badges: {
        helpful: '도움 되는 영상',
        recommended: '강력 추천',
        reference: '참고',
        personalized: '맞춤 추천',
      },
    },
    statsWidget: {
      title: '{name}님과 유사한 분들의 치료 통계예요',
      error: '통계 데이터를 불러올 수 없습니다.',
      toggle: { accident: '사고', disease: '질병' },
      labels: {
        avgApproval: '평균 승인 확률',
        processingTime: '결과 소요 기간',
        treatmentDuration: '집중 치료 기간',
      },
      descriptions: {
        approval: '10명 중 {count}분이\n승인받으셨어요',
        processing: '접수 후 {time} 이상\n걸릴 수 있어요',
        treatment: '보통 {time} 동안\n회복에 집중해요',
      },
      noInfo: '정보 없음',
    },
  },
  en: {
    header: {
      level: 'Level',
      basedOn: 'As of',
      greeting: 'Hello, {name}!',
      guestGreeting: 'Guest!',
      status: 'Currently {step}.',
      allProgress: 'Total Progress',
      remaining: '{pct}% to completion',
      editProfile: 'Edit Profile Name',
      stepNames: {
        0: 'Preparation Stage',
        1: 'Preparation Stage',
        2: 'Under Treatment',
        3: 'Treatment Ending',
        4: 'Return to Work',
      },
    },
    hero: {
      title: 'Complex Claims? ',
      highlight: "We'll Guide You",
      subtitle: 'ReworkCare organizes everything on your personal dashboard.',
    },
    guest: {
      banner: {
        mode: 'You are currently in <strong>Guest Mode</strong>. To save progress and get personalized guides?',
        start: 'Start in 3 Seconds',
      },
    },
    localResources: {
      title: 'Hospitals near {name}',
      loginTitle: 'Log in to Find Hospitals',
      loginDesc: 'Log in to see the map of <br/>industrial accident hospitals near you.',
      loginBtn: 'Log in in 3 Seconds',
      setRegionTitle: 'Set Your Location',
      setRegionDesc: 'We inform you of designated <br/>hospitals near you in real-time.',
      setRegionBtn: 'Set Location',
      changeRegion: 'Change Region',
      dialogTitle: 'Set Location',
      saveBtn: 'Save and Check',
      viewFullScreen: 'View Full Screen',
      hospital: 'Hospital',
      pharmacy: 'Pharmacy',
      rehab: 'Rehab Center',
      certified: 'Certified',
      countUnit: '',
    },
    documents: {
      'workplace-accident-application': 'First Application',
      'accident-report': 'Accident Report',
      'medical-benefit-application': 'Medical Expense Claim',
      'sick-leave-benefit-application': 'Sick Leave Claim',
      'disability-rating-application': 'Disability Benefit Claim',
      'employment-support-application': 'Job Support Application',
      're-treatment-application': 'Re-Treatment Application',
      'hospital-transfer-application': 'Transfer Application',
      'additional-disease-application': 'Additional Disease Application',
      'nursing-care-benefit-application': 'Nursing Care Claim',
      'concurrent-treatment-application': 'Concurrent Treatment Claim',
      'transportation-expense-application': 'Transportation Expense Claim',
      'medical-opinion-certificate': 'Medical Opinion',
      'medical-records-copy': 'Medical Records Copy',
      'medical-expense-detail': 'Medical Expense Detail',
      'disability-certificate': 'Disability Certificate',
      'medical-imaging-cd': 'MRI/CT CD',
      'employer-confirmation': 'Employer Confirmation',
      'settlement-judgment': 'Settlement/Judgment',
    },
    checklist: {
      title: 'Step-by-Step Checklist',
      remaining: '{count} Remaining',
      complete: 'Complete',
      empty: 'All tasks complete!',
      items: {
        'stage1-1': { title: 'Mention "Work Injury" at Clinic', description: 'Crucial for medical records.' },
        'stage1-2': { title: 'Request "Industrial Accident Processing"', description: 'Apply via Accident Insurance, not Health.' },
        'stage1-3': { title: 'Secure Photos & Witnesses', description: 'Keep evidence before it is cleared.' },
        'stage1-5': { title: 'Submit Application', description: 'Form to notify KCOMWEL of accident.' },
        'stage2-1': { title: 'Visit Hospital Regularly', description: 'Stopping treatment may stop benefits.' },
        'stage2-2': { title: 'Claim Monthly Leave Benefit', description: 'Apply every month while under treatment.' },
        'stage2-3': { title: 'Keep Medical Receipts', description: 'Needed for reimbursement claims later.' },
        'stage2-4': { title: 'No Work Without Permission', description: 'Money will be clawed back if caught.' },
        'stage3-1': { title: 'Decide Disability Claim', description: 'Apply if permanent injury remains.' },
        'stage3-2': { title: 'Prepare Certificate & MRI/CD', description: 'Review impossible without imaging.' },
        'stage3-3': { title: 'Disability Grade Determination', description: 'Submit claim and await result.' },
        'stage3-4': { title: 'Prepare Appeal if Rejected', description: 'Consider appeal if grade is low.' },
        'stage4-1': { title: 'Consult Old Employer', description: 'Discuss returning to original job.' },
        'stage4-2': { title: 'Job Training Application', description: 'Prepare for new career via training.' },
        'stage4-3': { title: 'Rehab Benefit Application', description: 'Ask for vocational support.' },
        'stage4-4': { title: 'Join Re-employment Program', description: 'Use KCOMWEL support programs.' },
      },
    },
    quickActions: {
      download: 'Download Forms',
      guide: 'Application Guide',
      hospitals: 'Find Hospital',
      calculator: 'Calculator',
      counseling: 'Counseling',
      aiChat: 'AI Chat',
      transfer: 'Transfer Hospital',
      sickLeave: 'Claim Sick Pay',
      disability: 'Disability Cert',
      inquiry: 'Inquiry',
      returnCounseling: 'Return Counseling',
      training: 'Job Training',
      rehabApp: 'Rehab Application',
      jobSupport: 'Job Support',
      hospitalTransfer: 'Transfer Hospital',
      guestTitle: 'Quick Actions for ',
      commonTitle: 'Quick Actions for {name}',
      customerCenter: 'Customer Center',
    },
    benefits: {
      title: 'Benefits You Can Receive During Treatment',
      items: {
        TRANSPORT: { question: 'Transport', answer: 'Support for hospital travel costs' },
        TREATMENT: { question: 'Assistive Devices', answer: 'Wheelchair/Hearing aid actual cost' },
        SICK_LEAVE: { question: 'Sick Leave Benefit', answer: 'Pays 70% of average wage' },
        DISABILITY: { question: 'Disability Benefit', answer: 'Pension/Lump sum based on grade' },
        NURSING: { question: 'Nursing Fee', answer: 'Caregiver cost supported (conditions apply)' },
        REHAB: { question: 'Sports Support', answer: 'Max 600,000 KRW/month support' },
        TRAINING_ALLOWANCE: { question: 'Training Allowance', answer: 'Max 1.2M KRW/month support' },
        RETURN_GRANT: { question: 'Return Grant', answer: 'Max 800,000 KRW/month support' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      viewAll: 'View All Benefits',
      defaultTitle: 'Benefits you need to know now',
    },
    curatedContent: {
      title: 'Required Documents for {name}',
      noRequiredDocuments: 'No required documents for the current stage.',
      noticesTitle: 'Stage-specific Notices',
      noNotices: 'No special notices.',
    },
    communityWidget: {
      title: 'Community for {name}',
      viewAll: 'View All',
      injuryBoard: '{injury} Board',
      regionBoard: '{region} Board',
      noticesTitle: 'Notices',
      noNotices: 'No new notices.',
    },
    videoCard: {
      noVideo: 'No related videos found.',
      preparing: 'Preparing recommended video...',
      badges: {
        helpful: 'Helpful Video',
        recommended: 'Highly Recommended',
        reference: 'Reference',
        personalized: 'For You',
      },
    },
    statsWidget: {
      title: 'Treatment statistics for people like {name}',
      error: 'Cannot load statistics.',
      toggle: { accident: 'Accident', disease: 'Disease' },
      labels: {
        avgApproval: 'Avg. Approval Rate',
        processingTime: 'Processing Time',
        treatmentDuration: 'Intensive Treatment',
      },
      descriptions: {
        approval: '{count} out of 10 people\nare approved',
        processing: 'It may take\n{time} or more',
        treatment: 'Typically focus on recovery\nfor {time}',
      },
      noInfo: 'No Info',
    },
  },
  zh: {
    header: {
      level: '等级',
      basedOn: '截至',
      greeting: '你好, {name}!',
      guestGreeting: '访客!',
      status: '当前是{step}。',
      allProgress: '总进度',
      remaining: '距离完成还剩 {pct}%',
      editProfile: '修改个人资料名称',
      stepNames: {
        0: '工伤申请准备阶段',
        1: '工伤申请准备阶段',
        2: '工伤治疗中',
        3: '治疗终结阶段',
        4: '复工阶段',
      },
    },
    hero: {
      title: '复杂的工伤, ',
      highlight: '我们为您导航',
      subtitle: 'ReworkCare 在您的个人仪表板上整理一切。',
    },
    guest: {
      banner: {
        mode: '您当前处于<strong>体验模式</strong>。想要保存信息并继续获取定制指南吗？',
        start: '3秒开启',
      },
    },
    localResources: {
      title: '{name}附近的工伤指定医疗机构',
      loginTitle: '登录以查找医院',
      loginDesc: '登录后即可立即查看<br/>附近的工伤医疗机构地图。',
      loginBtn: '3秒快速登录',
      setRegionTitle: '设置我的位置',
      setRegionDesc: '我们将实时为您提供您所在位置附近的<br/>工伤指定医疗机构信息。',
      setRegionBtn: '设置位置',
      changeRegion: '更改位置',
      dialogTitle: '位置设置',
      saveBtn: '保存并查看',
      viewFullScreen: '查看全屏',
      hospital: '工伤医院',
      pharmacy: '工伤药房',
      rehab: '康复机构',
      certified: '康复认证',
      countUnit: '家',
    },
    documents: {
      'workplace-accident-application': '首次申请书',
      'accident-report': '事故经过书',
      'medical-benefit-application': '疗养费申请书',
      'sick-leave-benefit-application': '休业给付申请书',
      'disability-rating-application': '伤残给付申请书',
      'employment-support-application': '就业支援申请书',
      're-treatment-application': '再疗养申请书',
      'hospital-transfer-application': '转院申请书',
      'additional-disease-application': '追加伤病申请书',
      'nursing-care-benefit-application': '护理给付申请书',
      'concurrent-treatment-application': '并行诊疗申请书',
      'transportation-expense-application': '移送费申请书',
      'medical-opinion-certificate': '工伤所见书',
      'medical-records-copy': '医疗记录复印件',
      'medical-expense-detail': '诊疗费详细清单',
      'disability-certificate': '伤残诊断书',
      'medical-imaging-cd': '影像资料(MRI/CT) CD',
      'employer-confirmation': '雇主确认书',
      'settlement-judgment': '协议书/判决书',
    },
    checklist: {
      title: '分步清单',
      remaining: '剩 {count} 项',
      complete: '完成',
      empty: '所有任务已完成！',
      items: {
        'stage1-1': { title: '就诊时说明"工伤"', description: '对医疗记录至关重要。' },
        'stage1-2': { title: '要求院方"按工伤处理"', description: '通过工伤保险而非健康保险申请。' },
        'stage1-3': { title: '确保照片和目击者', description: '在清理前拍照留证。' },
        'stage1-5': { title: '提交疗养申请', description: '向劳动福利公团通报事故。' },
        'stage2-1': { title: '定期去医院治疗', description: '中断治疗可能导致福利用终止。' },
        'stage2-2': { title: '每月申请休业给付', description: '治疗期间每月申请津贴。' },
        'stage2-3': { title: '保管医疗收据', description: '日后报销所需。' },
        'stage2-4': { title: '治疗期间严禁工作', description: '如被发现工作，津贴将被收回。' },
        'stage3-1': { title: '决定是否申请伤残给付', description: '如有永久伤残，请申请。' },
        'stage3-2': { title: '准备伤残诊断书及MRI/CD', description: '无影像资料无法审核。' },
        'stage3-3': { title: '确定伤残等级', description: '提交申请并等待结果。' },
        'stage3-4': { title: '被驳回时准备异议', description: '如等级低或被驳回，考虑申诉。' },
        'stage4-1': { title: '咨询原职复工', description: '商讨返回原单位。' },
        'stage4-2': { title: '申请职业培训', description: '通过康复培训准备新工作。' },
        'stage4-3': { title: '申请职业康复给付', description: '申请职业支持。' },
        'stage4-4': { title: '参加再就业支援项目', description: '利用公团支援项目。' },
      },
    },
    quickActions: {
      download: '下载表格',
      guide: '申请指南',
      hospitals: '找医院',
      calculator: '计算器',
      counseling: '心理咨询',
      aiChat: 'AI咨询',
      transfer: '转院',
      sickLeave: '申请休业给付',
      disability: '伤残诊断书',
      inquiry: '审查咨询',
      returnCounseling: '复工咨询',
      training: '职业培训',
      rehabApp: '康复申请',
      jobSupport: '就业支援',
      hospitalTransfer: '转院',
      guestTitle: '为您准备的附加功能',
      commonTitle: '{name}为您准备的附加功能',
      customerCenter: '客户中心',
    },
    benefits: {
      title: '治疗期间可获得的支援金',
      items: {
        TRANSPORT: { question: '移送费 (交通费)', answer: '支援医院往返交通费' },
        TREATMENT: { question: '康复辅助器具', answer: '支援轮椅/助听器等实际费用' },
        SICK_LEAVE: { question: '休业津贴 (生活费)', answer: '支付平均工资的 70%' },
        DISABILITY: { question: '残疾津贴 (补偿金)', answer: '按残疾等级支付年金/一次性付款' },
        NURSING: { question: '护理津贴 (终结后)', answer: '支援经常/随时护理费用' },
        REHAB: { question: '康复体育支援', answer: '每月最多支援 60万韩元' },
        TRAINING_ALLOWANCE: { question: '职业培训津贴', answer: '每月最多支援 120万韩元' },
        RETURN_GRANT: { question: '复职支援金', answer: '每月最多支援 80万韩元' },
        NURSING_POST: { question: '护理津贴 (终结后)', answer: '支援经常/随时护理费用' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: '查看所有工伤赔偿',
      defaultTitle: '您现在需要了解的赔偿',
    },
    curatedContent: {
      title: '{name}需准备的材料',
      noRequiredDocuments: '当前阶段无需准备必填材料。',
      noticesTitle: '阶段注意事项',
      noNotices: '无特殊注意事项。',
    },
    communityWidget: {
      title: '为{name}准备的社区',
      viewAll: '查看全部',
      injuryBoard: '{injury} 版块',
      regionBoard: '{region} 版块',
      noticesTitle: '公告',
      noNotices: '暂无公告。',
    },
    videoCard: {
      noVideo: '没有相关视频。',
      preparing: '正在准备推荐视频...',
      badges: {
        helpful: '有帮助的视频',
        recommended: '强烈推荐',
        reference: '参考',
        personalized: '为您推荐',
      },
    },
    statsWidget: {
      title: '像{name}这样的人的治疗统计',
      error: '无法加载统计数据。',
      toggle: { accident: '事故', disease: '疾病' },
      labels: {
        avgApproval: '平均批准率',
        processingTime: '结果处理期间',
        treatmentDuration: '集中治疗期间',
      },
      descriptions: {
        approval: '10人中有{count}人\n获得批准',
        processing: '受理后可能需要\n{time}以上',
        treatment: '通常专注于康复\n{time}',
      },
      noInfo: '无信息',
    },
  },
  vi: {
    header: {
      level: 'Cấp độ',
      basedOn: 'Tính đến',
      greeting: 'Xin chào, {name}!',
      guestGreeting: 'Khách!',
      status: 'Hiện tại là {step}.',
      allProgress: 'Tổng tiến độ',
      remaining: 'Còn {pct}% để hoàn thành',
      editProfile: 'Sửa tên hồ sơ',
      stepNames: {
        0: 'Giai đoạn chuẩn bị',
        1: 'Giai đoạn chuẩn bị',
        2: 'Đang điều trị',
        3: 'Kết thúc điều trị',
        4: 'Trở lại làm việc',
      },
    },
    hero: {
      title: 'Tai nạn phức tạp, ',
      highlight: 'Chúng tôi sẽ hướng dẫn bạn',
      subtitle: 'ReworkCare sắp xếp mọi thứ trên bảng điều khiển cá nhân của bạn.',
    },
    documents: {},
    checklist: {
      title: 'Danh sách kiểm tra',
      remaining: 'còn {count}',
      complete: 'Hoàn thành',
      empty: 'Đã xong mọi việc!',
      items: {
        'stage1-1': { title: 'Nói "Tai nạn lao động" khi khám', description: 'Quan trọng cho hồ sơ y tế.' },
        'stage1-2': { title: 'Yêu cầu "Xử lý tai nạn lao động"', description: 'Đăng ký qua Bảo hiểm TNLĐ.' },
        'stage1-3': { title: 'Chụp ảnh & Nhân chứng', description: 'Lưu bằng chứng trước khi bị dọn dẹp.' },
        'stage1-5': { title: 'Nộp đơn xin cấp phép', description: 'Thông báo tai nạn cho KCOMWEL.' },
        'stage2-1': { title: 'Khám bệnh định kỳ', description: 'Ngừng điều trị có thể bị cắt quyền lợi.' },
        'stage2-2': { title: 'Yêu cầu trợ cấp nghỉ việc hàng tháng', description: 'Nộp đơn mỗi tháng.' },
        'stage2-3': { title: 'Giữ hóa đơn y tế', description: 'Cần thiết để hoàn trả sau này.' },
        'stage2-4': { title: 'Cấm làm việc không phép', description: 'Sẽ bị thu hồi tiền nếu bị phát hiện.' },
        'stage3-1': { title: 'Quyết định yêu cầu trợ cấp thương tật', description: 'Yêu cầu nếu còn di chứng vĩnh viễn.' },
        'stage3-2': { title: 'Chuẩn bị chứng nhận & MRI/CD', description: 'Không thể xét duyệt nếu thiếu hình ảnh.' },
        'stage3-3': { title: 'Xác định cấp độ thương tật', description: 'Nộp đơn và chờ kết quả.' },
        'stage3-4': { title: 'Chuẩn bị khiếu nại nếu bị từ chối', description: 'Xem xét khiếu nại nếu cấp độ thấp.' },
        'stage4-1': { title: 'Tư vấn trở lại việc cũ', description: 'Thảo luận về việc quay lại công ty.' },
        'stage4-2': { title: 'Đăng ký đào tạo nghề', description: 'Chuẩn bị nghề mới qua đào tạo.' },
        'stage4-3': { title: 'Nộp đơn xin trợ cấp phục hồi nghề nghiệp', description: 'Nộp đơn xin hỗ trợ phục hồi nghề nghiệp.' },
        'stage4-4': { title: 'Tham gia chương trình hỗ trợ tái việc làm', description: 'Tận dụng chương trình hỗ trợ tái việc làm của KCOMWEL.' },
      },
    },
    quickActions: {
      download: 'Tải xuống tài liệu',
      guide: 'Hướng dẫn xin TNLĐ',
      hospitals: 'Tìm bệnh viện',
      calculator: 'Máy tính trợ cấp',
      counseling: 'Tư vấn tâm lý',
      aiChat: 'Tư vấn AI',
      transfer: 'Chuyển viện',
      sickLeave: 'Yêu cầu nghỉ ốm',
      disability: 'Chứng nhận thương tật',
      inquiry: 'Yêu cầu',
      returnCounseling: 'Tư vấn trở lại',
      training: 'Đào tạo nghề',
      rehabApp: 'Đơn phục hồi',
      jobSupport: 'Hỗ trợ việc làm',
      hospitalTransfer: 'Chuyển viện',
      guestTitle: 'Tính năng Khách',
      commonTitle: 'Tính năng cho {name}',
      customerCenter: 'Trung tâm hỗ trợ',
    },
    benefits: {
      title: 'Trợ cấp bạn có thể nhận được trong quá trình điều trị',
      items: {
        TRANSPORT: { question: 'Chi phí vận chuyển', answer: 'Hỗ trợ chi phí đi lại bệnh viện' },
        TREATMENT: { question: 'Dụng cụ hỗ trợ', answer: 'Hỗ trợ chi phí xe lăn/máy trợ thính v.v.' },
        SICK_LEAVE: { question: 'Trợ cấp nghỉ việc', answer: 'Chi trả 70% mức lương trung bình' },
        DISABILITY: { question: 'Trợ cấp thương tật', answer: 'Chi trả lương hưu/một lần theo cấp độ' },
        NURSING: { question: 'Trợ cấp điều dưỡng', answer: 'Hỗ trợ chi phí điều dưỡng' },
        REHAB: { question: 'Hỗ trợ thể thao', answer: 'Hỗ trợ tối đa 600,000 KRW/tháng' },
        TRAINING_ALLOWANCE: { question: 'Trợ cấp đào tạo', answer: 'Hỗ trợ tối đa 1.2 triệu KRW/tháng' },
        RETURN_GRANT: { question: 'Trợ cấp quay lại làm việc', answer: 'Hỗ trợ tối đa 800,000 KRW/tháng' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'Xem tất cả quyền lợi',
      defaultTitle: 'Quyền lợi cần biết ngay',
    },
    curatedContent: {
      title: 'Tài liệu cần thiết cho {name}',
      noRequiredDocuments: 'Không có tài liệu cần thiết cho giai đoạn này.',
      noticesTitle: 'Thông báo theo giai đoạn',
      noNotices: 'Không có thông báo đặc biệt.',
    },
    communityWidget: {
      title: 'Cộng đồng dành cho {name}',
      viewAll: 'Xem tất cả',
      injuryBoard: 'Bảng {injury}',
      regionBoard: 'Bảng {region}',
      noticesTitle: 'Thông báo',
      noNotices: 'Không có thông báo mới.',
    },
    videoCard: {
      noVideo: 'Không có video liên quan.',
      preparing: 'Đang chuẩn bị video...',
      badges: {
        helpful: 'Video hữu ích',
        recommended: 'Rất khuyến khích',
        reference: 'Tham khảo',
        personalized: 'Dành cho bạn',
      },
    },
    statsWidget: {
      title: 'Thống kê điều trị của những người giống {name}',
      error: 'Không thể tải thống kê.',
      toggle: { accident: 'Tai nạn', disease: 'Bệnh tật' },
      labels: {
        avgApproval: 'Tỷ lệ phê duyệt trung bình',
        processingTime: 'Thời gian xử lý',
        treatmentDuration: 'Thời gian điều trị',
      },
      descriptions: {
        approval: '{count} trong số 10 người\nđã được phê duyệt',
        processing: 'Có thể mất hơn\n{time} kể từ khi tiếp nhận',
        treatment: 'Thường tập trung vào phục hồi trong\n{time}',
      },
      noInfo: 'Không có thông tin',
    },
    guest: {
      banner: {
        mode: 'Chế độ khách',
        start: 'Bắt đầu',
      },
    },
    localResources: {
      title: 'Tài nguyên tại địa phương {name}',
      loginTitle: 'Vui lòng đăng nhập',
      loginDesc: 'Đăng nhập để xem tài nguyên tại địa phương của bạn.',
      loginBtn: 'Đăng nhập',
      setRegionTitle: 'Thiết lập vùng',
      setRegionDesc: 'Vui lòng thiết lập vùng của bạn.',
      setRegionBtn: 'Thiết lập',
      changeRegion: 'Thay đổi vùng',
      dialogTitle: 'Chọn vùng',
      saveBtn: 'Lưu',
      viewFullScreen: 'Xem toàn màn hình',
      hospital: 'Bệnh viện',
      pharmacy: 'Nhà thuốc',
      rehab: 'Phục hồi',
      certified: 'Chứng nhận',
      countUnit: 'Đơn vị',
    },
  },
  th: {
    header: {
      level: 'ระดับ',
      basedOn: 'ณ วันที่',
      greeting: 'สวัสดี, {name}!',
      guestGreeting: 'ผู้มาเยือน!',
      status: 'ปัจจุบันคือ {step}',
      allProgress: 'ความคืบหน้าทั้งหมด',
      remaining: 'เหลืออีก {pct}%',
      editProfile: 'แก้ไขชื่อโปรไฟล์',
      stepNames: {
        0: 'ระยะเตรียมการ',
        1: 'ระยะเตรียมการ',
        2: 'ระหว่างการรักษา',
        3: 'สรุปการรักษา',
        4: 'กลับเข้าทำงาน',
      },
    },
    hero: {
      title: 'เคลมซับซ้อน, ',
      highlight: 'เราจะเป็นแนวทางให้คุณ',
      subtitle: 'ReworkCare จัดระเบียบทุกอย่างบนแดชบอร์ดส่วนตัวของคุณ',
    },
    guest: {
      banner: {
        mode: 'คุณอยู่ใน<strong>โหมดผู้เยี่ยมชม</strong> ต้องการบันทึกข้อมูลและรับคำแนะนำเฉพาะบุคคลหรือไม่?',
        start: 'เริ่มใน 3 วินาที',
      },
    },
    localResources: {
      title: 'โรงพยาบาลใกล้คุณ {name}',
      loginTitle: 'เข้าสู่ระบบเพื่อค้นหาโรงพยาบาล',
      loginDesc: 'เข้าสู่ระบบเพื่อดูแผนที่<br/>โรงพยาบาลอุบัติเหตุอุตสาหกรรมใกล้คุณ',
      loginBtn: 'เข้าสู่ระบบใน 3 วินาที',
      setRegionTitle: 'ตั้งค่าตำแหน่งของคุณ',
      setRegionDesc: 'เราแจ้งข้อมูลโรงพยาบาล<br/>ที่กำหนดใกล้คุณแบบเรียลไทม์',
      setRegionBtn: 'ตั้งค่าตำแหน่ง',
      changeRegion: 'เปลี่ยนตำแหน่ง',
      dialogTitle: 'ตั้งค่าตำแหน่ง',
      saveBtn: 'บันทึกและตรวจสอบ',
      viewFullScreen: 'ดูเต็มหน้าจอ',
      hospital: 'โรงพยาบาล',
      pharmacy: 'ร้านขายยา',
      rehab: 'ศูนย์ฟื้นฟู',
      certified: 'ได้รับการรับรอง',
      countUnit: 'แห่ง',
    },
    documents: {
      'workplace-accident-application': 'ใบสมัครครั้งแรก',
      'accident-report': 'รายงานอุบัติเหตุ',
      'medical-benefit-application': 'เบิกค่ารักษาพยาบาล',
      'sick-leave-benefit-application': 'เบิกค่าชดเชยหยุดงาน',
      'disability-rating-application': 'เบิกค่าทดแทนความพิการ',
      'employment-support-application': 'ใบสมัครสนับสนุนการจ้างงาน',
      're-treatment-application': 'ใบสมัครรักษาซ้ำ',
      'hospital-transfer-application': 'ใบสมัครย้ายโรงพยาบาล',
      'additional-disease-application': 'ใบสมัครโรคเพิ่มเติม',
      'nursing-care-benefit-application': 'เบิกค่าดูแลพยาบาล',
      'concurrent-treatment-application': 'ใบสมัครรักษาควบคู่',
      'transportation-expense-application': 'เบิกค่าเดินทาง',
      'medical-opinion-certificate': 'ความเห็นแพทย์',
      'medical-records-copy': 'สำเนาเวชระเบียน',
      'medical-expense-detail': 'รายละเอียดค่ารักษาพยาบาล',
      'disability-certificate': 'ใบรับรองความพิการ',
      'medical-imaging-cd': 'แผ่น CD ภาพถ่าย (MRI/CT)',
      'employer-confirmation': 'หนังสือรับรองนายจ้าง',
      'settlement-judgment': 'ข้อตกลง/คำพิพากษา',
    },
    checklist: {
      title: 'เช็คลิสต์ทีละขั้นตอน',
      remaining: 'เหลือ {count} รายการ',
      complete: 'เสร็จสมบูรณ์',
      empty: 'เสร็จสิ้นทุกภารกิจ!',
      items: {
        'stage1-1': { title: 'แจ้ง "เจ็บจากงาน" เมื่อพบแพทย์', description: 'สำคัญต่อประวัติทางการแพทย์' },
        'stage1-2': { title: 'ขอ "ดำเนินการประกันสังคม"', description: 'ยื่นผ่านประกันอุบัติเหตุ ไม่ใช่ประกันสุขภาพ' },
        'stage1-3': { title: 'เก็บภาพถ่ายและหาพยาน', description: 'เก็บหลักฐานก่อนถูกเก็บกวาด' },
        'stage1-5': { title: 'ยื่นใบคำร้อง', description: 'แบบฟอร์มแจ้งอุบัติเหตุต่อ KCOMWEL' },
        'stage2-1': { title: 'ไปโรงพยาบาลสม่ำเสมอ', description: 'หยุดรักษาอาจถูกตัดสิทธิ์' },
        'stage2-2': { title: 'เบิกเงินทดแทนการหยุดงานทุกเดือน', description: 'ยื่นขอทุกเดือนระหว่างรักษา' },
        'stage2-3': { title: 'เก็บใบเสร็จค่ารักษา', description: 'จำเป็นสำหรับการเบิกคืนภายหลัง' },
        'stage2-4': { title: 'ห้ามทำงานโดยไม่ได้รับอนุญาต', description: 'จะถูกเรียกเงินคืนหากถูกจับได้' },
        'stage3-1': { title: 'ตัดสิินใจขอเงินทดแทนความพิการ', description: 'ยื่นขอหากมีความพิการถาวร' },
        'stage3-2': { title: 'เตรียมใบรับรองความพิการ & MRI', description: 'ตรวจสอบไม่ได้หากไม่มีภาพถ่าย' },
        'stage3-3': { title: 'กำหนดระดับความพิการ', description: 'ยื่นคำร้องและรอผล' },
        'stage3-4': { title: 'เตรียมอุทธรณ์หากถูกปฏิเสธ', description: 'พิจารณาอุทธรณ์หากได้ระดับต่ำ' },
        'stage4-1': { title: 'ปรึกษานายจ้างเดิม', description: 'หารือเรื่องกลับไปทำงานเดิม' },
        'stage4-2': { title: 'สมัครฝึกอาชีพ', description: 'เตรียมสู่อาชีพใหม่ผ่านการฝึกอบรม' },
        'stage4-3': { title: 'ยื่นขอสวัสดิการฟื้นฟู', description: 'ขอรับการสนับสนุนด้านอาชีพ' },
        'stage4-4': { title: 'เข้าร่วมโปรแกรมช่วยหางาน', description: 'ใช้โปรแกรมสนับสนุนของ KCOMWEL' },
      },
    },
    quickActions: {
      download: 'ดาวน์โหลดแบบฟอร์ม',
      guide: 'คู่มือสมัคร',
      hospitals: 'หาโรงพยาบาล',
      calculator: 'เครื่องคำนวณ',
      counseling: 'การปรึกษา',
      aiChat: 'แชท AI',
      transfer: 'ย้ายโรงพยาบาล',
      sickLeave: 'เบิกค่าหยุดงาน',
      disability: 'ใบรับรองความพิการ',
      inquiry: 'สอบถาม',
      returnCounseling: 'ปรึกษากลับทำงาน',
      training: 'ฝึกอาชีพ',
      rehabApp: 'สมัครฟื้นฟู',
      jobSupport: 'ช่วยหางาน',
      hospitalTransfer: 'ย้ายโรงพยาบาล',
      guestTitle: 'ฟังก์ชันเพิ่มเติมสำหรับ',
      commonTitle: 'ฟังก์ชันเพิ่มเติมสำหรับ {name}',
      customerCenter: 'ศูนย์บริการลูกค้า',
    },
    benefits: {
      title: 'สิทธิประโยชน์ที่คุณสามารถได้รับระหว่างการรักษา',
      items: {
        TRANSPORT: { question: 'ค่าพาหนะ', answer: 'สนับสนุนค่าเดินทางไปโรงพยาบาล' },
        TREATMENT: { question: 'อุปกรณ์ช่วย', answer: 'สนับสนุนค่ารถเข็น/เครื่องช่วยฟัง ฯลฯ' },
        SICK_LEAVE: { question: 'เงินทดแทนการขาดรายได้', answer: 'จ่าย 70% ของค่าจ้างเฉลี่ย' },
        DISABILITY: { question: 'เงินทดแทนกรณีทุพพลภาพ', answer: 'จ่ายเงินบำนาญ/เงินก้อนตามระดับ' },
        NURSING: { question: 'ค่าการพยาบาล', answer: 'สนับสนุนค่าผู้ดูแล' },
        REHAB: { question: 'สนับสนุนกีฬาฟื้นฟู', answer: 'สนับสนุนสูงสุด 600,000 วอน/เดือน' },
        TRAINING_ALLOWANCE: { question: 'เบี้ยเลี้ยงการฝึกอาชีพ', answer: 'สนับสนุนสูงสุด 1.2 ล้านวอน/เดือน' },
        RETURN_GRANT: { question: 'เงินสนับสนุนการกลับเข้าทำงาน', answer: 'สนับสนุนสูงสุด 800,000 วอน/เดือน' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'ดูสิทธิประโยชน์ทั้งหมด',
      defaultTitle: 'สิทธิประโยชน์ที่คุณควรรู้ตอนนี้',
    },
    curatedContent: {
      title: 'เอกสารที่จำเป็นสำหรับ {name}',
      noRequiredDocuments: 'ไม่มีเอกสารที่จำเป็นสำหรับขั้นตอนนี้',
      noticesTitle: 'ข้อควรระวังตามขั้นตอน',
      noNotices: 'ไม่มีข้อควรระวังพิเศษ',
    },
    communityWidget: {
      title: 'ชุมชนสำหรับ {name}',
      viewAll: 'ดูทั้งหมด',
      injuryBoard: 'บอร์ด {injury}',
      regionBoard: 'บอร์ด {region}',
      noticesTitle: 'ประกาศ',
      noNotices: 'ไม่มีประกาศใหม่',
    },
    videoCard: {
      noVideo: 'ไม่พบวิดีโอที่เกี่ยวข้อง',
      preparing: 'กำลังเตรียมวิดีโอแนะนำ...',
      badges: {
        helpful: 'วิดีโอที่เป็นประโยชน์',
        recommended: 'แนะนำเป็นอย่างยิ่ง',
        reference: 'อ้างอิง',
        personalized: 'สำหรับคุณ',
      },
    },
    statsWidget: {
      title: 'สถิติการรักษาสำหรับผู้ที่เหมือน {name}',
      error: 'ไม่สามารถโหลดสถิติได้',
      toggle: { accident: 'อุบัติเหตุ', disease: 'โรค' },
      labels: {
        avgApproval: 'อัตราการอนุมัติเฉลี่ย',
        processingTime: 'เวลาดำเนินการ',
        treatmentDuration: 'ระยะเวลาการรักษาเข้มข้น',
      },
      descriptions: {
        approval: '{count} จาก 10 คน\nได้รับการอนุมัติ',
        processing: 'อาจใช้เวลา\n{time} หรือมากกว่า',
        treatment: 'โดยปกติเน้นการฟื้นฟู\n{time}',
      },
      noInfo: 'ไม่มีข้อมูล',
    },
  },
  uz: {
     header: {
      level: 'Daraja',
      basedOn: 'Holatiga ko‘ra',
      greeting: 'Salom, {name}!',
      guestGreeting: 'Mehmon!',
      status: 'Hozirda {step}.',
      allProgress: 'Jami taraqqiyot',
      remaining: 'Tugatishgacha {pct}% qoldi',
      editProfile: 'Profil nomini tahrirlash',
      stepNames: {
        0: 'Tayyorgarlik bosqichi',
        1: 'Tayyorgarlik bosqichi',
        2: 'Davolanish jarayoni',
        3: 'Davolanish yakuni',
        4: 'Ishga qaytish',
      },
    },
    hero: {
      title: 'Murakkab da’volar, ',
      highlight: 'Biz sizga yo‘l ko‘rsatamiz',
      subtitle: 'ReworkCare shaxsiy panelingizda hammasini tartibga soladi.',
    },
    guest: {
      banner: {
        mode: 'Siz hozir <strong>Mehmon rejimasidasiz</strong>. Ma\'lumotlarni saqlash va shaxsiy qo\'llanmalarni olishni xohlaysizmi?',
        start: '3 soniyada boshlash',
      },
    },
    localResources: {
      title: '{name} yaqinidagi shifoxonalar',
      loginTitle: 'Shifoxona topish uchun kiring',
      loginDesc: 'Login qiling va yaqin oradagi<br/>sanoat baxtsiz hodisalari shifoxonalari xaritasini ko\'ring.',
      loginBtn: '3 soniyada kirish',
      setRegionTitle: 'Joylashuvingizni o\'rnating',
      setRegionDesc: 'Sizga yaqin joylashgan belgilangan<br/>shifoxonalar haqida real vaqtda xabar beramiz.',
      setRegionBtn: 'Joylashuvni o\'rnating',
      changeRegion: 'Joylashuvni o\'zgartirish',
      dialogTitle: 'Joylashuvni o\'rnating',
      saveBtn: 'Saqlash va tekshirish',
      viewFullScreen: 'To\'liq ekranni ko\'rish',
      hospital: 'Shifoxona',
      pharmacy: 'Dorixona',
      rehab: 'Reabilitatsiya',
      certified: 'Sertifikatlangan',
      countUnit: 'ta',
    },
    documents: {
      'workplace-accident-application': 'Birinchi ariza',
      'accident-report': 'Baxtsiz hodisa hisoboti',
      'medical-benefit-application': 'Tibbiy xarajatlar da\'vosi',
      'sick-leave-benefit-application': 'Kasallik ta\'tili da\'vosi',
      'disability-rating-application': 'Nogironlik nafaqasi da\'vosi',
      'employment-support-application': 'Ish yordami arizasi',
      're-treatment-application': 'Qayta davolash arizasi',
      'hospital-transfer-application': 'Ko\'chirish arizasi',
      'additional-disease-application': 'Qo\'shimcha kasallik arizasi',
      'nursing-care-benefit-application': 'Parvarish da\'vosi',
      'concurrent-treatment-application': 'Bir vaqtda davolash da\'vosi',
      'transportation-expense-application': 'Transport xarajatlari da\'vosi',
      'medical-opinion-certificate': 'Tibbiy xulosa',
      'medical-records-copy': 'Tibbiy yozuvlar nusxasi',
      'medical-expense-detail': 'Tibbiy xarajatlar tafsiloti',
      'disability-certificate': 'Nogironlik guvohnomasi',
      'medical-imaging-cd': 'MRT/KT CD',
      'employer-confirmation': 'Ish beruvchi tasdig\'i',
      'settlement-judgment': 'Kelayotgan/Hukm',
    },
    checklist: {
      title: 'Bosqichma-bosqich ro‘yxat',
      remaining: '{count} ta qoldi',
      complete: 'Bajarildi',
      empty: 'Barcha vazifalar bajarildi!',
      items: {
        'stage1-1': { title: 'Shifokorga "Ishda jarohatlandim" deng', description: 'Tibbiy tarix uchun juda muhim.' },
        'stage1-2': { title: '"Sanoat baxtsiz hodisasi" deb rasmiylashtiring', description: 'Sug‘urta orqali ariza bering.' },
        'stage1-3': { title: 'Rasmga oling va guvoh toping', description: 'Dalillarni saqlab qoling.' },
        'stage1-5': { title: 'Ariza topshiring', description: 'KCOMWELga xabar berish shakli.' },
        'stage2-1': { title: 'Kasalxonaga muntazam boring', description: 'Davolanishni to‘xtatish nafaqani kesishi mumkin.' },
        'stage2-2': { title: 'Har oy kasallik nafaqasini so‘rang', description: 'Har oy ariza topshiring.' },
        'stage2-3': { title: 'Kvitansiyalarni saqlang', description: 'Keyinchalik qaytarib olish uchun kerak.' },
        'stage2-4': { title: 'Ruxsatsiz ishlash taqiqlanadi', description: 'Agar aniqlansa, pullar qaytarib olinadi.' },
        'stage3-1': { title: 'Nogironlik nafaqasini hal qiling', description: 'Doimiy jarohat qolsa, ariza bering.' },
        'stage3-2': { title: 'Ma’lumotnoma va MRI/CD tayyorlang', description: 'Rasmlarsiz ko‘rib chiqilmaydi.' },
        'stage3-3': { title: 'Nogironlik darajasini aniqlash', description: 'Ariza bering va natijani kuting.' },
        'stage3-4': { title: 'Rad etilsa, shikoyat qiling', description: 'Past baholansa, apellyatsiya bering.' },
        'stage4-1': { title: 'Eski ish joyi bilan maslahatlashing', description: 'Qaytish bo‘yicha gaplashing.' },
        'stage4-2': { title: 'Kasbiy ta’limga yoziling', description: 'Yangi kasbga tayyorlaning.' },
        'stage4-3': { title: 'Reabilitatsiya nafaqasi so‘rang', description: 'Kasbiy yordam uchun ariza.' },
        'stage4-4': { title: 'Ishga joylashish dasturiga qo‘shiling', description: 'KCOMWEL dasturlaridan foydalaning.' },
      },
    },
    quickActions: {
      download: 'Shakllarni yuklash',
      guide: 'Qo‘llanma',
      hospitals: 'Kasalxona topish',
      calculator: 'Kalkulyator',
      counseling: 'Maslahat',
      aiChat: 'AI Chat',
      transfer: 'Kasalxona o‘zgartirish',
      sickLeave: 'Nafaqa so‘rash',
      disability: 'Nogironlik ma’lumotnomasi',
      inquiry: 'So‘rov',
      returnCounseling: 'Qaytish maslahati',
      training: 'Kasbiy ta’lim',
      rehabApp: 'Reabilitatsiya',
      jobSupport: 'Ish yordami',
      hospitalTransfer: 'Kasalxona o‘zgartirish',
      guestTitle: 'Mehmon funksiyalari',
      commonTitle: '{name} uchun funksiyalar',
      customerCenter: 'Mijozlar markazi',
    },
    benefits: {
      title: 'Davolanish davrida mavjud imtiyozlar',
      items: {
        'TRANSPORT': { question: 'Transport', answer: 'Kasalxonaga borish xarajatlari qoplanadi' },
        'TREATMENT': { question: 'Yordamchi vositalar', answer: 'Nogironlar aravachasi/eshitish moslamasi' },
        'NURSING': { question: 'Parvarish', answer: 'Enaga xarajatlari (shartlar bo‘yicha)' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      viewAll: 'Barcha imtiyozlarni ko\'rish',
      defaultTitle: 'Hozir bilishingiz kerak bo\'lgan imtiyozlar',
    },
    curatedContent: {
      title: '{name} uchun zarur hujjatlar',
      noRequiredDocuments: 'Hozirgi bosqichda zarur hujjatlar yo\'q.',
      noticesTitle: 'Bosqichli eslatmalar',
      noNotices: 'Maxсус eslatmalar yo\'q.',
    },
    communityWidget: {
      title: '{name} uchun hamjamiyat',
      viewAll: 'Hammasini ko\'rish',
      injuryBoard: '{injury} kengashi',
      regionBoard: '{region} kengashi',
      noticesTitle: 'Eslatmalar',
      noNotices: 'Yangi eslatmalar yo\'q.',
    },
    videoCard: {
      noVideo: 'Tegishli video topilmadi.',
      preparing: 'Tavsiya etilgan video tayyorlanmoqda...',
      badges: {
        helpful: 'Foydali video',
        recommended: 'Tavsiya etilgan',
        reference: 'Ma\'lumot',
        personalized: 'Siz uchun',
      },
    },
    statsWidget: {
      title: '{name} bilan o\'xshash odamlarning davolanish statistikasi',
      error: 'Statistikani yuklab bo\'lmadi.',
      toggle: { accident: 'Baxtsiz hodisa', disease: 'Kasallik' },
      labels: {
        avgApproval: 'O\'rtacha tasdiqlash darajasi',
        processingTime: 'Ishlov berish vaqti',
        treatmentDuration: 'Davolanish davomiyligi',
      },
      descriptions: {
        approval: '10 kishidan {count} nafari\ntasdiqlangan',
        processing: 'Qabul qilingandan keyin\n{time} dan ko\'proq vaqt olishi mumkin',
        treatment: 'Odatda {time}\nreabilitatsiyaga e\'tibor qaratiladi',
      },
      noInfo: 'Ma\'lumot yo\'q',
    },
  },
  mn: {
    header: {
      level: 'Түвшин',
      basedOn: 'Огноогоор',
      greeting: 'Сайн байна уу, {name}!',
      guestGreeting: 'Зочин!',
      status: 'Одоо {step}.',
      allProgress: 'Нийт явц',
      remaining: 'Дуусахад {pct}% үлдлээ',
      editProfile: 'Профайл нэр засах',
      stepNames: {
        0: 'Бэлтгэл үе шат',
        1: 'Бэлтгэл үе шат',
        2: 'Эмчилгээ хийлгэж буй',
        3: 'Эмчилгээ дуусах',
        4: 'Ажилд эргэн орох',
      },
    },
    hero: {
      title: 'Төвөгтэй нөхөн төлбөр, ',
      highlight: 'Бид танд чиглүүлэх болно',
      subtitle: 'ReworkCare таны хувийн самбарт бүх зүйлийг цэгцэлж өгнө.',
    },
    documents: {},
    checklist: {
      title: 'Алхам алхмаарх жагсаалт',
      remaining: '{count} үлдсэн',
      complete: 'Дууссан',
      empty: 'Бүх ажил дууссан!',
      items: {
        'stage1-1': { title: 'Эмчид "Ажил дээр бэртсэн" гэж хэлэх', description: 'Эмнэлгийн түүхэнд чухал.' },
        'stage1-2': { title: '"Үйлдвэрлэлийн осол" гэж бүртгүүлэх', description: 'Эрүүл мэндийн даатгалаар биш.' },
        'stage1-3': { title: 'Зураг авч, гэрч олох', description: 'Цэвэрлэхээс өмнө баримтжуул.' },
        'stage1-5': { title: 'Өргөдөл гаргах', description: 'KCOMWEL-д мэдэгдэх маягт.' },
        'stage2-1': { title: 'Эмнэлэгт тогтмол очих', description: 'Эмчилгээг зогсоовол тэтгэмж зогсоно.' },
        'stage2-2': { title: 'Сар бүр чөлөөний тэтгэмж нэхэмжлэх', description: 'Эмчилгээний үед сар бүр.' },
        'stage2-3': { title: 'Баримтуудаа хадгалах', description: 'Дараа нь нөхөн төлүүлэхэд хэрэгтэй.' },
        'stage2-4': { title: 'Зөвшөөрөлгүй ажиллах хориотой', description: 'Баригдвал мөнгийг буцааж авна.' },
        'stage3-1': { title: 'Тахир дутуугийн тэтгэмж шийдэх', description: 'Байнгын гэмтэл үлдвэл хүсэлт гарга.' },
        'stage3-2': { title: 'Магадлагаа болон MRI/CD бэлдэх', description: 'Зураггүйгээр хянах боломжгүй.' },
        'stage3-3': { title: 'Зэрэглэл тогтоолгох', description: 'Өргөдөл өгөөд хариу хүлээ.' },
        'stage3-4': { title: 'Татгалзвал гомдол гаргах', description: 'Бага үнэлэгдвэл давж заалд.' },
        'stage4-1': { title: 'Хуучин ажил олгогчтой зөвлөлдөх', description: 'Буцаж орох талаар ярилц.' },
        'stage4-2': { title: 'Мэргэжлийн сургалтад бүртгүүлэх', description: 'Шинэ ажилд бэлтгэ.' },
        'stage4-3': { title: 'Нөхөн сэргээх тэтгэмж хүсэх', description: 'Мэргэжлийн дэмжлэг авах.' },
        'stage4-4': { title: 'Ажилд зуучлах хөтөлбөрт хамрагдах', description: 'KCOMWEL-ийн хөтөлбөрийг ашигла.' },
      },
    },
    quickActions: {
      download: 'Маягт татах',
      guide: 'Лавлах',
      hospitals: 'Эмнэлэг хайх',
      calculator: 'Тооцоолуур',
      counseling: 'Зөвлөгөө',
      aiChat: 'AI Чат',
      transfer: 'Эмнэлэг солих',
      sickLeave: 'Чөлөөний мөнгө',
      disability: 'Тахир дутуугийн гэрчилгээ',
      inquiry: 'Лавлагаа',
      returnCounseling: 'Буцах зөвлөгөө',
      training: 'Сургалт',
      rehabApp: 'Сэргээх өргөдөл',
      jobSupport: 'Ажлын дэмжлэг',
      hospitalTransfer: 'Эмнэлэг солих',
      guestTitle: 'Зочин функцууд',
      commonTitle: '{name}-д зориулсан функцууд',
      customerCenter: 'Харилцагчийн төв',
    },
    benefits: {
      title: 'Эмчилгээний үеийн хөнгөлөлтүүд',
      items: {
        'TRANSPORT': { question: 'Унааны зардал', answer: 'Эмнэлэг явах зардал' },
        'TREATMENT': { question: 'Туслах хэрэгсэл', answer: 'Тэргэнцэр/Сонсголын аппарат' },
        'NURSING': { question: 'Асрамж', answer: 'Асрагчийн зардал (нөхцөл хангавал)' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'Бүх тэтгэмжийг харах',
      defaultTitle: 'Одоо мэдэх шаардлагатай тэтгэмжүүд',
    },
    curatedContent: {
      title: '{name}-д шаардлагатай баримт бичгүүд',
      noRequiredDocuments: 'Одоогийн үе шатанд шаардлагатай баримт бичиг байхгүй.',
      noticesTitle: 'Үе шатны анхааруулга',
      noNotices: 'Тусгай мэдэгдэл алга.',
    },
    communityWidget: {
      title: '{name}-д зориулсан нийгэмлэг',
      viewAll: 'Бүгдийг харах',
      injuryBoard: '{injury} самбар',
      regionBoard: '{region} самбар',
      noticesTitle: 'Мэдэгдэл',
      noNotices: 'Шинэ мэдэгдэл байхгүй.',
    },
    videoCard: {
      noVideo: 'Холбогдох видео олдсонгүй.',
      preparing: 'Санал болгож буй видеог бэлтгэж байна...',
      badges: {
        helpful: 'Хэрэгтэй видео',
        recommended: 'Санал болгож байна',
        reference: 'Лавлагаа',
        personalized: 'Танд зориулсан',
      },
    },
    statsWidget: {
      title: '{name}-тэй төстэй хүмүүсийн эмчилгээний статистик',
      error: 'Статистикийг ачаалах боломжгүй.',
      toggle: { accident: 'Осол', disease: 'Өвчин' },
      labels: {
        avgApproval: 'Дундаж батлах хувь',
        processingTime: 'Боловсруулах хугацаа',
        treatmentDuration: 'Эмчилгээний үргэлжлэх хугацаа',
      },
      descriptions: {
        approval: '10 хүнээс {count} нь\nбатлагдсан',
        processing: 'Хүлээж авснаас хойш\n{time} буюу түүнээс дээш хугацаа шаардагдаж магадгүй',
        treatment: 'Ихэвчлэн {time}\nнөхөн сэргээхэд анхаардаг',
      },
      noInfo: 'Мэдээлэл алга',
    },
    guest: {
      banner: {
        mode: 'Зочин горим',
        start: 'Эхлүүлэх',
      },
    },
    localResources: {
      title: '{name}-д зориулсан орон нутгийн нөөц',
      loginTitle: 'Нэвтрэн орно уу',
      loginDesc: 'Орон нутгийн нөөцөө үзэхийн тулд нэвтрэн орно уу.',
      loginBtn: 'Нэвтрэх',
      setRegionTitle: 'Бүс нутгаа тохируулах',
      setRegionDesc: 'Бүс нутгаа тохируулна уу.',
      setRegionBtn: 'Тохируулах',
      changeRegion: 'Бүс нутгийг өөрчлөх',
      dialogTitle: 'Бүс нутгаа сонгоно уу',
      saveBtn: 'Хадгалах',
      viewFullScreen: 'Бүтэн дэлгэцээр харах',
      hospital: 'Эмнэлэг',
      pharmacy: 'Эмийн сан',
      rehab: 'Сэргээн засах',
      certified: 'Баталгаажсан',
      countUnit: 'шүү',
    },
  },
  id: {
    header: {
      level: 'Level',
      basedOn: 'Per',
      greeting: 'Halo, {name}!',
      guestGreeting: 'Tamu!',
      status: 'Saat ini {step}.',
      allProgress: 'Total Kemajuan',
      remaining: 'Sisa {pct}%',
      editProfile: 'Ubah Nama Profil',
      stepNames: {
        0: 'Tahap Persiapan',
        1: 'Tahap Persiapan',
        2: 'Dalam Pengobatan',
        3: 'Pengobatan Selesai',
        4: 'Kembali Bekerja',
      },
    },
    hero: {
      title: 'Klaim Rumit, ',
      highlight: 'Kami Akan Memandu Anda',
      subtitle: 'ReworkCare mengatur semuanya di dashboard pribadi Anda.',
    },
    guest: {
      banner: {
        mode: 'Anda sekarang dalam <strong>Mode Tamu</strong>. Apakah Anda ingin menyimpan informasi dan terus mendapatkan panduan personal?',
        start: 'Mulai dalam 3 Detik',
      },
    },
    localResources: {
      title: 'Rumah Sakit Dekat {name}',
      loginTitle: 'Masuk untuk Cari RS',
      loginDesc: 'Masuk untuk melihat peta<br/>rumah sakit kecelakaan kerja di dekat Anda.',
      loginBtn: 'Masuk dalam 3 Detik',
      setRegionTitle: 'Atur Lokasi Anda',
      setRegionDesc: 'Kami menginformasikan rumah sakit<br/>yang ditunjuk di dekat Anda secara real-time.',
      setRegionBtn: 'Atur Lokasi',
      changeRegion: 'Ubah Lokasi',
      dialogTitle: 'Atur Lokasi',
      saveBtn: 'Simpan dan Periksa',
      viewFullScreen: 'Lihat Layar Penuh',
      hospital: 'Rumah Sakit',
      pharmacy: 'Apotek',
      rehab: 'Pusat Rehab',
      certified: 'Tersertifikasi',
      countUnit: 'Unit',
    },
    documents: {
      'workplace-accident-application': 'Aplikasi Pertama',
      'accident-report': 'Laporan Kecelakaan',
      'medical-benefit-application': 'Klaim Biaya Medis',
      'sick-leave-benefit-application': 'Klaim Cuti Sakit',
      'disability-rating-application': 'Klaim Tunjangan Cacat',
      'employment-support-application': 'Aplikasi Dukungan Kerja',
      're-treatment-application': 'Aplikasi Perawatan Ulang',
      'hospital-transfer-application': 'Aplikasi Transfer',
      'additional-disease-application': 'Aplikasi Penyakit Tambahan',
      'nursing-care-benefit-application': 'Klaim Perawatan',
      'concurrent-treatment-application': 'Klaim Perawatan Bersamaan',
      'transportation-expense-application': 'Klaim Biaya Transportasi',
      'medical-opinion-certificate': 'Pendapat Medis',
      'medical-records-copy': 'Salinan Rekam Medis',
      'medical-expense-detail': 'Rincian Biaya Medis',
      'disability-certificate': 'Sertifikat Cacat',
      'medical-imaging-cd': 'CD MRI/CT',
      'employer-confirmation': 'Konfirmasi Majikan',
      'settlement-judgment': 'Penyelesaian/Putusan',
    },
    checklist: {
      title: 'Daftar Periksa Bertahap',
      remaining: 'Sisa {count}',
      complete: 'Selesai',
      empty: 'Semua tugas selesai!',
      items: {
        'stage1-1': { title: 'Sebutkan "Cedera Kerja" di Klinik', description: 'Penting untuk rekam medis.' },
        'stage1-2': { title: 'Minta "Proses Kecelakaan Industri"', description: 'Ajukan via Asuransi Kecelakaan, bukan Kesehatan.' },
        'stage1-3': { title: 'Amankan Foto & Saksi', description: 'Bukti sebelum dibersihkan.' },
        'stage1-5': { title: 'Kirim Aplikasi', description: 'Formulir lapor kecelakaan ke KCOMWEL.' },
        'stage2-1': { title: 'Rutin ke Rumah Sakit', description: 'Berhenti berobat bisa menghentikan tunjangan.' },
        'stage2-2': { title: 'Klaim Tunjangan Cuti Tiap Bulan', description: 'Ajukan setiap bulan selama pengobatan.' },
        'stage2-3': { title: 'Simpan Kuitansi Medis', description: 'Diperlukan untuk klaim penggantian nanti.' },
        'stage2-4': { title: 'Dilarang Bekerja Tanpa Izin', description: 'Tunjangan akan ditarik jika ketahuan.' },
        'stage3-1': { title: 'Putuskan Klaim Disabilitas', description: 'Ajukan jika ada cacat permanen.' },
        'stage3-2': { title: 'Siapkan Sertifikat & MRI/CD', description: 'Tidak bisa diperiksa tanpa data gambar.' },
        'stage3-3': { title: 'Penetapan Tingkat Disabilitas', description: 'Kirim klaim dan tunggu hasil.' },
        'stage3-4': { title: 'Siapkan Banding jika Ditolak', description: 'Pertimbangkan banding jika tingkat rendah.' },
        'stage4-1': { title: 'Konsultasi Majikan Lama', description: 'Bahas kembali ke pekerjaan sebelumnya.' },
        'stage4-2': { title: 'Daftar Pelatihan Kerja', description: 'Siapkan karir baru lewat pelatihan.' },
        'stage4-3': { title: 'Aplikasi Tunjangan Rehab', description: 'Ajukan dukungan vokasi.' },
        'stage4-4': { title: 'Ikut Program Kembali Kerja', description: 'Manfaatkan program dukungan KCOMWEL.' },
      },
    },
    quickActions: {
      download: 'Unduh Formulir',
      guide: 'Panduan',
      hospitals: 'Cari RS',
      calculator: 'Kalkulator',
      counseling: 'Konseling',
      aiChat: 'AI Chat',
      transfer: 'Pindah RS',
      sickLeave: 'Klaim Cuti',
      disability: 'Sertifikat Cacat',
      inquiry: 'Pertanyaan',
      returnCounseling: 'Konseling Kembali',
      training: 'Pelatihan Kerja',
      rehabApp: 'Aplikasi Rehab',
      jobSupport: 'Dukungan Kerja',
      hospitalTransfer: 'Pindah RS',
      guestTitle: 'Fungsi Tambahan untuk',
      commonTitle: 'Fungsi Tambahan untuk {name}',
      customerCenter: 'Pusat Pelanggan',
    },
    benefits: {
      title: 'Manfaat Selama Pengobatan',
      items: {
        'TRANSPORT': { question: 'Transportasi', answer: 'Biaya perjalanan ke RS' },
        'TREATMENT': { question: 'Alat Bantu', answer: 'Kursi roda/Alat bantu dengar' },
        'NURSING': { question: 'Perawatan', answer: 'Biaya pengasuh (jika memenuhi syarat)' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'Lihat Semua Manfaat',
      defaultTitle: 'Manfaat yang perlu diketahui sekarang',
    },
    curatedContent: {
      title: 'Dokumen yang Diperlukan untuk {name}',
      noRequiredDocuments: 'Tidak ada dokumen yang diperlukan untuk tahap ini.',
      noticesTitle: 'Pemberitahuan Bertahap',
      noNotices: 'Tidak ada pemberitahuan khusus.',
    },
    communityWidget: {
      title: 'Komunitas untuk {name}',
      viewAll: 'Lihat Semua',
      injuryBoard: 'Dewan {injury}',
      regionBoard: 'Dewan {region}',
      noticesTitle: 'Pemberitahuan',
      noNotices: 'Tidak có pemberitahuan mới.',
    },
    videoCard: {
      noVideo: 'Tidak ada video terkait.',
      preparing: 'Menyiapkan video rekomendasi...',
      badges: {
        helpful: 'Video Bermanfaat',
        recommended: 'Sangat Direkomendasikan',
        reference: 'Referensi',
        personalized: 'Untuk Anda',
      },
    },
    statsWidget: {
      title: 'Statistik Pengobatan untuk Orang Seperti {name}',
      error: 'Gagal memuat statistik.',
      toggle: { accident: 'Kecelakaan', disease: 'Penyakit' },
      labels: {
        avgApproval: 'Rata-rata Persetujuan',
        processingTime: 'Waktu Proses',
        treatmentDuration: 'Durasi Pengobatan',
      },
      descriptions: {
        approval: '{count} dari 10 orang\ndisetujui',
        processing: 'Mungkin butuh\n{time} atau lebih setelah diterima',
        treatment: 'Biasanya fokus pemulihan\nselama {time}',
      },
      noInfo: 'Tidak ada info',
    },
  },
  ne: {
    header: {
      level: 'तह',
      basedOn: 'मिति',
      greeting: 'नमस्ते, {name}!',
      guestGreeting: 'अतिथि!',
      status: 'हाल {step}.',
      allProgress: 'कुल प्रगति',
      remaining: 'पूरा हुन {pct}% बाँकी',
      editProfile: 'प्रोफाइल नाम सम्पादन',
      stepNames: {
        0: 'तयारी चरण',
        1: 'तयारी चरण',
        2: 'उपचारमा',
        3: 'उपचार अन्त्य',
        4: 'काममा फिर्ती',
      },
    },
    hero: {
      title: 'जटिल दाबी, ',
      highlight: 'हामी तपाईंलाई मार्गदर्शन गर्नेछौं',
      subtitle: 'ReworkCare ले तपाईंको ड्यासबोर्डमा सबै व्यवस्थित गर्छ।',
    },
    guest: {
      banner: {
        mode: 'तपाईं हाल <strong>अतिथि मोड</strong> मा हुनुहुन्छ। आफ्नो विवरण सुरक्षित गर्न र व्यक्तिगत गाइड प्राप्त गर्न?',
        start: '३ सेकेन्डमा सुरु गर्नुहोस्',
      },
    },
    localResources: {
      title: '{name} नजिकैका अस्पतालहरू',
      loginTitle: 'अस्पताल खोज्न लगइन गर्नुहोस्',
      loginDesc: 'आफ्नो नजिकैको औद्योगिक दुर्घटना अस्पतालहरूको<br/>नक्सा हेर्न लगइन गर्नुहोस्।',
      loginBtn: '३ सेकेन्डमा लगइन',
      setRegionTitle: 'तपाईंको स्थान सेट गर्नुहोस्',
      setRegionDesc: 'हामी तपाईंको नजिकैको तोकिएका<br/>अस्पतालहरूको जानकारी दिन्छौं।',
      setRegionBtn: 'स्थान सेट',
      changeRegion: 'स्थान परिवर्तन',
      dialogTitle: 'स्थान सेट',
      saveBtn: 'बचत र जाँच',
      viewFullScreen: 'पूरा स्क्रिन',
      hospital: 'अस्पताल',
      pharmacy: 'औषधि पसल',
      rehab: 'पुनर्स्थापना',
      certified: 'प्रमाणित',
      countUnit: 'वटा',
    },
    documents: {
      'workplace-accident-application': 'पहिलो आवेदन',
      'accident-report': 'दुर्घटना रिपोर्ट',
      'medical-benefit-application': 'उपचार खर्च दाबी',
      'sick-leave-benefit-application': 'बिदा भत्ता दाबी',
      'disability-rating-application': 'अपाङ्गता भत्ता दाबी',
      'employment-support-application': 'रोजगार सहयोग आवेदन',
      're-treatment-application': 'पुन: उपचार आवेदन',
      'hospital-transfer-application': 'सार्ने आवेदन',
      'additional-disease-application': 'थप रोग आवेदन',
      'nursing-care-benefit-application': 'हेरचाह दाबी',
      'concurrent-treatment-application': 'समवर्ती उपचार दाबी',
      'transportation-expense-application': 'यातायात खर्च दाबी',
      'medical-opinion-certificate': 'चिकित्सा राय',
      'medical-records-copy': 'मेडिकल रेकर्ड प्रतिलिपि',
      'medical-expense-detail': 'उपचार खर्च विवरण',
      'disability-certificate': 'अपाङ्गता प्रमाणपत्र',
      'medical-imaging-cd': 'MRI/CT CD',
      'employer-confirmation': 'रोजगारदाता पुष्टि',
      'settlement-judgment': 'सम्झौता/फैसला',
    },
    checklist: {
      title: 'चरण-दर-चरण चेकलिस्ट',
      remaining: '{count} बाँकी',
      complete: 'पूरा भयो',
      empty: 'सबै कार्य पूरा!',
      items: {
        'stage1-1': { title: 'क्लिनिकमा "कामको चोट" भन्नुहोस्', description: 'मेडिकल रेकर्डको लागि महत्त्वपूर्ण।' },
        'stage1-2': { title: '"औद्योगिक दुर्घटना" प्रक्रिया माग्नुहोस्', description: 'स्वास्थ्य बीमा होइन, दुर्घटना बीमा। ' },
        'stage1-3': { title: 'फोटो र साक्षी सुरक्षित गर्नुहोस्', description: 'सफा गर्नु अघि प्रमाण राख्नुहोस्।' },
        'stage1-5': { title: 'निवेदन पेश गर्नुहोस्', description: 'KCOMWEL लाई खबर गर्ने फारम।' },
        'stage2-1': { title: 'नियमित अस्पताल जानुहोस्', description: 'उपचार रोके सुविधा रोकिन सक्छ।' },
        'stage2-2': { title: 'मासिक बिदा भत्ता दाबी गर्नुहोस्', description: 'उपचार अवधिमा हरेक महिना।' },
        'stage2-3': { title: 'बिलहरू सुरक्षित राख्नुहोस्', description: 'पछि फिर्ता लिन आवश्यक।' },
        'stage2-4': { title: 'अनुमति बिना काम निषेध', description: 'समातिएमा पैसा फिर्ता लिइनेछ।' },
        'stage3-1': { title: 'अपाङ्गता दाबी निर्णय गर्नुहोस्', description: 'स्थायी चोट भए दाबी गर्नुहोस्।' },
        'stage3-2': { title: 'प्रमाणपत्र र MRI/CD तयार', description: 'इमेजिङ बिना जाँच असम्भव।' },
        'stage3-3': { title: 'अपाङ्गता ग्रेड निर्धारण', description: 'दाबी पेश गरी नतिजा पर्खनुहोस्।' },
        'stage3-4': { title: 'अस्वीकृत भए पुनरावेदन', description: 'ग्रेड कम भए विचार गर्नुहोस्।' },
        'stage4-1': { title: 'पुरानो रोजगारदातासँग परामर्श', description: 'फर्किने बारे छलफल गर्नुहोस्।' },
        'stage4-2': { title: 'कामको तालिम आवेदन', description: 'तालिम मार्फत नयाँ कामको तयारी।' },
        'stage4-3': { title: 'पुनर्स्थापना भत्ता आवेदन', description: 'व्यावसायिक सहयोग माग्नुहोस्।' },
        'stage4-4': { title: 'पुनरोजगार कार्यक्रममा सहभागी', description: 'KCOMWEL कार्यक्रम प्रयोग गर्नुहोस्।' },
      },
    },
    quickActions: {
      download: 'फारम डाउनलोड',
      guide: 'गाइड',
      hospitals: 'अस्पताल खोज',
      calculator: 'क्याल्कुलेटर',
      counseling: 'परामर्श',
      aiChat: 'AI च्याट',
      transfer: 'अस्पताल सार्ने',
      sickLeave: 'बिदा भत्ता दाबी',
      disability: 'अपाङ्गता प्रमाणपत्र',
      inquiry: 'सोधपुछ',
      returnCounseling: 'फिर्ती परामर्श',
      training: 'तालिम',
      rehabApp: 'पुनर्स्थापना आवेदन',
      jobSupport: 'रोजगार सहयोग',
      hospitalTransfer: 'अस्पताल सार्ने',
      guestTitle: 'को लागि थप प्रकार्यहरू',
      commonTitle: '{name} को लागि थप प्रकार्यहरू',
      customerCenter: 'ग्राहक केन्द्र',
    },
    benefits: {
      title: 'उपचार अवधिमा पाइने सुविधाहरु',
      items: {
        'TRANSPORT': { question: 'यातायात', answer: 'अस्पताल जाने खर्च सहयोग' },
        'TREATMENT': { question: 'सहायक उपकरण', answer: 'ह्वीलचेयर/श्रवण यन्त्र वास्तविक खर्च' },
        'NURSING': { question: 'हेरचाह', answer: 'हेरचाहकर्ता खर्च (शर्त अनुसार)' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'सबै सुविधाहरू हेर्नुहोस्',
      defaultTitle: 'अहिले जान्नु पर्ने लाभहरू',
    },
    curatedContent: {
      title: '{name} को लागि आवश्यक कागजातहरू',
      noRequiredDocuments: 'वर्तमान चरणको लागि कुनै आवश्यक कागजातहरू छैनन्।',
      noticesTitle: 'चरण-विशिष्ट सूचनाहरू',
      noNotices: 'कुनै विशेष सूचनाहरू छैनन्।',
    },
    communityWidget: {
      title: '{name} को लागी समुदाय',
      viewAll: 'सबै हेर्नुहोस्',
      injuryBoard: '{injury} बोर्ड',
      regionBoard: 'बอร์ด {region}',
      noticesTitle: 'सूचनाहरू',
      noNotices: 'कुनै नयाँ सूचनाहरू छैनन्।',
    },
    videoCard: {
      noVideo: 'सम्बन्धित भिडियो भेटिएन।',
      preparing: 'सिफारिस गरिएको भिडियो तयार गर्दै...',
      badges: {
        helpful: 'उपयोगी भिडियो',
        recommended: 'सिफारिस गरिएको',
        reference: 'सन्दर्भ',
        personalized: 'तपाईंको लागि',
      },
    },
    statsWidget: {
      title: '{name} जस्तै मानिसहरूका लागि उपचार तथ्याङ्क',
      error: 'तथ्याङ्क लोड गर्न सकिएन।',
      toggle: { accident: 'दुर्घटना', disease: 'रोग' },
      labels: {
        avgApproval: 'औसत स्वीकृति दर',
        processingTime: 'प्रक्रिया समय',
        treatmentDuration: 'उपचार अवधि',
      },
      descriptions: {
        approval: '10 मध्ये {count}\nस्वीकृत',
        processing: 'प्रक्रिया पछि\n{time} वा बढी लाग्न सक्छ',
        treatment: 'सामान्यतया {time}\nरिकभरीमा केन्द्रित',
      },
      noInfo: 'जानकारी छैन',
    },
  },
  hi: {
    header: {
      level: 'स्तर',
      basedOn: 'की स्थिति',
      greeting: 'नमस्ते, {name}!',
      guestGreeting: 'अतिथि!',
      status: 'वर्तमान में {step}।',
      allProgress: 'कुल प्रगति',
      remaining: 'पूर्ण होने में {pct}% शेष',
      editProfile: 'प्रोफ़ाइल नाम बदलें',
      stepNames: {
        0: 'तैयारी चरण',
        1: 'तैयारी चरण',
        2: 'इलाज चल रहा है',
        3: 'इलाज समापन',
        4: 'वापसी चरण',
      },
    },
    hero: {
      title: 'जटिल दावे, ',
      highlight: 'हम आपका मार्गदर्शन करेंगे',
      subtitle: 'ReworkCare आपके डैशबोर्ड पर सब व्यवस्थित करता है।',
    },
    guest: {
      banner: {
        mode: 'आप वर्तमान में <strong>अतिथि मोड</strong> में हैं। अपनी जानकारी सहेजने और व्यक्तिगत गाइड प्राप्त करने के लिए?',
        start: '3 सेकंड में शुरू करें',
      },
    },
    localResources: {
      title: '{name} के पास के अस्पताल',
      loginTitle: 'अस्पताल खोजने के लिए लॉगिन करें',
      loginDesc: 'अपने पास के औद्योगिक दुर्घटना अस्पतालों<br/>का नक्शा देखने के लिए लॉगिन करें।',
      loginBtn: '3 सेकंड में लॉगिन',
      setRegionTitle: 'अपना स्थान सेट करें',
      setRegionDesc: 'हम आपको वास्तविक समय में आपके पास के<br/>नामित अस्पतालों की जानकारी देते हैं।',
      setRegionBtn: 'स्थान सेट करें',
      changeRegion: 'स्थान बदलें',
      dialogTitle: 'स्थान सेट करें',
      saveBtn: 'सहेजें और जांचें',
      viewFullScreen: 'पूर्ण स्क्रीन देखें',
      hospital: 'अस्पताल',
      pharmacy: 'फार्मेसी',
      rehab: 'पुनर्वास केंद्र',
      certified: 'प्रमाणित',
      countUnit: 'इकाई',
    },
    documents: {
      'workplace-accident-application': 'पहला आवेदन',
      'accident-report': 'दुर्घटना रिपोर्ट',
      'medical-benefit-application': 'चिकित्सा व्यय दावा',
      'sick-leave-benefit-application': 'अवकाश भत्ता दावा',
      'disability-rating-application': 'विकलांगता लाभ दावा',
      'employment-support-application': 'रोजगार सहायता आवेदन',
      're-treatment-application': 'पुन: उपचार आवेदन',
      'hospital-transfer-application': 'स्थान्तरण आवेदन',
      'additional-disease-application': 'अतिरिक्त रोग आवेदन',
      'nursing-care-benefit-application': 'देखभाल भत्ता दावा',
      'concurrent-treatment-application': 'समवर्ती उपचार दावा',
      'transportation-expense-application': 'परिवहन व्यय दावा',
      'medical-opinion-certificate': 'चिकित्सा राय',
      'medical-records-copy': 'मेडिकल रिकॉर्ड कॉपी',
      'medical-expense-detail': 'विस्तृत बिल',
      'disability-certificate': 'विकलांगता प्रमाण पत्र',
      'medical-imaging-cd': 'MRI / X-ray CD',
      'employer-confirmation': 'नियोक्ता पुष्टि',
      'settlement-judgment': 'समझौता/निर्णय',
    },
    checklist: {
      title: 'चरण-दर-चरण चेकलिस्ट',
      remaining: '{count} शेष',
      complete: 'पूर्ण',
      empty: 'सभी कार्य पूरे हुए!',
      items: {
        'stage1-1': { title: 'क्लिनिक में "काम की चोट" कहें', description: 'मेडिकल रिकॉर्ड के लिए महत्वपूर्ण।' },
        'stage1-2': { title: ' "औद्योगिक दुर्घटना" प्रक्रिया मांगें', description: 'दुर्घटना बीमा के माध्यम से, स्वास्थ्य बीमा नहीं।' },
        'stage1-3': { title: 'तस्वीरें और गवाह सुरक्षित करें', description: 'सफाई से पहले सबूत रखें।' },
        'stage1-5': { title: 'आवेदन जमा करें', description: 'KCOMWEL को सूचित करने का फॉर्म।' },
        'stage2-1': { title: 'नियमित अस्पताल जाएं', description: 'इलाज रोकने से लाभ रुक सकते हैं।' },
        'stage2-2': { title: 'मासिक अवकाश भत्ता दावा करें', description: 'इलाज के दौरान हर महीने।' },
        'stage2-3': { title: 'मेडिकल रसीदें रखें', description: 'बाद में वापसी के लिए जरूरी।' },
        'stage2-4': { title: 'बिना अनुमति काम वर्जित', description: 'पकड़े जाने पर पैसा वापस लिया जाएगा।' },
        'stage3-1': { title: 'विकलांगता दावे का निर्णय', description: 'स्थायी चोट होने पर दावा करें।' },
        'stage3-2': { title: 'प्रमाणपत्र और MRI/CD तैयार', description: 'इमेजिंग के बिना समीक्षा असंभव।' },
        'stage3-3': { title: 'विकलांगता ग्रेड निर्धारण', description: 'दावा भेजें और परिणाम का इंतजार करें।' },
        'stage3-4': { title: 'अस्वीकृत होने पर अपील', description: 'कम ग्रेड मिलने पर अपील सोचें।' },
        'stage4-1': { title: 'पुराने नियोक्ता से परामर्श', description: 'वापसी के बारे में चर्चा करें।' },
        'stage4-2': { title: 'नौकरी प्रशिक्षण आवेदन', description: 'प्रशिक्षण के जरिए नई नौकरी की तैयारी।' },
        'stage4-3': { title: 'पुनर्वास भत्ता आवेदन', description: 'व्यावसायिक सहायता मांगें।' },
        'stage4-4': { title: 'पुनर्रोजगार कार्यक्रम में शामिल', description: 'KCOMWEL कार्यक्रमों का उपयोग करें।' },
      },
    },
    quickActions: {
      download: 'फॉर्म डाउनलोड',
      guide: 'गाइड',
      hospitals: 'अस्पताल खोजें',
      calculator: 'कैलकुलेटर',
      counseling: 'परामर्श',
      aiChat: 'AI चैट',
      transfer: 'अस्पताल बदलें',
      sickLeave: 'अवकाश भत्ता',
      disability: 'विकलांगता प्रमाणपत्र',
      inquiry: 'पूछताछ',
      returnCounseling: 'वापसी परामर्श',
      training: 'प्रशिक्षण',
      rehabApp: 'पुनर्वास आवेदन',
      jobSupport: 'नौकरी सहयोग',
      hospitalTransfer: 'अस्पताल बदलें',
      guestTitle: 'अतिथि सुविधाएँ',
      commonTitle: '{name} के लिए सुविधाएँ',
      customerCenter: 'ग्राहक केंद्र',
    },
    benefits: {
      title: 'इलाज के दौरान लाभ',
      items: {
        'TRANSPORT': { question: 'परिवहन', answer: 'अस्पताल यात्रा खर्च' },
        'TREATMENT': { question: 'सहायक उपकरण', answer: 'व्हीलचेयर/हियरिंग एड वास्तविक खर्च' },
        'NURSING': { question: 'देखभाल', answer: 'देखभालकर्ता खर्च (शर्तों पर)' },
        NURSING_POST: { question: 'Nursing Benefit (Post-end)', answer: 'Caregiver cost supported' },
        TRAINING_COST: { question: 'Job Training Cost', answer: 'Max 6M KRW per person' },
      },
      postTreatmentTitle: 'Compensation continues after treatment',
      returnTitle: 'Support items {name} should know',
      viewAll: 'सभी लाभ देखें',
      defaultTitle: 'लाभ जो आपको अभी जानना चाहिए',
    },
    curatedContent: {
      title: '{name} के लिए आवश्यक दस्तावेज',
      noRequiredDocuments: 'वर्तमान चरण के लिए कोई आवश्यक दस्तावेज नहीं हैं।',
      noticesTitle: 'चरण-विशिष्ट सूचनाएं',
      noNotices: 'कोई विशेष सूचनाएं नहीं हैं।',
    },
    communityWidget: {
      title: '{name} के लिए समुदाय',
      viewAll: 'सभी देखें',
      injuryBoard: '{injury} बोर्ड',
      regionBoard: '{region} बोर्ड',
      noticesTitle: 'चूकें नहीं',
      noNotices: 'कोई विशेष सूचना नहीं।',
    },
    videoCard: {
      noVideo: 'कोई संबंधित वीडियो नहीं मिला।',
      preparing: 'अनुशंसित वीडियो तैयार कर रहा है...',
      badges: {
        helpful: 'उपयोगी वीडियो',
        recommended: 'अनुशंसित',
        reference: 'संदर्भ',
        personalized: 'आपके लिए',
      },
    },
    statsWidget: {
      title: '{name} जैसे लोगों के लिए उपचार आंकड़े',
      error: 'आंकड़े लोड नहीं हो सके।',
      toggle: { accident: 'दुर्घटना', disease: 'बीमारी' },
      labels: {
        avgApproval: 'औसत स्वीकृति दर',
        processingTime: 'प्रक्रिया समय',
        treatmentDuration: 'उपचार अवधि',
      },
      descriptions: {
        approval: '10 में से {count}\nस्वीकृत',
        processing: 'स्वीकृति के बाद\n{time} या अधिक लग सकता है',
        treatment: 'आमतौर पर {time}\nरिकवरी पर केंद्रित',
      },
      noInfo: 'कोई जानकारी नहीं',
    },
  },
};
