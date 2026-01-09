import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface BenefitDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function BenefitDetailModal({
  isOpen,
  onClose,
  title,
  description,
  children
}: BenefitDetailModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 bg-white">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-slate-900">{title}</DialogTitle>
           {description && (
            <DialogDescription className="text-slate-500 mt-1.5 leading-relaxed">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 py-2">
          <div className="space-y-6 pb-6">
            {children}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 border-t border-slate-100 bg-slate-50 rounded-b-lg">
             <div className="flex items-start gap-2.5 mb-4 p-3 bg-amber-50 border border-amber-100 rounded-md">
                <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-700 leading-snug">
                    <strong>주의사항</strong>: 본 내용은 예상 수치이며, 
                    실제 지급액은 근로복지공단의 최종 심사 및 승인 결과(장해 등급, 평균임금 산정 등)에 따라 
                    달라질 수 있습니다.
                </p>
             </div>
            <DialogFooter className="sm:justify-end">
                <Button 
                    type="button" 
                    onClick={onClose}
                    className="bg-slate-900 text-white hover:bg-slate-800 w-full sm:w-auto"
                >
                    확인했습니다
                </Button>
            </DialogFooter>
        </div>

      </DialogContent>
    </Dialog>
  );
}

// Reusable Section Component for Modal Content
export function ModalSection({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                {title}
            </h3>
            <div className="text-sm text-slate-600 leading-relaxed pl-6">
                {children}
            </div>
        </div>
    );
}
