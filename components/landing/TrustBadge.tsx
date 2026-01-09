"use client";

import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

interface TrustBadgeProps {
  text: string;
  delay?: number;
}

export default function TrustBadge({ text, delay = 0 }: TrustBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium"
    >
      <CheckCircle className="w-3.5 h-3.5" />
      {text}
    </motion.div>
  );
}
