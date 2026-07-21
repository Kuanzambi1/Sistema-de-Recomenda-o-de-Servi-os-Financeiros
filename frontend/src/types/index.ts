// ─── Enums ────────────────────────────────────────────────────────────────────

export type UserTipo = "utilizador" | "provedor" | "admin";

export type TipoServico = "credito" | "seguro";

export type SituacaoEmprego =
  | "empregado"
  | "desempregado"
  | "autonomo"
  | "estudante"
  | "reformado";

export type NivelEducacao =
  | "primario"
  | "secundario"
  | "licenciatura"
  | "mestrado"
  | "doutoramento";

export type ObjetivoFinanceiro =
  | "credito_pessoal"
  | "credito_habitacao"
  | "credito_negocio"
  | "seguro_vida"
  | "seguro_saude"
  | "seguro_automovel";

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  nome: string;
  email: string;
  tipo: UserTipo;
  ativo: boolean;
  has_perfil_financeiro?: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  nome: string;
  email: string;
  password: string;
}

// ─── Perfil Financeiro ────────────────────────────────────────────────────────

export interface PerfilFinanceiro {
  id: string;
  utilizador_id: string;
  rendimento_mensal: number;
  despesas_mensais: number;
  dependentes: number;
  nivel_educacao: NivelEducacao;
  situacao_emprego: SituacaoEmprego;
  tem_conta_bancaria: boolean;
  tem_historico_credito: boolean;
  score_credito: number;
  objectivo_financeiro: ObjetivoFinanceiro;
  capacidade_endividamento: number;
  criado_em: string;
  atualizado_em: string;
}

export interface PerfilFinanceiroPayload {
  rendimento_mensal: number;
  despesas_mensais: number;
  dependentes: number;
  nivel_educacao: NivelEducacao;
  situacao_emprego: SituacaoEmprego;
  tem_conta_bancaria: boolean;
  tem_historico_credito: boolean;
  score_credito?: number;
  objectivos: string[];
}

// ─── Serviço Financeiro ───────────────────────────────────────────────────────

export interface ServicoFinanceiro {
  id: string;
  provedor_id: string;
  provedor_nome?: string;
  nome: string;
  tipo: TipoServico;
  descricao: string;
  taxa_juro_anual: number;
  prazo_minimo_meses: number;
  prazo_maximo_meses: number;
  montante_minimo: number;
  montante_maximo: number;
  rendimento_minimo: number;
  score_credito_minimo: number;
  requer_conta_bancaria: boolean;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
}

export interface ServicoFinanceiroPayload {
  nome: string;
  tipo: TipoServico;
  descricao: string;
  taxa_juro_anual: number;
  prazo_minimo_meses: number;
  prazo_maximo_meses: number;
  montante_minimo: number;
  montante_maximo: number;
  rendimento_minimo: number;
  score_credito_minimo: number;
  requer_conta_bancaria: boolean;
}

// ─── Recomendação ─────────────────────────────────────────────────────────────

export interface Recomendacao {
  id: string;
  utilizador_id: string;
  perfil_financeiro_id: string;
  servico_financeiro_id: string;
  servico: ServicoFinanceiro;
  probabilidade_adequacao: number;
  posicao_ranking: number;
  explicacao: string;
  aceite: boolean;
  visualizada: boolean;
  criado_em: string;
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

export interface Feedback {
  id: string;
  utilizador_id: string;
  recomendacao_id: string;
  nota_likert: 1 | 2 | 3 | 4 | 5;
  comentario: string;
  util: boolean;
  criado_em: string;
}

export interface FeedbackPayload {
  recomendacao_id: string;
  nota_likert: 1 | 2 | 3 | 4 | 5;
  comentario?: string;
  util: boolean;
}

// ─── Modelo Preditivo ─────────────────────────────────────────────────────────

export interface ModeloPreditivo {
  id: string;
  versao: string;
  algoritmo: string;
  acuracia: number;
  precisao: number;
  recall: number;
  f1_score: number;
  auc_roc: number;
  amostras_treino: number;
  ativo: boolean;
  criado_em: string;
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface RecomendacoesQuery {
  tipo?: "credito" | "seguro"
  ordenar?: "adequacao" | "taxa" | "montante"
  page?: number
  limit?: number
}

export interface HistoricoQuery {
  tipo?: "credito" | "seguro"
  status?: "aceites" | "nao_aceites" | "todos"
  data_inicio?: string
  data_fim?: string
  page?: number
  limit?: number
}

export interface ServicosQuery {
  search?: string
  tipo?: "credito" | "seguro"
  ativo?: boolean
  page?: number
  limit?: number
}

export interface UtilizadoresQuery {
  search?: string
  tipo?: string
  ativo?: boolean
  page?: number
  limit?: number
}

export interface FeedbacksQuery {
  data_inicio?: string
  data_fim?: string
  rating?: number
  util?: boolean
  page?: number
  limit?: number
}

// ─── Admin Types ───────────────────────────────────────────────────────────────

export interface DashboardResponse {
  stats: {
    total_utilizadores: number
    total_provedores: number
    servicos_ativos: number
    recomendacoes_geradas: number
  }
  modelo_ml: {
    versao: string
    ativo: boolean
    acuracia: number
    precisao: number
    recall: number
    f1_score: number
    auc_roc: number
    amostras_treino: number
    historico: HistoricoMetrica[]
  }
  recentes: {
    utilizadores: UtilizadorRecente[]
    recomendacoes: RecomendacaoRecente[]
  }
}

export interface HistoricoMetrica {
  versao: string
  data: string
  acuracia: number
  precisao: number
  recall: number
  f1_score: number
}

export interface UtilizadorRecente {
  id: string
  nome: string
  email: string
  tipo: string
  ativo: boolean
  created_at: string
}

export interface RecomendacaoRecente {
  id: string
  user_nome: string
  servico_nome: string
  probabilidade_adequacao: number
  created_at: string
}

export interface Utilizador {
  id: string
  nome_completo: string
  email: string
  tipo: "utilizador" | "provedor" | "admin"
  ativo: boolean
  created_at: string
  perfil_financeiro?: PerfilFinanceiro | null
}

export interface Provedor {
  id: string
  nome_empresa: string
  email: string
  ativo: boolean
  total_servicos: number
  created_at: string
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status: number;
}