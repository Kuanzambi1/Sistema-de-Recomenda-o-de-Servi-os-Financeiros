"use client";

import { useState, useEffect } from "react";
import { ObjetivoFinanceiro } from "@/types";
import ServiceCard from "@/components/shared/ServiceCard";
import {
  BriefcaseBusiness,
  Home,
  Building2,
  Heart,
  Pill,
  Car,
  LucideIcon,
} from "lucide-react";

interface ObjetivoGridProps {
  onSelectionChange?: (selectedObjetivos: ObjetivoFinanceiro[]) => void;
  selectedValues?: ObjetivoFinanceiro[];
  className?: string;
}

const OBJETIVO_CONFIG: Record<ObjetivoFinanceiro, { icon: LucideIcon; title: string; description: string }> = {
  credito_pessoal: {
    icon: BriefcaseBusiness,
    title: "Crédito Pessoal",
    description: "Soluções flexíveis para os seus projetos imediatos ou imprevistos.",
  },
  credito_habitacao: {
    icon: Home,
    title: "Crédito Habitação",
    description: "Financiamento para compra, construção ou obras na sua casa própria.",
  },
  credito_negocio: {
    icon: Building2,
    title: "Crédito Negócio",
    description: "Capital de giro e investimento para expandir a sua empresa em Angola.",
  },
  seguro_vida: {
    icon: Heart,
    title: "Seguro de Vida",
    description: "Proteção e tranquilidade para o futuro da sua família e herdeiros.",
  },
  seguro_saude: {
    icon: Pill,
    title: "Seguro Saúde",
    description: "Acesso às melhores redes médicas nacionais e internacionais.",
  },
  seguro_automovel: {
    icon: Car,
    title: "Seguro Automóvel",
    description: "Proteção completa para o seu veículo em qualquer situação.",
  },
};

const OBJETIVO_IDS: ObjetivoFinanceiro[] = [
  "credito_pessoal",
  "credito_habitacao",
  "credito_negocio",
  "seguro_vida",
  "seguro_saude",
  "seguro_automovel",
];

function arraysEqual(a: ObjetivoFinanceiro[], b: ObjetivoFinanceiro[]) {
  if (a.length !== b.length) return false;
  return a.every((item, index) => item === b[index]);
}

export default function ObjetivoGrid({
  onSelectionChange,
  selectedValues = [],
  className = "",
}: ObjetivoGridProps) {
  const [selected, setSelected] = useState<ObjetivoFinanceiro[]>(selectedValues);

  useEffect(() => {
    if (!arraysEqual(selected, selectedValues)) {
      setSelected(selectedValues);
    }
  }, [selectedValues]);

  const handleToggle = (objetivoId: ObjetivoFinanceiro) => {
    const newSelected = selected.includes(objetivoId)
      ? selected.filter((id) => id !== objetivoId)
      : [...selected, objetivoId];

    setSelected(newSelected);
    onSelectionChange?.(newSelected);
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${className}`}>
      {OBJETIVO_IDS.map((objetivoId) => {
        const config = OBJETIVO_CONFIG[objetivoId];
        return (
          <ServiceCard
            key={objetivoId}
            icon={config.icon}
            title={config.title}
            description={config.description}
            value={objetivoId}
            checked={selected.includes(objetivoId)}
            onCheckedChange={() => handleToggle(objetivoId)}
          />
        );
      })}
    </div>
  );
}