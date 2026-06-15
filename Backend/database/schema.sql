-- =============================================
-- MIGRAÇÃO: criação das tabelas do SRFS
-- Sistema de Recomendação de Serviços Financeiros
-- =============================================

-- Extensão para UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------
-- TABELA: utilizadores
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS utilizadores (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome           VARCHAR(150)         NOT NULL,
    email          VARCHAR(255) UNIQUE  NOT NULL,
    password_hash  VARCHAR(255)         NOT NULL,
    tipo           VARCHAR(20)          NOT NULL DEFAULT 'utilizador'
                       CHECK (tipo IN ('utilizador', 'provedor', 'administrador')),
    ativo          BOOLEAN              NOT NULL DEFAULT TRUE,
    criado_em      TIMESTAMPTZ          NOT NULL DEFAULT NOW(),
    atualizado_em  TIMESTAMPTZ          NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------
-- TABELA: perfis_financeiros
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS perfis_financeiros (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilizador_id            UUID         NOT NULL REFERENCES utilizadores(id) ON DELETE CASCADE,
    rendimento_mensal        NUMERIC(12,2) NOT NULL CHECK (rendimento_mensal >= 0),
    despesas_mensais         NUMERIC(12,2) NOT NULL CHECK (despesas_mensais >= 0),
    dependentes              INTEGER       NOT NULL DEFAULT 0 CHECK (dependentes >= 0),
    nivel_educacao           VARCHAR(30)   NOT NULL
                                 CHECK (nivel_educacao IN ('primaria','secundaria','licenciatura','mestrado','doutoramento')),
    situacao_emprego         VARCHAR(30)   NOT NULL
                                 CHECK (situacao_emprego IN ('empregado','autonomo','desempregado','reformado','estudante')),
    tem_conta_bancaria       BOOLEAN       NOT NULL DEFAULT FALSE,
    tem_historico_credito    BOOLEAN       NOT NULL DEFAULT FALSE,
    score_credito            INTEGER       CHECK (score_credito BETWEEN 0 AND 1000),
    objetivo_financeiro      VARCHAR(30)
                                 CHECK (objetivo_financeiro IN ('poupanca','credito','seguro','investimento','todos')),
    capacidade_endividamento NUMERIC(12,2) GENERATED ALWAYS AS (
                                 GREATEST((rendimento_mensal - despesas_mensais) * 0.30, 0)
                             ) STORED,
    criado_em                TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    atualizado_em            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    CONSTRAINT um_perfil_por_utilizador UNIQUE (utilizador_id)
);

-- -----------------------------------------------
-- TABELA: servicos_financeiros
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS servicos_financeiros (
    id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provedor_id          UUID          NOT NULL REFERENCES utilizadores(id),
    nome                 VARCHAR(200)  NOT NULL,
    tipo                 VARCHAR(30)   NOT NULL
                             CHECK (tipo IN ('credito_pessoal','credito_habitacao','microcredito',
                                             'seguro_vida','seguro_saude','seguro_automovel',
                                             'conta_poupanca','investimento')),
    descricao            TEXT,
    taxa_juro_anual      NUMERIC(6,3)  CHECK (taxa_juro_anual >= 0),
    prazo_minimo_meses   INTEGER       CHECK (prazo_minimo_meses > 0),
    prazo_maximo_meses   INTEGER       CHECK (prazo_maximo_meses > 0),
    montante_minimo      NUMERIC(12,2) CHECK (montante_minimo >= 0),
    montante_maximo      NUMERIC(12,2),
    rendimento_minimo    NUMERIC(12,2) DEFAULT 0,
    score_credito_minimo INTEGER       DEFAULT 0,
    requer_conta_bancaria BOOLEAN      NOT NULL DEFAULT FALSE,
    ativo                BOOLEAN       NOT NULL DEFAULT TRUE,
    criado_em            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    atualizado_em        TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------
-- TABELA: recomendacoes
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS recomendacoes (
    id                       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilizador_id            UUID          NOT NULL REFERENCES utilizadores(id) ON DELETE CASCADE,
    perfil_financeiro_id     UUID          NOT NULL REFERENCES perfis_financeiros(id),
    servico_financeiro_id    UUID          NOT NULL REFERENCES servicos_financeiros(id),
    probabilidade_adequacao  NUMERIC(5,4)  NOT NULL CHECK (probabilidade_adequacao BETWEEN 0 AND 1),
    posicao_ranking          INTEGER       NOT NULL,
    explicacao               TEXT,
    aceite                   BOOLEAN,
    visualizada              BOOLEAN       NOT NULL DEFAULT FALSE,
    criado_em                TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------
-- TABELA: feedbacks
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS feedbacks (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    utilizador_id     UUID        NOT NULL REFERENCES utilizadores(id) ON DELETE CASCADE,
    recomendacao_id   UUID        NOT NULL REFERENCES recomendacoes(id) ON DELETE CASCADE,
    nota_likert       INTEGER     NOT NULL CHECK (nota_likert BETWEEN 1 AND 5),
    comentario        TEXT,
    util              BOOLEAN,
    criado_em         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT um_feedback_por_recomendacao UNIQUE (utilizador_id, recomendacao_id)
);

-- -----------------------------------------------
-- TABELA: modelos_preditivos (registo de versões)
-- -----------------------------------------------
CREATE TABLE IF NOT EXISTS modelos_preditivos (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    versao          VARCHAR(20)   NOT NULL UNIQUE,
    algoritmo       VARCHAR(100)  NOT NULL DEFAULT 'regressao_logistica',
    acuracia        NUMERIC(5,4),
    precisao        NUMERIC(5,4),
    recall          NUMERIC(5,4),
    f1_score        NUMERIC(5,4),
    auc_roc         NUMERIC(5,4),
    amostras_treino INTEGER,
    ativo           BOOLEAN       NOT NULL DEFAULT FALSE,
    criado_em       TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------
-- ÍNDICES para performance
-- -----------------------------------------------
CREATE INDEX IF NOT EXISTS idx_perfis_utilizador     ON perfis_financeiros(utilizador_id);
CREATE INDEX IF NOT EXISTS idx_recomendacoes_user    ON recomendacoes(utilizador_id);
CREATE INDEX IF NOT EXISTS idx_recomendacoes_servico ON recomendacoes(servico_financeiro_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_rec         ON feedbacks(recomendacao_id);
CREATE INDEX IF NOT EXISTS idx_servicos_tipo         ON servicos_financeiros(tipo);
CREATE INDEX IF NOT EXISTS idx_servicos_ativo        ON servicos_financeiros(ativo);

-- -----------------------------------------------
-- TRIGGER: atualizar atualizado_em automaticamente
-- -----------------------------------------------
CREATE OR REPLACE FUNCTION atualizar_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.atualizado_em = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_utilizadores_updated
    BEFORE UPDATE ON utilizadores
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_perfis_updated
    BEFORE UPDATE ON perfis_financeiros
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();

CREATE TRIGGER trg_servicos_updated
    BEFORE UPDATE ON servicos_financeiros
    FOR EACH ROW EXECUTE FUNCTION atualizar_timestamp();
