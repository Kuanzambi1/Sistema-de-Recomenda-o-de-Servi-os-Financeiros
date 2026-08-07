"use client";

import { useState, useEffect } from "react";
import { ObjetivoFinanceiro } from "@/types";
import ServiceCard from "@/components/shared/ServiceCard";
import {
  BriefcaseBusiness,
  Building2,
  Heart,
  PiggyBank,
  TrendingUp,
  LucideIcon,
} from "lucide-react";

interface ObjetivoGridProps {
  onSelectionChange?: (selectedObjetivos: ObjetivoFinanceiro[]) => void;
  selectedValues?: ObjetivoFinanceiro[];
  className?: string;
}

const OBJETIVO_CONFIG: Record<ObjetivoFinanceiro, { icon: LucideIcon; title: string; description: string }> = {
  credito: {
    icon: BriefcaseBusiness,
    title: "Crédito",
    description: "Crédito pessoal, habitação, microcrédito e muito mais.",
  },
  poupanca: {
    icon: PiggyBank,
    title: "Poupança",
    description: "Contas poupança para guardar e rentabilizar o seu dinheiro.",
  },
  seguro: {
    icon: Heart,
    title: "Seguro",
    description: "Seguros de vida, saúde e automóvel para sua proteção.",
  },
  investimento: {
    icon: TrendingUp,
    title: "Investimento",
    description: "Oportunidades de investimento para fazer o seu dinheiro crescer.",
  },
  todos: {
    icon: Building2,
    title: "Todos",
    description: "Quero ver todas as opções disponíveis no mercado.",
  },
};

const OBJETIVO_IDS: ObjetivoFinanceiro[] = [
  "credito",
  "poupanca",
  "seguro",
  "investimento",
  "todos",
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