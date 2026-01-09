/**
 * RAG Document Metadata Registry
 * 
 * Maps the English "Display Name" (used in Google File Search API) 
 * to the original Korean filename and a user-friendly Korean title for the UI.
 * 
 * @key The 'displayName' set during file upload to Google Gemini
 */
export const RAG_DOCUMENTS = {
// --- Original Display Name Mappings ---
  "Hospital Guide 2025": {
    originalName: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공)",
    koreanTitle: "2025 산재 가이드",
    color: "blue",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/guide2025.pdf"
  },
  "guide2025.pdf": {
    originalName: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공)",
    koreanTitle: "2025 산재 가이드",
    color: "blue",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/guide2025.pdf"
  },
  "Hospital_Guide_2025.pdf": {
    originalName: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공)",
    koreanTitle: "2025 산재 가이드",
    color: "blue",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/guide2025.pdf"
  },
  "Disability Diagnosis Guide": {
    originalName: "장해진단서_작성원칙_및_유의사항(근로복지공단)",
    koreanTitle: "장해진단서 작성원칙 및 유의사항",
    color: "purple",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/disability_diagnosis_guide.pdf"
  },
  "disability_diagnosis_guide.pdf": {
    originalName: "장해진단서_작성원칙_및_유의사항(근로복지공단)",
    koreanTitle: "장해진단서 작성원칙 및 유의사항",
    color: "purple",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/disability_diagnosis_guide.pdf"
  },
  "Disability_Diagnosis_Guide.pdf": {
    originalName: "장해진단서_작성원칙_및_유의사항(근로복지공단)",
    koreanTitle: "장해진단서 작성원칙 및 유의사항",
    color: "purple",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/disability_diagnosis_guide.pdf"
  },
  "Industrial Accident Insurance Criteria": {
    originalName: "산업재해보상보험Ⅰ(업무상 재해)",
    koreanTitle: "업무상 재해 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/industrial_accident_insurance_1.pdf"
  },
  "Industrial_Accident_Insurance_Criteria.pdf": {
    originalName: "산업재해보상보험Ⅰ(업무상 재해)",
    koreanTitle: "업무상 재해 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/industrial_accident_insurance_1.pdf"
  },
  "industrial_accident_insurance_1": { // Legacy
    originalName: "산업재해보상보험Ⅰ(업무상 재해)",
    koreanTitle: "업무상 재해 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/industrial_accident_insurance_1.pdf"
  },
  "Cardiovascular and Musculoskeletal Diseases Criteria": {
    originalName: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항",
    koreanTitle: "뇌혈관/심장/근골격계 판정 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/cardiovascular_diseases.pdf"
  },
  "Cardiovascular_and_Musculoskeletal_Diseases_Criteria.pdf": {
    originalName: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항",
    koreanTitle: "뇌혈관/심장/근골격계 판정 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/cardiovascular_diseases.pdf"
  },
  "Medical Care Benefit Calculation Standards": {
    originalName: "산업재해보상보험 요양급여 산정기준",
    koreanTitle: "요양급여 산정 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/benefit_calculation.pdf"
  },
  "Medical_Care_Benefit_Calculation_Standards.pdf": {
    originalName: "산업재해보상보험 요양급여 산정기준",
    koreanTitle: "요양급여 산정 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/benefit_calculation.pdf"
  },
  "Enforcement Rule of IACI Act": {
    originalName: "산업재해보상보험법 시행규칙",
    koreanTitle: "산재보험법 시행규칙",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_rule.pdf"
  },
  "Enforcement_Rule_of_IACI_Act.pdf": {
    originalName: "산업재해보상보험법 시행규칙",
    koreanTitle: "산재보험법 시행규칙",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_rule.pdf"
  },
  "Enforcement Decree of IACI Act": {
    originalName: "산업재해보상보험법 시행령",
    koreanTitle: "산재보험법 시행령",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_decree.pdf"
  },
  "Enforcement_Decree_of_IACI_Act.pdf": {
    originalName: "산업재해보상보험법 시행령",
    koreanTitle: "산재보험법 시행령",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_decree.pdf"
  },
  "IACI Act 21065 Current": {
    originalName: "산업재해보상보험법(법률)(제21065호)",
    koreanTitle: "산재보험법(현행)",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21065.pdf"
  },
  "IACI_Act_21065_Current.pdf": {
    originalName: "산업재해보상보험법(법률)(제21065호)",
    koreanTitle: "산재보험법(현행)",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21065.pdf"
  },
  "IACI Act 21136 Future": {
    originalName: "산업재해보상보험법(법률)(제21136호)",
    koreanTitle: "산재보험법(예정)",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21136.pdf"
  },
  "IACI_Act_21136_Future.pdf": {
    originalName: "산업재해보상보험법(법률)(제21136호)",
    koreanTitle: "산재보험법(예정)",
    color: "orange",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21136.pdf"
  },
  "Nursing Care Benefit Payment Standards": {
    originalName: "산업재해보상보험법에 따른 간병료 지급기준",
    koreanTitle: "간병료 지급 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/nursing_benefit.pdf"
  },
  "Nursing_Care_Benefit_Payment_Standards.pdf": {
    originalName: "산업재해보상보험법에 따른 간병료 지급기준",
    koreanTitle: "간병료 지급 기준",
    color: "green",
    downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/nursing_benefit.pdf"
  },

  
  // --- Korean Filename Mappings (for robustness) ---
  "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공).pdf": {
     originalName: "2025 산재 보험 보상 및 재활 서비스 가이드(근로복지공단 제공)",
     koreanTitle: "2025 산재 가이드",
     color: "blue",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/guide2025.pdf"
  },
  "장해진단서_작성원칙_및_유의사항(근로복지공단).pdf": {
     originalName: "장해진단서_작성원칙_및_유의사항(근로복지공단)",
     koreanTitle: "장해진단서 작성원칙 및 유의사항",
     color: "purple",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/disability_diagnosis_guide.pdf"
  },
  "[pdf]산업재해보상보험Ⅰ(업무상 재해).pdf": {
     originalName: "산업재해보상보험Ⅰ(업무상 재해)",
     koreanTitle: "업무상 재해 기준",
     color: "green",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/industrial_accident_insurance_1.pdf"
  },
  "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항(고용노동부고시)(제2022-40호)(20220701).pdf": {
     originalName: "뇌혈관 질병 또는 심장 질병 및 근골격계 질병의 업무상 질병 인정 여부 결정에 필요한 사항",
     koreanTitle: "뇌혈관/심장/근골격계 판정 기준",
     color: "green",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/cardiovascular_diseases.pdf"
  },
  "산업재해보상보험 요양급여 산정기준(고용노동부고시)(제2022-87호)(20230101).pdf": {
     originalName: "산업재해보상보험 요양급여 산정기준",
     koreanTitle: "요양급여 산정 기준",
     color: "green",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/benefit_calculation.pdf"
  },
  "산업재해보상보험법 시행규칙(고용노동부령)(제00445호)(20250621).pdf": {
     originalName: "산업재해보상보험법 시행규칙",
     koreanTitle: "산재보험법 시행규칙",
     color: "orange",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_rule.pdf"
  },
  "산업재해보상보험법 시행령(대통령령)(제35947호)(20260102).pdf": {
     originalName: "산업재해보상보험법 시행령",
     koreanTitle: "산재보험법 시행령",
     color: "orange",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/enforcement_decree.pdf"
  },
  "산업재해보상보험법(법률)(제21065호)(20260102).pdf": {
     originalName: "산업재해보상보험법(법률)(제21065호)",
     koreanTitle: "산재보험법(현행)",
     color: "orange",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21065.pdf"
  },
  "산업재해보상보험법(법률)(제21136호)(20260212).pdf": {
     originalName: "산업재해보상보험법(법률)(제21136호)",
     koreanTitle: "산재보험법(예정)",
     color: "orange",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/act_21136.pdf"
  },
  "산업재해보상보험법에 따른 간병료 지급기준(고용노동부고시)(제2020-151호)(20210101).pdf": {
     originalName: "산업재해보상보험법에 따른 간병료 지급기준",
     koreanTitle: "간병료 지급 기준",
     color: "green",
     downloadUrl: "https://uanhvrgezlkwfnkvidtf.supabase.co/storage/v1/object/public/uploads/documents/nursing_benefit.pdf"
  },
  
  // --- URI ID Mappings (for hardcoded URI fallbacks) ---
  // If we ever get internal IDs back, we can map them here. 
  // Currently we use name or displayName primarily.
} as const;

export type RagDocumentKey = keyof typeof RAG_DOCUMENTS;

/**
 * Helper to get Korean title from English display name
 */
export function getKoreanTitle(englishDisplayName: string): string {
  // 1. Direct match in registry
  if (englishDisplayName in RAG_DOCUMENTS) {
    return RAG_DOCUMENTS[englishDisplayName as RagDocumentKey].koreanTitle;
  }
  
  // 2. Fallback: Return original if not found (or clean up underscores)
  return englishDisplayName;
}

/**
 * Helper to get Download URL from English display name
 */
export function getDownloadUrl(englishDisplayName: string): string | undefined {
  if (englishDisplayName in RAG_DOCUMENTS) {
    return RAG_DOCUMENTS[englishDisplayName as RagDocumentKey].downloadUrl;
  }
  return undefined;
}
