import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Formatadores de moeda (Kwanza angolano) ──────────────────────────────────
export function formatKwanza(value: number): string {
  return new Intl.NumberFormat("pt-AO", {
    style: "currency",
    currency: "AOA",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// ─── Formatador de percentagem ────────────────────────────────────────────────
export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

// ─── Formatador de data ───────────────────────────────────────────────────────
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat("pt-AO", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(dateStr));
}

// ─── Calcula capacidade de endividamento (RN01) ───────────────────────────────
export function calcularCapacidadeEndividamento(
  rendimento: number,
  despesas: number
): number {
  const rendimentoLiquido = rendimento - despesas;
  return rendimentoLiquido * 0.3;
}

// ─── Verifica elegibilidade mínima para crédito (RN02) ───────────────────────
export function isElegivelCredito(rendimento: number): boolean {
  return rendimento >= 50000;
}

// ─── Converte probabilidade em label legível ──────────────────────────────────
export function labelAdequacao(probabilidade: number): {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
} {
  if (probabilidade >= 0.8)
    return { label: "Excelente", variant: "default" };
  if (probabilidade >= 0.6)
    return { label: "Boa", variant: "secondary" };
  if (probabilidade >= 0.4)
    return { label: "Razoável", variant: "outline" };
  return { label: "Baixa", variant: "destructive" };
}

// ─── Trunca texto longo ───────────────────────────────────────────────────────
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}