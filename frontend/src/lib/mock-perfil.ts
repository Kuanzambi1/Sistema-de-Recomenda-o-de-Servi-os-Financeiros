import { PerfilFinanceiro } from "@/types";

export const mockPerfilFinanceiro: PerfilFinanceiro = {
  id: "perfil-1",
  utilizador_id: "user-1",
  rendimento_mensal: 200000,
  despesas_mensais: 80000,
  dependentes: 2,
  nivel_educacao: "licenciatura",
  situacao_emprego: "empregado",
  tem_conta_bancaria: true,
  tem_historico_credito: true,
  score_credito: 450,
  objectivo_financeiro: "credito_pessoal",
  capacidade_endividamento: 120000,
  criado_em: "2025-06-01T10:00:00Z",
  atualizado_em: "2025-06-25T14:00:00Z",
};
