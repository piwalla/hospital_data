import { Metadata } from "next";
import CalculatorClient from "./CalculatorClient";

export const metadata: Metadata = {
  title: "급여 계산기 | 리워크케어",
  description: "산재 평균임금, 휴업급여, 장해급여를 간편하게 계산해보세요",
};

export default function CalculatorPage() {
  return <CalculatorClient />;
}
