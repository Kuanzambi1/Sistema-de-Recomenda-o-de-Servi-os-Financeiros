# SRFS — Guia de Defesa do Projecto

> Documento de preparação para a defesa do **Sistema de Recomendação de Serviços Financeiros (SRFS)**.
> Este guia cobre: resumo executivo, justificação das escolhas técnicas, arquitectura, o motor
> de IA, regras de negócio, demonstração passo-a-passo, perguntas prováveis do júri com respostas,
> e um pitch final de 1 minuto.

---

## 1. Resumo executivo

O **SRFS** é um sistema informático que recomenda serviços financeiros — créditos, microcréditos,
seguros, contas poupança e investimentos — de forma **personalizada**, de acordo com o perfil
financeiro de cada utilizador, no contexto do **mercado angolano**.

### Problema que resolve

Escolher um produto financeiro é difícil e arriscado: existem muitos bancos, taxas e condições,
e a maioria das pessoas não sabe se *consegue* contratar um dado produto ou se ele é *vantajoso*
para si. O resultado é a perda de tempo, tomada de decisão errada e risco de sobre-endividamento.

### Solução

O SRFS faz o papel de um "consultor financeiro automático":

1. O utilizador preenche o seu perfil (rendimento, despesas, score de crédito, conta bancária, etc.).
2. O sistema **filtra** os serviços que o utilizador não pode contratar.
3. Um **modelo de inteligência artificial** (Regressão Logística) calcula a probabilidade de
   adequação de cada serviço ao perfil.
4. As recomendações são **ordenadas** da mais adequada para a menos adequada.
5. Cada recomendação vem com uma **explicação em linguagem natural** (porquê foi recomendada).
6. O utilizador aceita/rejeita e **avalia**; o feedback **melhora o modelo** ao longo do tempo.

### Para quem é o sistema (3 perfis)

| Perfil | Papel |
|--------|-------|
| **Utilizador** | Pessoa comum que procura recomendações financeiras personalizadas |
| **Provedor** | Bancos e seguradoras que cadastram e gerem os seus produtos |
| **Administrador** | Supervisiona o sistema, gere utilizadores, acompanha e re-treina o modelo de IA |

---

## 2. Justificação das escolhas técnicas

| Camada | Tecnologia | Porquê |
|--------|-----------|--------|
| **Frontend** | Next.js + React + Tailwind + shadcn/ui | React é o standard da indústria; Next.js dá renderização no servidor (SEO, performance), rotas por ficheiro e suporte a "client components" para as páginas interactivas. Tailwind + shadcn garantem uma UI consistente e rápida de desenvolver. |
| **Backend** | Node.js + Express + PostgreSQL | Node.js/Express é leve, rápido e tem um ecossistema maduro (autenticação, validação, rate limiting). PostgreSQL é relacional (dados estruturados: utilizadores, perfis, serviços, recomendações, feedbacks) com integridade forte (chaves estrangeiras, CHECK, colunas geradas). |
| **IA** | Python + FastAPI + Scikit-learn | Python é a linguagem padrão de ciência de dados; Scikit-learn tem implementações prontas e testadas de Regressão Logística, scalers e métricas de avaliação. FastAPI expõe o modelo como serviço HTTP simples e eficiente. |
| **Autenticação** | JWT + bcrypt | Stateless (o servidor não guarda sessões), seguro com passwords hasheadas (bcrypt, custo 12). |
| **Comunicação API↔ML** | Axios / HTTP REST | Separação clara de responsabilidades: a API orquestra, o serviço ML só calcula. Se o ML falhar, a API não cai (fallback). |

### Arquitectura de 3 camadas

```
┌──────────────┐   HTTP/JSON    ┌──────────────┐   HTTP/JSON   ┌──────────────┐
│  Frontend    │ ──────────────►│  API Node.js │ ─────────────►│  Minha IA    │
│  (Next.js)   │ ◄──────────────│  (Express)   │ ◄─────────────│ (FastAPI +   │
│  :3000       │                │  :3333       │                │ Scikit-learn)│
└──────────────┘                └──────┬───────┘                └──────:8000────┘
                                       │ SQL
                                 ┌─────▼─────┐
                                 │ PostgreSQL│
                                 └───────────┘
```

**Porquê separar a IA num serviço próprio?** O treino e a reutilização do modelo exigem bibliotecas
Python que não existem nativamente no Node.js. Separar permite: (1) escalar o ML de forma
independente, (2) isolar falhas (fallback), e (3) trocar o modelo sem reescrever a aplicação.

---

## 3. Base de dados (PostgreSQL)

### Principais tabelas

| Tabela | Descrição |
|--------|-----------|
| `utilizadores` | Contas (tipo: utilizador, provedor, administrador) |
| `perfis_financeiros` | Dados financeiros de cada utilizador (rendimento, despesas, score, etc.) |
| `servicos_financeiros` | Produtos cadastrados pelos provedores (juro, prazos, montantes, requisitos mínimos) |
| `recomendacoes` | Recomendações geradas (probabilidade, posição, explicação, aceite, visualizada) |
| `feedbacks` | Avaliações Likert 1–5 de cada recomendação |
| `modelos_preditivos` | Histórico de versões do modelo de IA com métricas de desempenho |

### Destaque técnico: capacidade de endividamento

A `capacidade_endividamento` é calculada diretamente pela base de dados como **coluna gerada**:
30% do rendimento que sobra após as despesas mensais.

```sql
capacidade_endividamento NUMERIC(12,2) GENERATED ALWAYS AS (
  GREATEST((rendimento_mensal - despesas_mensais) * 0.30, 0)
) STORED
```

> **Exemplo:** rendimento 150.000 Kz − despesas 80.000 Kz = 70.000 Kz × 30% = **21.000 Kz/mês**.
> Isto garante consistência: o valor é sempre derivado, nunca inconsistente com os inputs.

A BD também garante integridade: chaves estrangeiras (CASCADE), CHECKs (escalas, valores ≥ 0),
um perfil por utilizador (UNIQUE), índices de performance e triggers que actualizam `atualizado_em`.

---

## 4. O motor de Inteligência Artificial

Esta é a parte mais importante da defesa. O modelo é uma **Regressão Logística**.

### 4.1 O que a Regressão Logística faz

Responder "este serviço é adequado ou não?" é uma classificação **binária**. A Regressão
Logística não responde apenas sim/não: devolve uma **probabilidade entre 0 e 1**, o que nos
permite **ordenar** os serviços do mais adequado para o menos adequado.

### 4.2 Engenharia de features (29 características)

O modelo não olha para o perfil nem para o serviço isoladamente — analisa o **par
(perfil × serviço)**. Para cada par, constrói 29 features em 3 grupos:

1. **Dados do perfil**: rendimento, despesas, capacidade de endividamento, dependentes, score,
   conta bancária, histórico de crédito.
2. **Dados do serviço**: taxa de juro, prazo máximo, montante máximo, rendimento mínimo.
3. **Características calculadas**:
   - **Rácio rendimento/exigido** = rendimento ÷ rendimento mínimo do serviço
   - **Rácio de poupança** = (rendimento − despesas) ÷ rendimento
   - **Encodings ordinais** para nível de educação e situação de emprego (ex.: primária=0 …
     doutoramento=4)
   - **One-hot encoding** para o objetivo financeiro (5) e o tipo de serviço (8)

### 4.3 Treino com dados sintéticos

O modelo base foi treinado com **500 exemplos sintéticos** representativos do mercado angolano
(rendimentos 30.000–500.000 Kz, scores 0–1000, todos os tipos de serviço). A cada exemplo foi
atribuído um **rótulo** (adequado=1 / inadequado=0) com base em regras práticas (rendimento
suficiente? score aceitável? tipo compatível?), e adicionou-se **10% de ruído aleatório** para
simular o comportamento real. Durante o treino, o algoritmo aprendeu **29 pesos** (importância de
cada característica) + 1 intercepto.

### 4.4 Predição em 2 passos

**Passo 1 — Normalização (StandardScaler):** as features têm escalas muito diferentes (rendimento
na casa dos milhares vs variáveis 0/1). O StandardScaler centra em média 0 e desvio padrão 1,
para nenhuma feature dominar o cálculo.

**Passo 2 — Combinação linear + sigmoide:**

```
Z = w₁x₁ + w₂x₂ + … + w₂₉x₂₉ + b
probabilidade = 1 / (1 + e⁻ᶻ)
```

- Z muito grande positivo → probabilidade perto de **100%**
- Z perto de 0 → perto de **50%**
- Z muito negativo → perto de **0%**

> **Exemplo (Ana):** Crédito Pessoal BIC Express → Z ≈ 2.5 → sigmoide → **92.3%** adequação.
> Microcrédito → Z ≈ −0.2 → **45.0%** (o microcrédito é para quem tem renda baixa e sem
> histórico; a Ana tem um perfil forte, logo não é o ideal).

### 4.5 Melhoria contínua (re-treino com feedback)

1. O utilizador avalia cada recomendação de **1 a 5** (escala Likert).
2. O sistema acumula os feedbacks (nota ≥ 4 → "adequado", nota < 4 → "inadequado").
3. Com **≥ 50 feedbacks**, o administrador pode **re-treinar** o modelo com dados **reais**.
4. O novo modelo substitui o anterior e o histórico de versões fica registado na tabela
   `modelos_preditivos`.

Com o tempo, o modelo deixa de depender dos dados sintéticos e passa a reflectir o
**comportamento real** dos utilizadores angolanos.

### 4.6 Métricas de validação (Sprint 2)

Avaliação experimental com partição de teste estratificada (20% de 500):

| Métrica | Valor | Interpretação |
|---------|-------|---------------|
| Acurácia | **75.0%** | Percentagem global de recomendações correctas |
| Precisão | **72.2%** | 7 em 10 recomendações são de facto adequadas (menos falsos positivos → menos sobre-endividamento) |
| Recall | **79.6%** | identificamos ~80% dos produtos viáveis (menos falsos negativos → menos exclusão de crédito) |
| F1-Score | **75.7%** | Equilíbrio entre precisão e recall |
| AUC-ROC | **84.0%** | Excelente capacidade de distinguir adequado de inadequado |

---

## 5. Regras de negócio implementadas

| Código | Regra |
|--------|-------|
| RN01–RN03 | Validação de elegibilidade: rendimento mínimo, conta bancária, score de crédito mínimo |
| RN04 | Recomendações ordenadas por probabilidade de adequação (modelo ML) |
| RN05 | Explicação textual de cada recomendação (XAI simplificado) |
| RN06 | Escala Likert 1–5 para feedback |
| RN07 | Rate limiting — máx. 100 pedidos / 15 min por IP |
| RN08 | Re-treino do modelo quando existem ≥ 50 feedbacks |
| RN09 | Máximo de 10 recomendações por sessão |
| RN10 | Fallback heurístico quando o serviço ML está indisponível |

**Requisitos funcionais cobertos** (mapeamento típico de um Trabalho de Fim de Curso):
RF01 autenticação e registo · RF02 gestão de perfil · RF03 cadastro de serviços (provedor) ·
RF04 filtragem de elegibilidade · RF05 geração de recomendações ordenadas · RF06 explicação das
recomendações (XAI) · RF07 feedback/avaliação · RF08 painel administrativo · RF09 dashboard de
métricas · RF10 re-treino do modelo.

---

## 6. Demonstração passo-a-passo

### 6.1 Ordem de arranque

```bash
# 1. Base de dados PostgreSQL
psql -U postgres -c "CREATE USER srfs_user WITH PASSWORD 'srfs_password_segura';"
psql -U postgres -c "CREATE DATABASE financial_services OWNER srfs_user;"

# 2. Estrutura + dados de exemplo
cd Backend/node-api
node ../database/migrate.js    # cria as tabelas
node ../database/seed.js       # insere admin, 8 bancos, 3 utilizadores, 28 serviços, 5 versões de modelo

# 3. API Node.js (porta 3333)
npm run dev

# 4. Serviço ML Python (porta 8000)
cd ../ml-service
venv\Scripts\activate          # (Windows)
uvicorn main:app --reload --port 8000

# 5. Frontend Next.js (porta 3000)
cd ../../frontend
npm run dev
```

### 6.2 Credenciais de teste (após seed)

| Tipo | Email | Password |
|------|-------|----------|
| Administrador | `admin@srfs.ao` | `Admin@2025!` |
| Utilizador (Ana) | `ana@exemplo.ao` | `User@2025!` |
| Provedor | `bic@srfs.ao` | `Banco@2025!` |

### 6.3 Cenário de demonstração recomendado (Ana Joaquim)

1. **Login** como `ana@exemplo.ao` — perfil já preenchido (rendimento 150.000 Kz, despesas 80.000 Kz,
   conta bancária, histórico de crédito, score 650, 2 dependentes).
2. Clicar **"Gerar Novas Recomendações"**.
3. O sistema chama `/api/recomendacoes` → filtra serviços (ex.: Crédito Habitação BIC Prime exige
   score 700; a Ana tem 650 → eliminado) → chama o ML → o ML devolve probabilidades → ordena e guarda.
4. Mostrar o **ranking**: Crédito Pessoal BIC Express 92.3% em primeiro, Microcrédito 45.0% em último.
5. Abrir uma recomendação e ler a **explicação** gerada (XAI) — referir o número real.
6. Avaliar com nota → mostrar que o feedback ficou registado.
7. (Opcional) No painel do admin, mostrar **histórico de modelos** com as métricas (v1.0.0 … v2.1.0)
   e a aba "Testes [Resultados] — Sprint 2" com a matriz de confusão.

> **Dica de demonstração:** se possível, ter 3 separadores abertos — frontend, Swagger do ML
> (`http://localhost:8000/docs`) e o painel admin — para mostrar a integração ao vivo.

---

## 7. Perguntas prováveis do júri + respostas

### Conceitos gerais

**P1. O que faz o sistema, em uma frase?**
> Recomenda serviços financeiros personalizados com base no perfil financeiro do utilizador,
> usando regressão logística para calcular a probabilidade de adequação de cada produto.

**P2. Quais são os tipos de utilizadores e o que cada um pode fazer?**
> Utilizador (cria perfil e recebe recomendações), provedor (cadastra/actualiza produtos e vê
> análises), administrador (métricas globais, gestão de utilizadores, re-treino e acompanhamento
> do modelo de IA). A autorização é feita por middleware (JWT + RBAC).

**P3. Como é calculada a capacidade de endividamento?**
> É 30% do rendimento que sobra após as despesas: `(rendimento − despesas) × 0.30`. É uma coluna
> gerada na BD, garantindo consistência.

### Inteligência Artificial (motor)

**P4. Porquê Regressão Logística e não outro algoritmo?**
> Porque o problema é uma **classificação binária** (adequado/inadequado) e a RL devolve uma
> **probabilidade**, que é exactamente o que precisamos para ordenar recomendações. Além disso é
> **interpretável** (os pesos mostram a importância de cada factor) — fundamental para um sistema
> financeiro com explicabilidade. Alternativas como árvores de decisão/random forest foram
> consideradas, mas a RL equilibra simplicidade, interpretabilidade e desempenho (AUC-ROC 84%).*

**P5. O modelo foi treinado com dados reais?**
> Nesta fase de desenvolvimento o modelo base foi treinado com **500 amostras sintéticas**
> representativas do mercado angolano. A validação foi feita numa partição de teste estratificada.
> O que torna o sistema auto-sustentável é o **re-treino com feedback real**: a partir de 50
> avaliações, o modelo é re-treinado com dados reais dos utilizadores. A arquitectura está
> preparada para evoluir de dados sintéticos para dados reais ao longo do tempo.

**P6. O que é a função sigmoide e porquê usá-la?**
> É a função que transforma o valor linear Z em probabilidade entre 0 e 1:
> `1/(1+e⁻ᶻ)`. É ideal porque é contínua, diferenciável e mapeia qualquer valor real para o
> intervalo [0,1].

**P7. O que é o StandardScaler e porquê é necessário?**
> Normaliza as features para média 0 e desvio padrão 1. É necessário porque as features têm
> escalas muito diferentes (rendimento na casa dos milhares; variáveis binárias 0/1). Sem
> normalização, as features com valores grandes dominariam o cálculo (afectadas pelo gradiente da
> RL) e as pequenas seriam ignoradas.

**P8. O que é uma feature e quais usa o modelo?**
> Uma feature é uma variável numérica que representa uma característica da observação. O modelo
> usa 29 features por par perfil×serviço: dados do perfil, dados do serviço e características
> calculadas (rácios, encodings ordinais, one-hot).

**P9. Como o feedback melhora o modelo?**
> Feedbacks ≥ 4 tornam-se rótulos "adequado=1"; feedbacks < 4 tornam-se "adequado=0". Com 50+
> feedbacks o administrador re-treina o modelo com estes dados reais e a nova versão substitui a
> anterior, ficando registada no histórico com métricas.

**P10. O que significam as métricas (Acurácia, Precisão, Recall, F1, AUC-ROC)?**
> Acurácia: % de correctos. Precisão: dos recomendados, quantos são realmente adequados (importante
> para evitar sobre-endividamento). Recall: dos adequados, quantos foram recomendados (importante
> para não excluir produtos úteis). F1: média harmónica das duas. AUC-ROC: capacidade de
> distinguir adequado de inadequado.

### Arquitectura, segurança e resiliência

**P11. Como funciona o fallback quando o ML está offline?**
> A API envolve a chamada ao ML num try/catch. Se falhar (timeout de 10s ou erro de ligação), usa
> uma **heurística** que imita o raciocínio do modelo, somando pontos por histórico de crédito,
> conta bancária, score alto e rácio rendimento/exigido. O utilizador recebe sempre recomendações,
> apenas com menos precisão momentânea.

**P12. Como é feita a segurança?**
> Passwords hasheadas com bcrypt (custo 12), autenticação por JWT com expiração de 7 dias, controlo
> de acesso por tipo de utilizador (RBAC), validação de inputs (express-validator + Zod),
> protecção contra brute force (rate limiting), headers de segurança (Helmet), e impedimento de
> criação de administradores via API pública.

**P13. Porque usar um serviço ML separado em vez de integrar no Node.js?**
> Scikit-learn é uma biblioteca Python; o Node.js não a executa nativamente. A separação permite
> escalar o ML independentemente, isolar falhas (com fallback) e evoluir o modelo sem tocar na
> aplicação principal.

**P14. Como garante que o utilizador só vê as próprias recomendações?**
> Todas as queries filtram por `utilizador_id` do token autenticado (ex.: na busca da recomendação
> usa-se `WHERE id = $1 AND utilizador_id = $2`), e as rotas exigem o perfil correcto via RBAC.

**P15. Como o provedor (banco) cadastra um serviço?**
> Através de uma rota protegida (`POST /api/servicos`, com autorização de provedor/administrador),
> indicando nome, tipo, taxa de juro, prazos, montantes, renda mínima, score mínimo e se requer
> conta bancária. O serviço passa a ser considerado na filtragem e nas recomendações.

### Negócio e viabilidade

**P16. Porque é que o Crédito BIC Express tem 92.3% para a Ana e o Microcrédito só 45%?**
> A Ana tem um perfil forte (renda 150.000 Kz, histórico de crédito, score 650, conta bancária). O
> crédito pessoal com juros razoáveis aproveita esse perfil. O microcrédito foi desenhado para
> rendas baixas e sem histórico; para um perfil forte ele não é a opção ideal — o modelo aprendeu
> esse padrão nos dados.

**P17. O que distingue este sistema de uma simples "lista de produtos"?**
> Três coisas: **filtragem automática** de elegibilidade, **probabilidade/ordenação inteligente**
> e **explicação personalizada** de cada recomendação (XAI). Não é apenas um catálogo — é um
> consultor automático.

**P18. Que trabalho futuro existe?**
> Mais dados reais para re-treinos (quanto mais feedback, melhor o modelo), integração com APIs
> reais dos bancos, análise de risco de crédito mais profunda, e a possibilidade de comparar
> modelos (ex.: Random Forest, XGBoost) para escolher o melhor.

---

## 8. Fragilidades conhecidas (e como responder com honestidade)

O júri pode apontar limitações. Resposta correcta: **reconhecer, contextualizar e mostrar o
mitigação já implementada ou planeada.**

| Fragilidade | Contexto / mitigação |
|-------------|----------------------|
| Modelo treinado com **dados sintéticos** | O objectivo do TFC é provar a arquitectura e o método. A validação foi experimental (Sprint 2) e o desenho contempla re-treino com dados reais a partir do feedback — o modelo evolui sozinho. |
| Testes automatizados limitados no Node.js | Existem testes unitários (lógica das recomendações) e testes do modelo Python (mais profundos). Podem ser ampliados. |
| Dados/credenciais no repositório | O `.env` deveria estar fora do controlo de versões; recomendo mover para `.env.example` e ignorar o `.env` (checklist abaixo). |
| Portas em documentos inconsistentes (3000 vs 3333 vs 3001) | A API corre em `3333`, o frontend aponta para `3001`/`3000` conforme env; documentação recente a actualizar. |
| Escala (amostras ou serviços em produção) | A arquitectura é horizontalmente escalável: a BD tem índices; o ML é um serviço independente que pode ser replicado. |

---

## 9. Pitch de defesa (1 minuto)

> "O SRFS é um sistema que personaliza a recomendação de serviços financeiros para o utilizador
> angolano. O utilizador preenche o seu perfil e o sistema faz três coisas: **filtra** os produtos
> que ele não pode contratar, usa um **modelo de IA de regressão logística** para calcular a
> probabilidade de adequação de cada serviço, e **explica em linguagem natural** porque cada produto
> foi recomendado. O resultado é um ranking por ordem de compatibilidade, com no máximo 10
> recomendações. Os bancos cadastram os seus produtos, e o administrador acompanha métricas e
> re-treina o modelo com o feedback dos utilizadores — o que torna o sistema cada vez mais preciso.
> Tudo isto com segurança (JWT, bcrypt, controlo de permissões), resiliência (se o motor de IA
> falhar, um fallback garante que o utilizador nunca fica sem resposta) e validação experimental com
> 84% de AUC-ROC num conjunto de teste."

---

## 10. Checklist final antes da defesa

- [ ] Confirmar que **PostgreSQL**, **API (3333)**, **ML (8000)** e **frontend (3000)** arrancam todos.
- [ ] Fazer o cenário da Ana e memorizar os números (92.3%, 45.0%, 21.000 Kz/mês).
- [ ] Testar o **fallback** (fechar o serviço ML e gerar recomendações na mesma).
- [ ] Guardar os diagramas/serviços de apoio fora do controlo de versões.
- [ ] **Segurança:** mover `Backend/node-api/.env` para `.env.example` e adicionar `.env` ao
       `.gitignore` (evitar expor credenciais na defesa e no repositório).
- [ ] Verificar se os ports dos README correspondem à realidade (3000/3333/3001).
- [ ] Preparar resposta honesta para as fragilidades da secção 8.
- [ ] Ter uma demonstração gravada de reserva (caso a internet/bases falhem no momento).