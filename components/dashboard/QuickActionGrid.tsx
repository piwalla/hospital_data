"use client";


import { 
  FileText, Phone, MapPin, AlertCircle, 
  ArrowRightLeft, Scale, HeartHandshake, GraduationCap, MessageSquare, Calculator
} from "lucide-react";
import Link from "next/link";

// ... (imports remain similar, will be handled by context if needed, but for replace_file_content I need to be careful with scope. I will replace the whole component function to be safe and clean)

interface QuickActionGridProps {
  currentStep: number;
}

export default function QuickActionGrid({ currentStep }: QuickActionGridProps) {
  
  const getActions = () => {
    switch(currentStep) {
      case 1: // Application
        return [
          { label: '필수 서류 다운로드', icon: FileText, href: '/documents', disabled: false },
          { label: '산재 신청 가이드', icon: AlertCircle, href: '/timeline', disabled: false },
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '급여 계산기', icon: Calculator, href: '/calculator', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 2: // Treatment
        return [
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '병원 옮기기 (전원)', icon: ArrowRightLeft, href: '/documents/hospital-transfer-application', disabled: false },
          { label: '휴업급여 청구', icon: FileText, href: '/documents/sick-leave-benefit-application', disabled: false },
          { label: '급여 계산기', icon: Calculator, href: '/calculator', disabled: false },
          { label: '심리 상담', icon: HeartHandshake, href: '/counseling', disabled: false },
          { label: 'AI 산재 상담', icon: MessageSquare, href: '/chatbot-v2', disabled: false },
        ];
      case 3: // Disability
        return [
          { label: '병원 찾기', icon: MapPin, href: '/hospitals', disabled: false },
          { label: '장해 진단서 발급', icon: FileText, href: '/documents/disability-rating-application', disabled: false },
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
    // Mobile: Glassmorphism similar to other widgets. Desktop: Consistent glassmorphism.
    <div className="bg-white/80 backdrop-blur-md border border-white/40 shadow-premium rounded-[2.5rem] h-full overflow-hidden transition-all hover:shadow-premium-hover"> 
      <div className="pb-3 px-6 pt-6 sm:px-6 sm:pt-6 mb-2 sm:mb-0 border-b border-emerald-50/50">
        <h3 className="text-lg font-black text-slate-900 sm:text-base sm:font-bold px-1 flex items-center gap-2">
            <span className="w-1.5 h-6 bg-emerald-500 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            바로가기
        </h3>
      </div>
      <div className="px-4 pb-6 sm:px-6 sm:pb-6 pt-4">
        <div className="grid grid-cols-3 gap-x-3 gap-y-6 sm:gap-4">
            {actions.map((action, idx) => {
              if (action.disabled) {
                return (
                  <div key={idx} className="flex flex-col items-center gap-2.5 cursor-not-allowed opacity-60 grayscale">
                      <div className="w-[72px] h-[72px] sm:w-[56px] sm:h-[56px] rounded-3xl flex items-center justify-center border border-slate-100 bg-slate-50 text-slate-300 relative shadow-inner">
                          <action.icon className="w-8 h-8 sm:w-6 sm:h-6" />
                          <div className="absolute -top-1 -right-1 bg-slate-400 text-white text-xs sm:text-[10px] px-1.5 py-0.5 rounded-full font-bold shadow-sm">
                            준비중
                          </div>
                      </div>
                      <span className="text-sm sm:text-xs font-medium text-center leading-tight text-slate-300">
                          {action.label}
                      </span>
                  </div>
                );
              }
              
              return (
                <Link key={idx} href={action.href} className="flex flex-col items-center gap-3 sm:gap-2.5 group">
                    {/* Sage Green / Teal Tones for Active State */}
                    {/* Mobile: Big Touch Target (72px), Line Design (Border-slate-200), Soft Background */}
                    <div className={`w-[72px] h-[72px] sm:w-[56px] sm:h-[56px] rounded-3xl flex items-center justify-center transition-all duration-300 relative
                        bg-white border border-slate-100 text-slate-500 shadow-sm
                        group-hover:bg-emerald-600 group-hover:border-emerald-600 group-hover:text-white group-hover:shadow-[0_8px_16px_-4px_rgba(16,185,129,0.4)] group-hover:-translate-y-1
                    `}>
                        <action.icon className="w-8 h-8 sm:w-6 sm:h-6 stroke-[1.5] transition-transform duration-300 group-hover:scale-110" />
                    </div>
                    <span className="text-sm sm:text-xs font-bold sm:font-medium text-center leading-tight text-slate-600 transition-colors duration-200 group-hover:text-emerald-700">
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
