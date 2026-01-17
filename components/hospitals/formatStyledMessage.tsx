
import React from 'react';

// Helper to format text with styled placeholders
export const formatStyledMessage = (text: string, values: Record<string, string>) => {
  if (!text) return null;
  
  // Split by placeholders like {key}
  const parts = text.split(/({[^}]+})/g);
  
  return (
    <>
      {parts.map((part, index) => {
        const match = part.match(/{([^}]+)}/);
        if (match) {
          const key = match[1];
          const value = values[key];
          // Check if value is meant to be a number (radius or count) for styling
          const isNumber = key === 'radius' || key === 'count' || !isNaN(Number(value));
          
          if (isNumber) {
             return <span key={index} className="mx-1 text-2xl font-extrabold text-[#2F6E4F]">{value}<span className="text-lg font-medium text-gray-700 ml-0.5">{key === 'radius' ? '' : ''}</span></span>;
          }
          return <span key={index} className="font-bold text-gray-900">{value}</span>;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
