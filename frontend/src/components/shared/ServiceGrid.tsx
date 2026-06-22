"use client";

import { useState, useEffect } from "react";
import ServiceCard from "./ServiceCard";
import {
  LucideIcon,
  BriefcaseBusiness,
  Home,
  Building2,
  Heart,
  Pill,
  Car,
} from "lucide-react";

interface Service {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

interface ServiceGridProps {
  onSelectionChange?: (selectedServices: string[]) => void;
  selectedValues?: string[];
  className?: string;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: "credito-pessoal",
    icon: BriefcaseBusiness,
    title: "Crédito Pessoal",
    description:
      "Soluções flexíveis para os seus projetos imediatos ou imprevistos.",
  },
  {
    id: "habitacao",
    icon: Home,
    title: "Habitação",
    description:
      "Financiamento para compra, construção ou obras na sua casa própria.",
  },
  {
    id: "negocio",
    icon: Building2,
    title: "Negócio",
    description:
      "Capital de giro e investimentopara expandir a sua empresa em Angola.",
  },
  {
    id: "seguro-vida",
    icon: Heart,
    title: "Seguro de Vida",
    description:
      "Proteção e tranquilidade para o futuro da sua família e herdeiros.",
  },
  {
    id: "saude",
    icon: Pill,
    title: "Saúde",
    description:
      "Acesso às melhores redes médicas nacionais e internacionais.",
  },
  {
    id: "automovel",
    icon: Car,
    title: "Automóvel",
    description:
      "Condições especiais para adquirir o seu veículo novo ou usado.",
  },
];

function arraysEqual(a: string[], b: string[]) {
  if (a.length !== b.length) return false;

  return a.every((item, index) => item === b[index]);
}

export default function ServiceGrid({
  onSelectionChange,
  selectedValues = [],
  className = "",
}: ServiceGridProps) {
  const [selected, setSelected] = useState<string[]>(selectedValues);

  useEffect(() => {
    if (!arraysEqual(selected, selectedValues)) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  const handleToggle = (serviceId: string) => {
    const newSelected = selected.includes(serviceId)
      ? selected.filter((id) => id !== serviceId)
      : [...selected, serviceId];

    console.log("🔄 ServiceGrid - Seleção atualizada:", newSelected);

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}
    >
      {DEFAULT_SERVICES.map((service) => (
        <ServiceCard
          key={service.id}
          icon={service.icon}
          title={service.title}
          description={service.description}
          value={service.id}
          checked={selected.includes(service.id)}
          onCheckedChange={() => handleToggle(service.id)}
        />
      ))}
    </div>
  );
}