
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { uploadRagDocument } from "@/app/actions/rag-admin";

// Access FileList in browser
const currentFileSchema = typeof window === "undefined" ? z.any() : z.instanceof(FileList);

const formSchema = z.object({
  koreanTitle: z.string().min(2, "한글 제목을 입력해주세요."),
  color: z.string().default("blue"),
  file: currentFileSchema.refine((files) => files?.length === 1, "PDF 파일을 선택해주세요.")
      .refine((files) => files?.[0]?.type === "application/pdf", "PDF 파일만 업로드 가능합니다.")
});

export function RagUploadForm() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string } | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      koreanTitle: "",
      color: "blue",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);

    const formData = new FormData();
    formData.append("koreanTitle", values.koreanTitle);
    formData.append("color", values.color);
    formData.append("file", values.file[0]);

    try {
      const res = await uploadRagDocument(formData);
      
      if (res.success) {
        setResult({ success: true, message: "문서가 성공적으로 등록되었습니다." });
        form.reset();
        // Close after brief delay or keep open to show success?
        // Let's keep open but show success message for 2 seconds then close
        setTimeout(() => {
             setOpen(false);
             setResult(null);
        }, 1500);
      } else {
        setResult({ success: false, message: res.message || "업로드 실패" });
      }
    } catch {
      setResult({ success: false, message: "알 수 없는 오류가 발생했습니다." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          문서 추가
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>새 문서 등록</DialogTitle>
          <DialogDescription>
            RAG 시스템에 활용될 새로운 지식 문서를 업로드합니다.
            <br />
            (파일명은 영문/숫자만 가능하며, 자동으로 변환되지 않습니다.)
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {result && (
                <div className={`p-3 rounded-md flex items-center gap-2 text-sm ${result.success ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {result.success ? <CheckCircle2 className="w-4 h-4"/> : <AlertCircle className="w-4 h-4"/>}
                    {result.message}
                </div>
            )}

            <FormField
              control={form.control}
              name="koreanTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>문서 제목 (한글)</FormLabel>
                  <FormControl>
                    <Input placeholder="예: 요양급여 신청 가이드" {...field} />
                  </FormControl>
                  <FormDescription>
                     챗봇 인용구에 표시될 이름입니다.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="file"
              render={({ field: { onChange, ...fieldProps } }) => (
                <FormItem>
                  <FormLabel>PDF 파일</FormLabel>
                  <FormControl>
                    <Input
                      {...fieldProps}
                      type="file"
                      accept=".pdf"
                      onChange={(event) => {
                        onChange(event.target.files && event.target.files);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>태그 색상</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="색상 선택" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="blue">Blue (기본)</SelectItem>
                      <SelectItem value="green">Green</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="yellow">Yellow</SelectItem>
                      <SelectItem value="purple">Purple</SelectItem>
                      <SelectItem value="gray">Gray</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                업로드 및 등록
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
