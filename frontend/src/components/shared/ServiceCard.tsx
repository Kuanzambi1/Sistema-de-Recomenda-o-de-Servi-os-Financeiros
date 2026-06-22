"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  value: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  className?: string;
}

export default function ServiceCard({
  icon: Icon,
  title,
  description,
  checked,
  onCheckedChange,
  className,
}: ServiceCardProps) {
  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all duration-200 border-2",
        checked
          ? "bg-[#f0f3ff] border-blue-500 shadow-md"
          : "bg-white border-[#c4c6d0] hover:border-gray-300 hover:shadow-sm",
        className
      )}
      onClick={() => onCheckedChange(!checked)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="shrink-0 mt-1">
            <Checkbox
              checked={checked}
              onClick={(e) => e.stopPropagation()}
              onCheckedChange={(value) => {
                onCheckedChange(value === true);
              }}
              className="w-6 h-6 cursor-pointer rounded-full"
            />
          </div>

          <div className="shrink-0">
            <div className="w-12 h-12 rounded-lg flex bg-[#0f2b5b] text-[#7c94ca] items-center justify-center">
              <Icon className="w-6 h-6" />
            </div>
          </div>

          <div className="flex-1">
            <h3
              className={cn(
                "font-semibold text-lg mb-1 transition-colors",
                checked ? "text-primary" : "text-[#1f2937]"
              )}
            >
              {title}
            </h3>

            <p className="text-sm text-[#6b7280]">
              {description}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}