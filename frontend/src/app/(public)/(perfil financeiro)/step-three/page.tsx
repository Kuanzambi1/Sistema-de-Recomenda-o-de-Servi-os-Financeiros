"use client"

import { useState } from "react";
import AuthHeader from "@/components/auth/AuthHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Text from "@/components/ui/text";
import RadioOption from "@/components/ui/radio-option";
import { BriefcaseBusiness, Monitor, Building2, GraduationCap, ArrowRight, ChevronLeftIcon } from "lucide-react";
import { ToggleGroup, ToggleGroupItem,  } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import ServiceGrid from "@/components/shared/ServiceGrid";

export default function StepThree()
{
	const [selectedServices, setSelectedServices] = useState<string[]>([]);

	const handleServiceSelection = (services: string[]) => {
    	setSelectedServices(services);
    	console.log("Serviços selecionados:", services);
};
	return (
		<main className="flex flex-col items-center justify-center gap-8">
			<Card className="w-200 h-auto p-8 gap-2">
				<CardHeader>
					<Text as="h1" variant="h1">
						Conte-nos sobre Si
					</Text>
					<Text as="p" variant="p">
						Para criarmos recomendações personalizadas, precisamos entender o seu contexto actual.
					</Text>
				</CardHeader>

				<CardContent className="flex flex-col pt-6 gap-8">
					<ServiceGrid 
						onSelectionChange={handleServiceSelection}
						selectedValues={selectedServices}
					/>
				</CardContent>
			</Card>
		</main>
	)
}