"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { Stethoscope, ClipboardCheck } from 'lucide-react';
import { useState } from 'react';

// Simplified Checkbox since we might not have the shadcn one installed yet, 
// checking file structure... 'components/ui/checkbox.tsx' was not explicitly made. 
// I'll make a simple inline checklist.

const CHECKLIST_ITEMS = [
  {
    id: 1,
    text: "통증이 오는 정확한 운동 각도 측정 요청하기",
    desc: "아프다고만 하지 말고 '여기서 더 꺾으면 아파요'라고 명확히 표현하세요."
  },
  {
    id: 2,
    text: "사고 이전 X-ray와 현재 상태 비교 요청하기",
    desc: "원래 상태와 얼마나 달라졌는지 객관적으로 증명하는 것이 유리합니다."
  },
  {
    id: 3,
    text: "근전도(EMG) 검사 결과지 첨부 여부 확인",
    desc: "신경 손상이 있다면 반드시 검사 결과지가 진단서에 첨부되어야 합니다."
  },
  {
    id: 4,
    text: "보조기구 착용 여부 및 필요성 기재 요청",
    desc: "보조기구가 상시 필요한 상태라면 등급 판정에 영향을 줄 수 있습니다."
  }
];

export default function DoctorConsultationGuide() {
  const [checkedItems, setCheckedItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setCheckedItems(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <Card className="border-green-200 bg-green-50/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800 text-lg">
          <Stethoscope className="w-5 h-5" />
          주치의 상담 가이드
        </CardTitle>
        <CardDescription className="text-sm">
          장해 진단서 발급 전, 이 내용은 꼭 확인하세요!
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3">
        {CHECKLIST_ITEMS.map((item) => (
          <div 
            key={item.id}
            onClick={() => toggleItem(item.id)}
            className={`
              flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all
              ${checkedItems.includes(item.id) 
                ? 'bg-green-100 border-green-300' 
                : 'bg-white border-green-100 hover:border-green-300'}
            `}
          >
            <div className={`
              mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
              ${checkedItems.includes(item.id)
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-slate-300'}
            `}>
              {checkedItems.includes(item.id) && <ClipboardCheck className="w-3.5 h-3.5" />}
            </div>
            <div>
              <div className={`text-base font-bold ${checkedItems.includes(item.id) ? 'text-green-900 line-through decoration-green-500' : 'text-slate-900'}`}>
                {item.text}
              </div>
              <div className="text-sm text-slate-500 mt-1">
                {item.desc}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
