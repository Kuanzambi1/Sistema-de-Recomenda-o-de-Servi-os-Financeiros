"use client"

import { Card } from "@/components/ui/card";
import Text from "@/components/ui/text";
import { ComponentType, SVGProps } from "react";

interface RadioOptionProps {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  value: string;
  checked?: boolean;
  onChange?: (value: string) => void;
  className?: string;
}

export default function RadioOption({
  icon: Icon,
  title,
  description,
  value,
  checked = false,
  onChange,
  className = "",
}: RadioOptionProps) {
  const handleChange = () => {
	onChange?.(value);
  };

  return (
	<label className="cursor-pointer block w-full h-20.5">
	  <input
		type="radio"
		name="radio-option"
		value={value}
		checked={checked}
		onChange={handleChange}
		className="hidden"
	  />
	  <Card
		className={`
		  w-full flex flex-row p-4 gap-2 transition-all duration-200 border-2
		  ${checked
			? "bg-[#f0f3ff] border-blue-500 shadow-md"
			: "bg-white border-[#c4c6d0] hover:border-gray-300 hover:shadow-sm"
		  }
		  ${className}
		`}
	  >
		<div className={`w-12 h-12 flex justify-center items-center rounded-[8px]
				${checked ? 
					"bg-primary": "bg-[#E2E8F8]"}
			 `}>
			<Icon
			className={`w-5 h-5 transition-colors ${
				checked ? "text-white" : "text-[#44474F]"
			}`}
			/>
		</div>
		
		<div className="w-[75%] h-auto flex flex-col ">
			<Text
				as="h6"
				className={`transition-colors ${
				checked ? "text-blue-900" : "text-gray-900"
		  		}`}
			>
		  		{title}
			</Text>
		
			<Text
		  		className={`transition-colors ${
				checked ? "text-blue-700" : "text-gray-600"
		  		}`}
			>
				{description}
			</Text>
		</div>
		
	  </Card>
	</label>
  );
}
