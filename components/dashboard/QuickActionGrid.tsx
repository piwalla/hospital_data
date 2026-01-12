"use client";


import { 
  FileText, Phone, MapPin, AlertCircle, 
  ArrowRightLeft, Scale, HeartHandshake, GraduationCap, MessageSquare, Calculator
} from "lucide-react";
import Link from "next/link";

// ... (imports remain similar, will be handled by context if needed, but for replace_file_content I need to be careful with scope. I will replace the whole component function to be safe and clean)

interface QuickActionGridProps {
  currentStep: number;
  userName?: string;
}

export default function QuickActionGrid({ currentStep, userName = "유저" }: QuickActionGridProps) {
  
  const getActions = () => {
    switch(currentStep) {
      case 1: // Application
        return [
          { label: '서류 다운로드', icon: FileText, href: '/documents', disabled: false },
          { label: '산재 신청 가이드', icon: AlertCircle, href: '/timeline', disabled: false },
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '급여 계산기', icon: Calculator, href: '/calculator', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 2: // Treatment
        return [
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '병원 옮기기', icon: ArrowRightLeft, href: '/documents/hospital-transfer-application', disabled: false },
          { label: '휴업급여 청구', icon: FileText, href: '/documents/sick-leave-benefit-application', disabled: false },
          { label: '급여 계산기', icon: Calculator, href: '/calculator', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 3: // Disability
        return [
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '장해진단서 발급', icon: FileText, href: '/documents/disability-rating-application', disabled: false },
          { label: '심사 문의하기', icon: Scale, href: 'https://www.comwel.or.kr/comwel/help/cyber/cyber_list.jsp?req_tp=1', disabled: false },
          { label: '급여 계산기', icon: Calculator, href: '/calculator', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 4: // Return
        return [
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '직업 훈련 신청', icon: GraduationCap, href: '/documents/employment-support-application', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      default:
        return [
            { label: '고객센터', icon: Phone, href: '/support' }
        ];
    }
  };

  const actions = getActions();

  return (
    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm h-full overflow-hidden transition-all hover:shadow-md"> 
      <div className="pb-4 px-7 pt-7 sm:px-8 sm:pt-8 mb-2 sm:mb-0">
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 px-1 flex items-center gap-3">
            <span className="w-2 h-7 bg-emerald-500 rounded-full inline-block shadow-[0_4px_12px_rgba(16,185,129,0.3)]" />
            {userName}님께 필요한 추가 기능
        </h3>
      </div>
      <div className="px-6 pb-8 sm:px-8 sm:pb-10 pt-4">
        <div className="grid grid-cols-3 gap-x-4 gap-y-8 sm:gap-6">
            {actions.map((action, idx) => {
              if (action.disabled) {
                return (
                  <div key={idx} className="flex flex-col items-center gap-3 cursor-not-allowed opacity-40 grayscale">
                      <div className="w-[72px] h-[72px] sm:w-[64px] sm:h-[64px] rounded-3xl flex items-center justify-center border border-slate-100 bg-slate-50 text-slate-300 relative">
                          <action.icon className="w-8 h-8 sm:w-7 sm:h-7" />
                      </div>
                      <span className="text-base sm:text-sm font-medium text-center leading-tight text-slate-300">
                          {action.label}
                      </span>
                  </div>
                );
              }
              
              return (
                <Link key={idx} href={action.href} className="flex flex-col items-center gap-3 sm:gap-4 group">
                    <div className={`w-[72px] h-[72px] sm:w-[64px] sm:h-[64px] rounded-3xl flex items-center justify-center transition-all duration-300 relative
                        bg-slate-50 border border-slate-100 text-slate-900 shadow-sm
                        group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white group-hover:shadow-[0_12px_24px_-8px_rgba(16,185,129,0.5)] group-hover:-translate-y-1.5
                    `}>
                        <action.icon className="w-8 h-8 sm:w-7 sm:h-7 stroke-[2] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-lg font-black text-center leading-tight text-slate-800 transition-colors duration-200 group-hover:text-emerald-700">
                        {action.label}
                    </span>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
