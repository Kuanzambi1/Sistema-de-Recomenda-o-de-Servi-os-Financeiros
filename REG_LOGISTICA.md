# Regressão Logística — Cálculo da Adequação Perfil × Serviço

## 1. O que é a Regressão Logística?

Imagine que queremos prever se um serviço financeiro é **adequado** ou **inadequado**
para uma pessoa. É uma pergunta de **sim ou não** (classificação binária).

A Regressão Logística é um algoritmo que, em vez de responder apenas "sim" ou "não",
responde com uma **probabilidade** entre 0% e 100%. Por exemplo:
- **92.3%** → muito provavelmente adequado
- **45.0%** → provavelmente inadequado

A grande vantagem é que podemos ordenar os serviços do mais adequado para o menos
adequado, e o utilizador vê primeiro os que têm maior probabilidade de lhe servir.

---

## 2. Onde entram os dados do utilizador e do serviço?

O modelo não olha para o perfil isoladamente, nem para o serviço isoladamente.
Ele analisa **pares (perfil × serviço)**. Para cada par, constrói um conjunto
de **características (features)** que descrevem a relação entre os dois.

Estas características são divididas em três grupos:

### Grupo 1: Dados do perfil do utilizador
| Característica | Exemplo (Ana) |
|---|---|
| Rendimento mensal | 150.000 Kz |
| Despesas mensais | 80.000 Kz |
| Capacidade de endividamento | 21.000 Kz/mês |
| Número de dependentes | 2 |
| Score de crédito (0–1000) | 650 |
| Tem conta bancária? | Sim |
| Tem histórico de crédito? | Sim |
| Nível de educação | Licenciatura |
| Situação de emprego | Empregado |
| Objetivo financeiro | Todos |

### Grupo 2: Dados do serviço financeiro
| Característica | Exemplo (Crédito BIC Express) |
|---|---|
| Taxa de juro anual | 18.5% |
| Prazo máximo | 48 meses |
| Montante máximo | 5.000.000 Kz |
| Rendimento mínimo exigido | 60.000 Kz |
| Tipo de serviço | Crédito Pessoal |

### Grupo 3: Características calculadas (engenharia de features)

Aqui o sistema combina dados dos dois grupos para criar indicadores mais poderosos:

| Característica | Cálculo | Exemplo (Ana × BIC Express) |
|---|---|---|
| **Rácio rendimento/exigido** | rendimento ÷ rendimento mínimo do serviço | 150.000 ÷ 60.000 = **2.5** |
| **Rácio de poupança** | (rendimento − despesas) ÷ rendimento | (150K − 80K) ÷ 150K = **0.467** |
| **Nível educação (codificado)** | primária=0, secundária=1, licenciatura=2, ... | **2** |
| **Situação emprego (codificado)** | desempregado=0, estudante=1, ... empregado=3 | **3** |
| **Objetivo: todos?** | sim=1, não=0 | **1** |
| **Tipo: crédito pessoal?** | sim=1, não=0 | **1** |
| **Tipo: microcrédito?** | sim=1, não=0 | **0** |
| **Tipo: seguro vida?** | sim=1, não=0 | **0** |
| ... e mais 5 tipos de serviço | one-hot encoding | ... |

No total, o modelo usa **29 características** diferentes para cada par perfil × serviço.

---

## 3. Como o modelo aprendeu? (Treino)

O modelo foi treinado com **500 exemplos sintéticos** representativos do mercado angolano.

### O que são "exemplos sintéticos"?

São perfis e serviços criados artificialmente, com valores realistas:
- Rendimentos entre 30.000 Kz e 500.000 Kz
- Despesas entre 20.000 Kz e 400.000 Kz
- Scores de crédito entre 0 e 1000
- Todos os níveis de educação, situações de emprego, objetivos
- Todos os 8 tipos de serviço

Para cada exemplo, um **rótulo** foi atribuído: **1 (adequado)** ou **0 (inadequado)**,
baseado em regras práticas como:
- O rendimento é suficiente para o serviço?
- O score de crédito é aceitável?
- O tipo de serviço é compatível com o perfil?

Depois, adicionou-se 10% de **ruído aleatório** para tornar o modelo mais realista
(porque na vida real nem sempre o que parece adequado é realmente escolhido).

### O que o modelo aprendeu durante o treino?

O algoritmo aprendeu **29 pesos (coeficientes)** — um para cada característica —
mais um **intercepto (viés)**. Estes pesos representam a **importância relativa**
de cada característica na decisão final.

Por exemplo, após o treino, o modelo pode ter aprendido pesos como:

| Característica | Peso (w) | Interpretação |
|---|---|---|
| Rácio rendimento/exigido | **+2.1** | → quanto maior, mais adequado |
| Score de crédito | **+0.8** | → score alto aumenta adequação |
| Tem histórico de crédito | **+0.6** | → quem já teve crédito é mais confiável |
| Tem conta bancária | **+0.4** | → ter conta é positivo |
| Taxa de juro | **−0.3** | → juros altos tornam menos adequado |
| Rácio de poupança | **+0.9** | → quem poupa mais consegue pagar |
| Dependentes | **−0.2** | → mais dependentes = menos capacidade |

Os pesos positivos aumentam a probabilidade, os negativos diminuem.

---

## 4. Como o cálculo é feito? (Predição)

Quando o sistema recebe o pedido de recomendação, para cada par (perfil × serviço)
ele executa dois passos:

### Passo 1: Calcular o valor Z (combinação linear)

```
Z = (w₁ × x₁) + (w₂ × x₂) + ... + (w₂₉ × x₂₉) + b
```

Onde:
- `x₁, x₂, ..., x₂₉` são as 29 características do par perfil × serviço
- `w₁, w₂, ..., w₂₉` são os pesos aprendidos no treino
- `b` é o intercepto (viés)

**Mas antes de multiplicar**, as características são **normalizadas** (`StandardScaler`):
cada valor é transformado para uma escala comum (média 0, desvio padrão 1).
Isto é necessário porque as características têm escalas muito diferentes:
rendimento está na casa dos milhares, score de crédito em centenas,
e variáveis como "tem conta bancária" são apenas 0 ou 1.

Se não houvesse normalização, as características com valores grandes
dominariam o cálculo e as pequenas seriam ignoradas.

### Passo 2: Aplicar a função Sigmoide

O valor Z pode ser qualquer número (de −∞ a +∞). Para transformá-lo numa
probabilidade entre 0 e 1, usamos a **função sigmoide**:

```
probabilidade = 1 / (1 + e⁻ᶻ)
```

Onde `e` é o número de Euler (~2.718).

A função sigmoide tem este comportamento:
- Se Z é muito grande positivo → probabilidade próxima de **100%** (muito adequado)
- Se Z é próximo de 0 → probabilidade próxima de **50%** (incerto)
- Se Z é muito grande negativo → probabilidade próxima de **0%** (inadequado)

---

## 5. Exemplo completo com números reais

Vamos calcular a adequação da **Ana Joaquim** para o **Crédito Pessoal BIC Express**.

### Características normalizadas (valores hipotéticos após StandardScaler)

Para simplificar, vamos considerar apenas 5 das 29 características:

| Característica | Valor bruto | Valor normalizado (x) | Peso (w) | Contribuição (w × x) |
|---|---|---|---|---|
| Rácio rendimento/exigido | 2.50 | +1.2 | +2.1 | +2.52 |
| Score de crédito | 650 | +0.8 | +0.8 | +0.64 |
| Rácio de poupança | 0.467 | +0.5 | +0.9 | +0.45 |
| Taxa de juro | 18.5% | −0.3 | −0.3 | +0.09 |
| Dependentes | 2 | −0.4 | −0.2 | +0.08 |

### Cálculo do Z

```
Z = 2.52 + 0.64 + 0.45 + 0.09 + 0.08 + ... (restantes 24 características) + b
Z ≈ +2.5  (valor hipotético final)
```

### Aplicação da sigmoide

```
probabilidade = 1 / (1 + e⁻²·⁵)
             = 1 / (1 + 0.082)
             = 1 / 1.082
             = 0.923
             = 92.3%
```

O modelo conclui que há **92.3%** de probabilidade deste serviço ser adequado
para a Ana.

### O mesmo cálculo para o Microcrédito BIC Empreendedor

O microcrédito é desenhado para pessoas com rendimentos baixos e sem histórico.
A Ana tem rendimento alto e bom histórico, o que reduz a adequação:

| Característica | Valor | Contribuição |
|---|---|---|
| Rácio rendimento/exigido | muito alto (renda mínima=0) | positiva, mas ... |
| Tipo: microcrédito | ativado = 1 | ... peso negativo para perfis fortes |
| Score de crédito | 650 | positiva, mas o tipo anula |

```
Z ≈ −0.2
probabilidade = 1 / (1 + e⁰·²)
             = 1 / (1 + 1.221)
             = 1 / 2.221
             = 0.450
             = 45.0%
```

Apenas **45.0%** — o modelo acha que este serviço não é o ideal para ela.

---

## 6. E se o ML não estiver disponível? (Fallback heurístico)

O sistema foi desenhado para nunca falhar. Se o serviço ML (Python) estiver
indisponível, o Node.js usa uma **fórmula de reserva** que imita o raciocínio
da regressão logística de forma simplificada:

```
probabilidade = 0.50 (base)
  + 0.10  se tem histórico de crédito
  + 0.05  se tem conta bancária
  + 0.15  se score > 700
  + 0.08  se score entre 500 e 700
  + (rendimento ÷ mínimo exigido − 1) × 0.10  (limitado a +0.20)
  + bónus especiais por tipo de serviço
```

Esta fórmula não é tão precisa quanto o ML, mas garante que o utilizador
recebe sempre recomendações, mesmo que momentaneamente menos afinadas.

---

## 7. Como o modelo melhora com o tempo?

Sempre que um utilizador avalia uma recomendação (nota de 1 a 5), esse feedback
é guardado. Quando há **50 ou mais feedbacks** acumulados, o administrador pode
**retreinar** o modelo.

O retreino funciona assim:

1. O sistema recolhe os feedbacks e junta-os aos perfis e serviços originais
2. Feedbacks com nota ≥ 4 são marcados como "adequado = 1"
3. Feedbacks com nota < 4 são marcados como "adequado = 0"
4. Estes dados reais são enviados para o ML Service
5. O ML Service treina uma **nova versão** do modelo com os dados reais
6. O novo modelo substitui o anterior e passa a ser usado nas próximas
   recomendações

Com o tempo, o modelo deixa de depender dos dados sintéticos iniciais
e passa a refletir o **comportamento real** dos utilizadores angolanos.

---

## 8. Resumo visual do processo

```
                 PERFIL DO UTILIZADOR
                 (renda, score, conta, ...)
                         │
                         ▼
                 SERVIÇO FINANCEIRO
                 (juro, prazo, tipo, ...)
                         │
                         ▼
             ENGENHARIA DE FEATURES
             ┌─────────────────────────┐
             │ 29 características       │
             │ • renda, score, despesas │
             │ • rácios, flags, one-hot │
             │ • encoding ordinal       │
             └──────────┬──────────────┘
                        ▼
              STANDARD SCALER
             (normalizar para média 0)
                        ▼
            Z = w₁x₁ + w₂x₂ + ... + b
                        ▼
            sigmoid(Z) = 1 / (1 + e⁻ᶻ)
                        ▼
             PROBABILIDADE (0% a 100%)
                        ▼
             "92.3% de adequação"
```
