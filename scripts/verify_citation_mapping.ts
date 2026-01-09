
import { getKoreanTitle } from "@/lib/constants/rag-metadata";

const VERIFIED_FILES = [
  { displayName: "Hospital Guide 2025", expected: "2025 산재 가이드" },
  { displayName: "Disability Diagnosis Guide", expected: "장해진단서 작성원칙 및 유의사항" },
  { displayName: "industrial_accident_insurance_1", expected: "업무상 재해 기준" },
  { displayName: "cardiovascular_musculoskeletal_diseases_criteria", expected: "뇌혈관/심장/근골격계 판정 기준" },
  { displayName: "medical_care_benefit_calculation_standards", expected: "요양급여 산정 기준" },
  { displayName: "enforcement_rule_of_industrial_accident_compensation_insurance_act", expected: "산재보험법 시행규칙" },
  { displayName: "enforcement_decree_of_industrial_accident_compensation_insurance_act", expected: "산재보험법 시행령" },
  { displayName: "industrial_accident_compensation_insurance_act_21065", expected: "산재보험법(현행)" },
  { displayName: "industrial_accident_compensation_insurance_act_21136", expected: "산재보험법(예정)" },
  { displayName: "nursing_care_benefit_payment_standards", expected: "간병료 지급 기준" }
];

console.log("\n### 📋 Citation Mapping Verification Results\n");
console.log("| No | English/Ascii Name (Input) | Korean Title (Output) | Status |");
console.log("|:---:|:---|:---|:---:|");

VERIFIED_FILES.forEach((item, index) => {
    const output = getKoreanTitle(item.displayName);
    const isCorrect = output === item.expected;
    const statusIcon = isCorrect ? "✅" : "❌";
    
    console.log(`| ${index + 1} | \`${item.displayName}\` | **${output}** | ${statusIcon} |`);
});

console.log("\n");
