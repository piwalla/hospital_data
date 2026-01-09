"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, ChevronRight, AlertCircle, RefreshCcw } from 'lucide-react';

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    nextQuestion?: string; // ID of the next question
    result?: number; // Resulting Grade
  }[];
}

const QUESTIONS: Record<string, Question> = {
  root: {
    id: 'root',
    text: '현재 가장 불편하신 증상은 무엇인가요?',
    options: [
      { label: '관절이 잘 안 움직여요 (운동기능 장해)', value: 'rom', nextQuestion: 'rom_detail' },
      { label: '절단된 부위가 있어요 (결손 장해)', value: 'amputation', nextQuestion: 'amputation_detail' },
    ]
  },
  rom_detail: {
    id: 'rom_detail',
    text: '다친 관절(고관절, 무릎, 발목)의 움직임이 얼마나 제한되나요?',
    options: [
      { label: '완전 강직 (전혀 움직일 수 없음)', value: 'frozen', result: 8 },
      { label: '정상 각도의 1/4 이하로만 움직임 (75% 이상 제한)', value: 'severe', result: 10 },
      { label: '정상 각도의 1/2 이하로만 움직임 (50% 이상 제한)', value: 'moderate', result: 12 },
      { label: '약간 불편하지만 1/2 이상은 움직임', value: 'mild', result: 14 }, // Generalized fallback
    ]
  },
  amputation_detail: {
    id: 'amputation_detail',
    text: '어느 부위에서 절단되었나요?',
    options: [
      { label: '무릎관절 이상', value: 'above_knee', result: 4 },
      { label: '발목관절 이상 (무릎과 발목 사이)', value: 'below_knee', result: 5 },
      { label: '리스프랑 관절 이상 (발등)', value: 'foot', result: 7 },
      { label: '발가락을 모두 잃음', value: 'toes', result: 8 },
    ]
  }
};

interface DisabilityGradeSimulatorProps {
  onComplete: (grade: number) => void;
}

export default function DisabilityGradeSimulator({ onComplete }: DisabilityGradeSimulatorProps) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string>('root');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<number | null>(null);

  const handleOptionSelect = (option: Question['options'][0]) => {
    if (option.result) {
      setResult(option.result);
      onComplete(option.result);
    } else if (option.nextQuestion) {
      setHistory([...history, currentQuestionId]);
      setCurrentQuestionId(option.nextQuestion);
    }
  };

  const handleReset = () => {
    setCurrentQuestionId('root');
    setHistory([]);
    setResult(null);
  };

  const handleBack = () => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    setHistory(history.slice(0, -1));
    setCurrentQuestionId(prev);
    setResult(null);
  };

  const currentQuestion = QUESTIONS[currentQuestionId];

  if (result) {
    return (
      <Card className="border-emerald-200 bg-emerald-50/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-emerald-700">
            <CheckCircle2 className="w-6 h-6" /> 예상 장해 등급 확인
          </CardTitle>
          <CardDescription>
            선택하신 증상을 바탕으로 예상되는 산재 장해 등급입니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-6">
          <div className="mb-2 text-slate-600">고객님의 예상 등급은</div>
          <div className="text-5xl font-black text-emerald-600 mb-2">제{result}급</div>
          <p className="text-sm text-slate-500">
            * 이는 모의 판정 결과이며, 정확한 등급은 주치의의 진단과 공단의 심사를 통해 결정됩니다.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Button variant="outline" onClick={handleReset} className="gap-2">
            <RefreshCcw className="w-4 h-4" /> 다시 테스트하기
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-slate-200 shadow-sm">
      <CardHeader className="bg-slate-50 pb-4">
        <div className="flex justify-between items-center mb-1">
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            장해 등급 시뮬레이터
          </Badge>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleBack} className="h-auto p-0 text-slate-500 hover:text-slate-800">
              이전으로
            </Button>
          )}
        </div>
        <CardTitle className="text-lg md:text-xl">
          {currentQuestion.text}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-6 grid gap-3">
        {currentQuestion.options.map((option, idx) => (
          <Button
            key={idx}
            variant="outline"
            className="w-full justify-between h-auto py-4 text-left font-normal text-slate-700 hover:border-emerald-300 hover:bg-emerald-50 relative group"
            onClick={() => handleOptionSelect(option)}
          >
            <span className="flex-1">{option.label}</span>
            <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
          </Button>
        ))}
      </CardContent>
      <CardFooter className="bg-slate-50 p-3">
        <div className="text-xs text-slate-400 flex items-center gap-1 w-full justify-center">
          <AlertCircle className="w-3 h-3" />
          하지(다리) 관절 기능 장해 기준 (2025년)
        </div>
      </CardFooter>
    </Card>
  );
}
