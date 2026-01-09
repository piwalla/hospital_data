"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'min' | 'max' | 'step'> {
  value: number[];
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number[]) => void;
}

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  ({ className, value, min, max, step, onValueChange, ...props }, ref) => {
    const val = value[0] ?? min;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
       onValueChange([parseFloat(e.target.value)]);
    };

    return (
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={val}
        onChange={handleChange}
        ref={ref}
        className={cn(
          "w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary",
          className
        )}
        {...props}
      />
    )
  }
)
Slider.displayName = "Slider"

export { Slider }
