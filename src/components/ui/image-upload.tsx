import React from 'react';
import { cn } from "@/lib/utils";
import { Upload } from "lucide-react";

interface ImageUploadProps {
  value?: string | null;
  onChange: (file: File) => void;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  value, 
  onChange,
  className
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  return (
    <div className={cn(
      "border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1034A6] transition-colors",
      !value && "bg-slate-50",
      className
    )}>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
        id="logo-upload"
      />
      <label htmlFor="logo-upload" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4">
        {value ? (
          <img 
            src={value} 
            alt="Company logo" 
            className="max-w-full max-h-full object-contain"
          />
        ) : (
          <>
            <Upload className="h-8 w-8 text-gray-400 mb-2" />
            <span className="text-sm text-gray-500">Upload logo</span>
          </>
        )}
      </label>
    </div>
  );
};