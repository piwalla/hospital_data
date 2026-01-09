"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from "date-fns";
import { ko } from "date-fns/locale";
import { ChevronLeft, ChevronRight, PlusCircle, Calendar as CalendarIcon, Stethoscope, FileText, Pill, Activity } from "lucide-react";
import { CalendarEvent } from "@/lib/mock-admin-data";
import { cn } from "@/lib/utils";

interface EasyCalendarWidgetProps {
  initialEvents: CalendarEvent[];
}

export default function EasyCalendarWidget({ initialEvents }: EasyCalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Mock function to add an event
  const addEventImmediately = (type: CalendarEvent['type'], title: string) => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const newEvent: CalendarEvent = {
      id: `evt-${Date.now()}`,
      date: todayStr,
      type,
      title,
      isCompleted: true,
    };
    setEvents([...events, newEvent]);
    setSelectedDate(new Date()); // Jump to today
    alert(`'${title}'이(가) 오늘 날짜로 기록되었습니다.`);
  };

  const selectedDateEvents = events.filter(evt => isSameDay(new Date(evt.date), selectedDate));

  const getDayEvents = (day: Date) => events.filter(evt => isSameDay(new Date(evt.date), day));

  const getEventColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'hospital': return 'bg-rose-500';
      case 'admin': return 'bg-blue-500';
      case 'rehab': return 'bg-purple-500';
      case 'counseling': return 'bg-amber-500';
      default: return 'bg-gray-400';
    }
  };

  const getEventIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'hospital': return <Stethoscope className="w-4 h-4 text-rose-500" />;
      case 'admin': return <FileText className="w-4 h-4 text-blue-500" />;
      case 'rehab': return <Activity className="w-4 h-4 text-purple-500" />;
      case 'counseling': return <CalendarIcon className="w-4 h-4 text-amber-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-gray-400" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-[var(--border-medium)] shadow-sm flex flex-col h-auto lg:h-full overflow-hidden">
      <div className="p-5 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
          <span className="w-2 h-6 bg-indigo-500 rounded-full inline-block" />
          산재 간편 캘린더
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          병원비 청구, 진료일 등 깜빡하기 쉬운 일정을 원클릭으로 기록하세요.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 h-auto lg:h-full">
        {/* Left: Quick Log Actions (Mobile: Top) */}
        <div className="lg:col-span-2 p-5 border-b lg:border-b-0 lg:border-r border-slate-100 bg-indigo-50/20">
          <h4 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            원클릭 일정 기록
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => addEventImmediately('hospital', '병원 외래 진료')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-rose-200 hover:bg-rose-50 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5 text-rose-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">오늘 병원 갔음</span>
            </button>
            <button 
              onClick={() => addEventImmediately('admin', '휴업급여 신청')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">휴업급여 신청함</span>
            </button>
            <button 
              onClick={() => addEventImmediately('rehab', '재활치료 완료')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-200 hover:bg-purple-50 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Activity className="w-5 h-5 text-purple-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">재활치료 받음</span>
            </button>
            <button 
              onClick={() => addEventImmediately('other', '약국 방문')}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-white border border-slate-200 hover:border-emerald-200 hover:bg-emerald-50 hover:shadow-sm transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Pill className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-semibold text-slate-700">약 탔음</span>
            </button>
          </div>
          
          <div className="mt-6">
             <h4 className="text-sm font-semibold text-slate-700 mb-3">
               {format(selectedDate, 'M월 d일 (E)', { locale: ko })} 일정
             </h4>
             <div className="bg-white rounded-xl border border-slate-200 min-h-[150px] p-3">
                {selectedDateEvents.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                    <CalendarIcon className="w-8 h-8 mb-2 opacity-20" />
                    기록된 일정이 없습니다.
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {selectedDateEvents.map(evt => (
                      <li key={evt.id} className="flex items-start gap-2 p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="mt-0.5">{getEventIcon(evt.type)}</div>
                        <div>
                          <p className={`text-xs font-bold ${evt.isCompleted ? 'text-slate-700' : 'text-slate-900'}`}>{evt.title}</p>
                          <p className="text-[10px] text-slate-500">{evt.type === 'admin' ? '행정 처리' : '병원 방문'}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
             </div>
          </div>
        </div>

        {/* Right: Calendar View */}
        <div className="lg:col-span-3 p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-slate-800">
              {format(currentDate, 'yyyy년 M월')}
            </h4>
            <div className="flex gap-1">
              <button 
                onClick={() => setCurrentDate(subMonths(currentDate, 1))}
                className="p-1 hovered:bg-slate-100 rounded-md text-slate-500"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                 onClick={() => setCurrentDate(addMonths(currentDate, 1))}
                 className="p-1 hovered:bg-slate-100 rounded-md text-slate-500"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center text-xs text-slate-400 mb-2">
            <div>일</div><div>월</div><div>화</div><div>수</div><div>목</div><div>금</div><div>토</div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 auto-rows-fr flex-1">
            {/* Empty cells for padding */}
            {Array.from({ length: monthStart.getDay() }).map((_, i) => (
              <div key={`empty-${i}`} className="p-1" />
            ))}
            
            {/* Days */}
            {daysInMonth.map((day) => {
              const dayEvents = getDayEvents(day);
              const isTodayDate = isToday(day);
              const isSelected = isSameDay(day, selectedDate);
              
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={cn(
                    "relative p-1 min-h-[40px] rounded-lg transition-all flex flex-col items-center justify-start border border-transparent",
                    isSelected ? "bg-indigo-50 border-indigo-200" : "hover:bg-slate-50",
                    isTodayDate && !isSelected && "bg-slate-50 font-bold text-indigo-600"
                  )}
                >
                  <span className={cn(
                    "text-xs mb-1 w-6 h-6 flex items-center justify-center rounded-full",
                    isSelected && "bg-indigo-600 text-white font-bold",
                    !isSelected && isTodayDate && "bg-slate-200"
                  )}>
                    {format(day, 'd')}
                  </span>
                  
                  {/* Event Dots */}
                  <div className="flex gap-0.5 justify-center flex-wrap px-1 w-full">
                    {dayEvents.map(evt => (
                      <div 
                        key={evt.id} 
                        className={cn("w-1.5 h-1.5 rounded-full", getEventColor(evt.type))} 
                      />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
