# Guia Técnico Aprofundado — Modelo de Machine Learning
**Sistema de Recomendação de Créditos Baseado em Análise Preditiva**

Este documento foca-se exclusivamente na componente de Machine Learning do teu TFC: como o dataset foi gerado, como o modelo foi treinado, como calcula uma recomendação, e como avaliaste o desempenho — com o nível de detalhe que a banca pode exigir se decidir "descer" a este nível técnico. Termina com uma bateria de perguntas e respostas simuladas.

---

## 1. Visão geral do pipeline (a história completa, do início ao fim)

```
Geração de dados sintéticos (500 registos)
        ↓
Criação do rótulo (regra heurística + 10% de ruído)
        ↓
Engenharia de features (_engenharia_features)
        ↓
Divisão treino/teste (80/20, estratificada)
        ↓
Normalização (StandardScaler) — ajustada SÓ no treino
        ↓
Treino do modelo (LogisticRegression, class_weight='balanced')
        ↓
Predição no conjunto de teste (predict + predict_proba)
        ↓
Avaliação (acurácia, precisão, recall, F1, AUC-ROC, matriz de confusão)
        ↓
Uso em produção: mesmo scaler + mesmo modelo aplicados a um novo par (utilizador, serviço)
```

Isto está todo implementado dentro da classe do módulo `modelo.py`, no método `_criar_modelo_base()` (gera os dados) e `_treinar_interno()` (treina o modelo) — ver Figura 13 do teu TFC.

---

## 2. Fase 1 — Geração do dataset sintético

### 2.1 Porquê dados sintéticos?

Não existiam dados reais de utilizadores angolanos em volume suficiente para treinar um modelo supervisionado. A alternativa foi **simular** cenários plausíveis de recomendação, respeitando as regras de negócio do domínio (RN01–RN11), para provar que o *pipeline* de Machine Learning funciona correctamente — reservando a validação com dados reais para trabalho futuro.

### 2.2 Como cada registo é gerado

Cada linha do dataset representa **um par (perfil do utilizador, serviço financeiro candidato)** — ou seja, um cenário hipotético único de "será que este serviço serve para esta pessoa?". Não é "um utilizador" — é uma combinação específica utilizador×serviço.

Geração via `numpy.random`, com **seed fixa `random_state=42`**, o que é crucial explicar: garante **reprodutibilidade total** — qualquer pessoa que corra o mesmo código obtém exactamente o mesmo dataset, o mesmo split treino/teste e os mesmos resultados. Isto é uma boa prática científica que vale a pena destacar por iniciativa própria na defesa.

### 2.3 As variáveis geradas (features "cruas")

| Variável | Distribuição | Intervalo |
|---|---|---|
| rendimento_mensal | Uniforme | 30.000 – 500.000 Kz |
| despesas_mensais | Uniforme | 20.000 – 400.000 Kz |
| dependentes | Inteiro uniforme | 0 – 5 |
| score_credito | Inteiro uniforme | 0 – 1000 |
| taxa_juro_anual | Uniforme | 8% – 25% |
| prazo_max_meses | Escolha aleatória | {12, 24, 36, 48, 60, 120, 360} |
| montante_max | Uniforme | 100.000 – 50.000.000 Kz |
| rendimento_min_servico | Uniforme | 0 – 200.000 Kz |
| tem_conta_bancaria | Binária | {0, 1} |
| tem_historico_credito | Binária | {0, 1} |
| nivel_educacao | Categórica uniforme | primária / secundária / licenciatura / mestrado / doutoramento |
| situacao_emprego | Categórica uniforme | desempregado / estudante / autónomo / empregado / reformado |
| objetivo_financeiro | Categórica uniforme | poupança / crédito / seguro / investimento / todos |
| tipo_servico | Categórica uniforme | 8 tipos (crédito, seguro, poupança, investimento) |

**Total: 500 registos.** É importante saberes justificar que 500 é um número pequeno para Machine Learning — foi uma escolha deliberada para um protótipo académico, não uma limitação de infraestrutura (podias gerar 50.000 se quisesses, é código). O motivo de manter pequeno é manter o dataset **interpretável e auditável manualmente**, evitando a ilusão de robustez que um dataset grande mas artificial poderia transmitir.

---

## 3. Fase 2 — Criação do rótulo (a variável que o modelo tem de aprender a prever)

Esta é provavelmente a parte **mais tecnicamente delicada** de todo o trabalho, e onde a banca vai investir mais tempo se quiser testar profundidade.

### 3.1 A regra heurística determinística

Um serviço é `adequado = 1` **apenas se as três condições seguintes forem simultaneamente verdadeiras**:

```
adequado = (
    rendimento_mensal >= rendimento_min_servico        # (1) Cobre o mínimo exigido
    AND rendimento_mensal > despesas_mensais            # (2) Tem saldo positivo
    AND (
        score_credito >= 400                             # (3a) Score razoável
        OR tipo_servico IN ('microcredito',               # (3b) OU serviço de acesso fácil
             'seguro_vida', 'seguro_saude', 'conta_poupanca')
    )
)
```

Repara na estrutura lógica: é um **E** entre duas condições obrigatórias (cobrir o mínimo de rendimento + ter saldo positivo) e um **OU** flexível na terceira condição (ou tens bom score, ou o serviço em si é de acesso facilitado, tipo microcrédito ou seguros básicos). Isto reflecte uma lógica de negócio realista: produtos de "entrada" (microcrédito, seguros de saúde/vida, conta poupança) são deliberadamente mais acessíveis mesmo a quem tem histórico de crédito fraco.

### 3.2 Injecção de ruído estocástico

Depois de aplicar a regra determinística acima, é introduzido **10% de ruído** através de `numpy.random.binomial(1, 0.1, n)` — gera um vetor de 0s e 1s onde, em média, 10% das posições são 1.

O rótulo final é calculado como:

```
y = |adequado − ruído|
```

**Porque é que isto inverte 10% dos rótulos?** Pensa no XOR (ou-exclusivo, que é essencialmente o que o valor absoluto da subtração está a simular aqui com valores binários):
- Se `adequado = 1` e `ruído = 0` → `y = |1-0| = 1` (mantém-se)
- Se `adequado = 1` e `ruído = 1` → `y = |1-1| = 0` (**inverteu-se!**)
- Se `adequado = 0` e `ruído = 0` → `y = |0-0| = 0` (mantém-se)
- Se `adequado = 0` e `ruído = 1` → `y = |0-1| = 1` (**inverteu-se!**)

Ou seja, em ~10% dos casos, o rótulo "verdadeiro" segundo a regra é deliberadamente trocado. **Porquê fazer isto de propósito?** Para simular a **incerteza e subjectividade real** de decisões financeiras — na vida real, nem sempre a decisão de conceder ou recomendar um crédito segue perfeitamente uma regra rígida, há sempre uma margem de excepções, erros humanos, ou factores não capturados pelas variáveis. Sem este ruído, o problema seria **perfeitamente separável** (accuracy poderia chegar a 100%), o que seria irrealista e pouco útil como demonstração.

### 3.3 Distribuição de classes resultante

| Momento | Adequado (1) | Não adequado (0) |
|---|---|---|
| Antes do ruído | 240 | 260 |
| Depois do ruído (final) | 244 (48,8%) | 256 (51,2%) |

Rácio 1/0 = 0,953 → praticamente balanceado. Isto é importante para justificar porque **não** foi necessário sobre-amostrar (oversampling, ex. SMOTE) — o dataset já nasce quase equilibrado. Mesmo assim, o modelo usa `class_weight='balanced'` como precaução adicional (explico o que isto faz na secção 5).

---

## 4. Fase 3 — Engenharia de features

Antes de o modelo "ver" os dados, há transformações (`_engenharia_features`):

1. **Variável derivada — rácio de poupança:**

```
rácio_poupança = (rendimento − despesas) / rendimento
```

Esta é a **feature mais importante do modelo** (coeficiente +1,4009, o maior de todos). Em vez de dar ao modelo "rendimento" e "despesas" separadamente e esperar que ele descubra a relação entre eles, calculas tu próprio essa relação de forma explícita — isto é engenharia de features clássica: transformar conhecimento de domínio em variáveis mais informativas do que os dados brutos.

2. **Codificação de variáveis categóricas** (`nivel_educacao_enc`, `situacao_emprego_enc`, e as variáveis dummy `tipo_seguro_automovel`, `tipo_conta_poupanca`, `tipo_credito_pessoal`, `tipo_investimento`, `tipo_seguro_saude`): variáveis categóricas de texto (ex. "licenciatura", "empregado") são convertidas em números, para que a regressão logística — que só entende matemática — as possa processar. O padrão `tipo_X` sugere *one-hot encoding* (uma coluna binária por categoria de serviço), enquanto `_enc` no nome de nível_educacao/situação_emprego sugere um *encoding ordinal ou de label* (mapeamento categoria → número inteiro).

3. **Variáveis já binárias** ficam como estão: `tem_conta_bancaria`, `tem_historico_credito`.

---

## 5. Fase 4 — Divisão treino/teste e normalização

### 5.1 Split 80/20 estratificado

```python
X_train, X_test, y_train, y_test = train_test_split(
    X_arr, y, test_size=0.2, random_state=42, stratify=y
)
```

- **80% treino (400 registos), 20% teste (100 registos).**
- `stratify=y` é um detalhe técnico importante de saberes explicar: garante que a **proporção de classes** (≈49%/51%) se mantém igual tanto no conjunto de treino como no de teste. Sem isto, por puro acaso, o teste podia ficar com, por exemplo, 70% de casos "não adequado" e distorcer as métricas.
- `random_state=42` de novo por reprodutibilidade.

### 5.2 Normalização com StandardScaler

```python
self.scaler = StandardScaler()
X_train_sc = self.scaler.fit_transform(X_train)
X_test_sc  = self.scaler.transform(X_test)
```

**Ponto crítico que a banca pode explorar:** o `StandardScaler` transforma cada feature para ter **média 0 e desvio-padrão 1**, através da fórmula:

```
x_normalizado = (x − média) / desvio_padrão
```

**Porque é isto necessário?** As tuas features têm escalas completamente diferentes — `rendimento_mensal` varia entre 30.000 e 500.000, enquanto `tem_conta_bancaria` é 0 ou 1. Sem normalização, o coeficiente da regressão logística associado ao rendimento teria de ser artificialmente muito pequeno só para compensar a escala grande do valor, tornando os coeficientes **não comparáveis entre si**. Com normalização, todas as features "competem em pé de igualdade", e os coeficientes tornam-se directamente interpretáveis em termos de importância relativa — é por isso que consegues dizer "rácio_poupança é a variável mais importante" olhando simplesmente para o valor do coeficiente.

**Outro ponto crítico**: repara que `fit_transform` é chamado **só no treino**, e `transform` (sem `fit`) no teste. Isto não é acidente — é para **evitar data leakage** (fuga de informação): se calculasses a média e o desvio-padrão usando também os dados de teste, estarias a "espreitar" informação do teste durante o treino, inflacionando artificialmente o desempenho reportado. A média e o desvio-padrão usados para normalizar o teste (e, mais tarde, qualquer novo utilizador em produção) são sempre os que foram calculados **exclusivamente com os 400 registos de treino**.

---

## 6. Fase 5 — Treino do modelo

```python
self.modelo = LogisticRegression(
    C=1.0,
    max_iter=1000,
    solver='lbfgs',
    random_state=42,
    class_weight='balanced'
)
self.modelo.fit(X_train_sc, y_train)
```

Explicação de cada hiperparâmetro (a banca adora perguntar "o que é isto e porquê este valor?"):

| Hiperparâmetro | Valor | O que faz |
|---|---|---|
| `C` | 1.0 | Inverso da força de regularização. C=1.0 é o valor por defeito — regularização moderada, nem muito fraca (risco de overfitting) nem muito forte (risco de underfitting, coeficientes "achatados"). |
| `solver` | 'lbfgs' | Algoritmo de optimização numérica usado para encontrar os coeficientes β que minimizam a função de perda (log-loss). LBFGS é eficiente e é o *solver* por defeito do scikit-learn para datasets pequenos/médios como este. |
| `max_iter` | 1000 | Número máximo de iterações que o optimizador pode fazer até convergir. O modelo convergiu em 20 iterações — muito abaixo do limite, o que é bom sinal (não houve problemas de convergência). |
| `class_weight` | 'balanced' | Ajusta automaticamente o peso de cada classe no cálculo do erro, inversamente proporcional à sua frequência. Como o dataset já é quase balanceado (49/51%), o efeito prático é pequeno, mas é uma boa prática defensiva caso o balanceamento mude no futuro com dados reais. |
| `random_state` | 42 | Garante reprodutibilidade em qualquer parte do processo que envolva aleatoriedade interna do solver. |

---

## 7. Como o modelo calcula uma probabilidade — a matemática, passo a passo

Esta é a parte que precisas de conseguir desenhar no quadro/explicar verbalmente sem hesitar.

### 7.1 Passo 1 — Combinação linear (o "score" z)

```
z = β₀ + β₁x₁ + β₂x₂ + ... + βₙxₙ
```

Onde cada `xᵢ` é o valor **já normalizado** (depois do StandardScaler) da respectiva feature, e cada `βᵢ` é o coeficiente aprendido durante o treino. `β₀` é o *intercept* (constante independente das features).

### 7.2 Passo 2 — Função sigmóide (converter z numa probabilidade)

```
P(adequado) = 1 / (1 + e^(−z))
```

A função sigmóide "esmaga" qualquer valor real de z (que pode ir de −∞ a +∞) para o intervalo (0, 1) — é isto que transforma um score matemático abstracto numa **probabilidade** interpretável.

- Se `z` for muito positivo → `e^(-z)` tende a 0 → `P` tende a 1 (muito provável ser adequado).
- Se `z` for muito negativo → `e^(-z)` tende a infinito → `P` tende a 0 (muito improvável).
- Se `z = 0` → `P = 0,5` (fronteira de decisão, 50/50).

### 7.3 Passo 3 — Ordenação (ranking)

Para um dado utilizador, o processo repete-se para **cada serviço financeiro elegível** (que já passou pelos filtros das regras de negócio RN01–RN04). Cada serviço obtém a sua própria probabilidade `P(adequado)`. No final, os serviços são **ordenados por ordem decrescente de P** — o topo da lista é o mais recomendado (RN06: priorização por adequação).

### 7.4 Exemplo ilustrativo (números fictícios, só para explicar a lógica — não são valores reais do teu dataset)

Imagina um utilizador com rácio de poupança elevado e bom score de crédito, avaliado contra um serviço de crédito pessoal:

```
z = β₀ 
    + 1,4009 × (rácio_poupança normalizado = +1,2)
    + 0,6848 × (score_crédito normalizado = +0,8)
    + 0,6146 × (rendimento normalizado = +0,5)
    − 0,1828 × (tipo_credito_pessoal = 1, normalizado)
    − 0,1502 × (taxa_juro_anual normalizada = +0,3)
    + ... (restantes termos)
```

Se, somando tudo, obtiveres por exemplo `z = 1,8`:

```
P(adequado) = 1 / (1 + e^(−1,8)) = 1 / (1 + 0,165) ≈ 0,858 → 85,8%
```

Este serviço seria recomendado com alta confiança. **Importante**: não tens o valor exacto de β₀ (intercept) documentado no TFC — se a banca pedir para "calcular exactamente", explica o processo conceptual como acima, e sê honesto que o valor do intercept não está reportado no documento (só os 16 coeficientes das features).

---

## 8. Interpretação dos coeficientes (tabela completa)

| Feature | Coeficiente | Direcção do efeito |
|---|---|---|
| racio_poupanca | **+1,4009** | ↑ maior margem de poupança → mais adequado (mais forte de todos) |
| score_credito | +0,6848 | ↑ melhor score → mais adequado |
| rendimento_mensal | +0,6146 | ↑ maior rendimento → mais adequado |
| tipo_seguro_automovel | −0,4975 | ↓ seguro auto → menos adequado (mais negativo) |
| nivel_educacao_enc | +0,3016 | ↑ maior escolaridade → mais adequado |
| tipo_conta_poupanca | +0,2961 | ↑ conta poupança → mais acessível |
| tipo_seguro_saude | +0,2948 | ↑ seguro saúde → mais acessível |
| rendimento_min_servico | −0,2261 | ↓ exigência maior do serviço → mais restritivo |
| prazo_max_meses | +0,2019 | ↑ prazo longo → mais flexível |
| tipo_investimento | −0,1898 | ↓ investimento → mais exigente |
| tipo_credito_pessoal | −0,1828 | ↓ crédito pessoal → mais restritivo |
| taxa_juro_anual | −0,1502 | ↓ juro alto → menos adequado |
| situacao_emprego_enc | −0,1418 | efeito misto (encoding ordinal) |
| tem_conta_bancaria | +0,1080 | ↑ ter conta → mais adequado |
| tem_historico_credito | +0,0305 | ↑ ter histórico → ligeiramente mais adequado |
| dependentes | +0,0079 | impacto quase nulo |

**Nota de leitura importante para a defesa:** o sinal e a magnitude do coeficiente indicam a direcção e a força do efeito **sobre o log-odds** (não directamente sobre a probabilidade — a relação com a probabilidade é não-linear por causa da sigmóide). Um coeficiente de +1,4 não significa "aumenta a probabilidade em 1,4%" — significa que, mantendo tudo o resto constante, um aumento de uma unidade padronizada nessa variável aumenta o **log da razão de possibilidades (log-odds)** em 1,4 unidades.

---

## 9. Fase 6 — Avaliação do modelo

### 9.1 As cinco métricas, explicadas com as tuas fórmulas e números reais

| Métrica | Fórmula | Valor | O que significa neste contexto |
|---|---|---|---|
| **Acurácia** | (VP+VN) / Total | 75,0% | 75 em cada 100 pares utilizador-serviço classificados correctamente |
| **Precisão** | VP / (VP+FP) | 72,22% | Das vezes que o modelo disse "adequado", acertou 72,22% das vezes |
| **Recall** | VP / (VP+FN) | 79,59% | Dos casos verdadeiramente adequados, o modelo apanhou 79,59% |
| **F1-Score** | 2×(Prec×Rec)/(Prec+Rec) | 75,73% | Média harmónica — equilíbrio entre precisão e recall |
| **AUC-ROC** | área sob a curva ROC | 83,99% | Capacidade de distinguir "adequado" de "não adequado" em qualquer limiar de decisão |

(VP = verdadeiro positivo, VN = verdadeiro negativo, FP = falso positivo, FN = falso negativo)

### 9.2 Matriz de confusão (números exactos)

|  | Previsto: 0 (não adequado) | Previsto: 1 (adequado) | Total real |
|---|---|---|---|
| **Real: 0** | 36 (VN) | 15 (FP) | 51 |
| **Real: 1** | 10 (FN) | 39 (VP) | 49 |
| **Total previsto** | 46 | 54 | 100 |

**Saber explicar o significado de negócio de cada erro é fundamental:**
- **15 Falsos Positivos** → o sistema recomendou um serviço como "adequado" quando não era. Este é o erro **mais perigoso** no teu domínio: pode levar um utilizador a considerar um crédito que não deveria contrair. É a principal área de melhoria identificada.
- **10 Falsos Negativos** → o sistema deixou de recomendar um serviço que, na realidade, era adequado. Erro menos grave neste contexto — o utilizador simplesmente não vê uma boa opção, mas não é exposto a risco directo.

### 9.3 Porque escolher recall alto (79,6%) é intencional aqui?

Podias argumentar (se perguntarem porque não optimizaste para reduzir ainda mais os falsos positivos): "Com `class_weight='balanced'`, o modelo não favorece artificialmente nenhuma classe. O recall de 79,6% para a classe positiva mostra que o modelo é razoavelmente sensível a identificar boas oportunidades, ao custo de alguns falsos positivos — um trade-off aceitável num sistema de *apoio* à decisão (não é o sistema que aprova o crédito, é sempre a instituição financeira que decide no fim, RN06)."

### 9.4 Comparação com baselines

| Métrica | Modelo | Baseline Estratificado | Baseline Maioritário |
|---|---|---|---|
| Acurácia | 75,00% | 48,00% | 51,00% |
| Precisão | 72,22% | 46,81% | — |
| Recall | 79,59% | 44,90% | — |
| F1-Score | 75,73% | 45,83% | — |
| AUC-ROC | 83,99% | 47,94% | — |

- **Baseline estratificado**: prevê aleatoriamente respeitando a proporção de classes observada (≈49/51%) — é o que se obteria "a adivinhar de forma informada, sem olhar para nenhuma feature".
- **Baseline maioritário**: prevê sempre a classe mais frequente (51,2% "não adequado") — dá 51% de acurácia "de borla", sem aprender nada.

**Ganho absoluto sobre o baseline estratificado:** +27,00 p.p. em acurácia, +36,05 p.p. em AUC-ROC. É este número que prova que o modelo aprendeu efectivamente um padrão, não está só a "acertar por sorte".

---

## 10. As limitações da avaliação — domina isto de cor

1. **Tautologia parcial do rótulo** — o rótulo depende de features também usadas no treino (ex. `rendimento_mensal >= rendimento_min_servico`), o modelo pode estar parcialmente a "recuperar" a própria regra.
2. **Distribuições irrealistas** — distribuições uniformes; dados reais teriam caudas longas (ex. maioria da população com rendimentos baixos, poucos com rendimentos muito altos).
3. **Independência artificial das variáveis** — no dataset sintético, todas as variáveis são geradas de forma independente; na realidade há correlações fortes (ex. escolaridade ↔ rendimento).
4. **Amostra reduzida** — 500 registos, 100 no teste. Com n=100, os intervalos de confiança para a acurácia são largos (~±8-10 p.p.).
5. **Sem validação temporal (out-of-time)** — não há separação cronológica; em produção o modelo seria treinado com dados passados e avaliado com dados futuros, o que pode revelar degradação de desempenho não capturada aqui.
6. **Ruído uniforme** — 10% de ruído aplicado de forma homogénea; na realidade, a incerteza seria maior em perfis "limítrofes" (fronteira da decisão) e menor em perfis extremos.
7. **Representatividade demográfica** — o dataset não reflecte a real distribuição de escolaridade, emprego e rendimento em Angola.

**Mitigação prevista:** re-treino do modelo com dados reais de feedback (nota Likert ≥ 4 → adequado), via o endpoint `POST /admin/modelo/retreinar`, substituindo progressivamente o dataset sintético (RN10 — re-treino após 50 novos feedbacks).

---

## 11. Perguntas e Respostas — Bateria Focada em ML

**P1: Explique-me, do início ao fim, como uma probabilidade de recomendação é calculada para um utilizador.**
> "Primeiro, o sistema recolhe o perfil do utilizador (rendimento, despesas, score de crédito, etc.) e cruza-o com cada serviço financeiro elegível, após passar pelos filtros de regras de negócio. Para cada par utilizador-serviço, calculo variáveis derivadas como o rácio de poupança, codifico as variáveis categóricas, e normalizo todas as features com o mesmo StandardScaler ajustado durante o treino. Depois calculo a combinação linear z = β₀ + Σβᵢxᵢ usando os coeficientes aprendidos, e converto z numa probabilidade entre 0 e 1 através da função sigmóide, P = 1/(1+e^-z). Repito isto para todos os serviços elegíveis e ordeno por ordem decrescente de probabilidade."

**P2: Porque normalizou os dados antes de treinar o modelo? O que aconteceria se não normalizasse?**
> "Porque as features têm escalas muito diferentes — rendimento chega a 500.000, enquanto variáveis binárias são 0 ou 1. Sem normalização, o modelo tenderia a dar peso desproporcionado às variáveis de maior escala numérica, não porque sejam mais importantes, mas só porque os seus valores absolutos são maiores. Isso também tornaria os coeficientes impossíveis de comparar directamente entre si para interpretar importância relativa das variáveis."

**P3: Qual a diferença entre ajustar (`fit`) o StandardScaler no treino e só transformar (`transform`) no teste? Porque não usar `fit_transform` em ambos?**
> "Se calculasse a média e o desvio-padrão também com os dados de teste, estaria a deixar informação do conjunto de teste 'vazar' para o processo de normalização usado no treino — isto chama-se data leakage. Isso inflacionaria artificialmente o desempenho reportado, porque o modelo estaria indirectamente a beneficiar de conhecimento sobre a distribuição dos dados de teste antes de ser avaliado neles. Por isso, a média e o desvio-padrão usados para normalizar tanto o teste como qualquer novo utilizador em produção vêm exclusivamente dos 400 registos de treino."

**P4: O que é `stratify=y` na divisão treino/teste e porque é importante?**
> "Garante que a proporção de classes (adequado/não adequado) se mantém igual no treino e no teste — no meu caso, próxima de 49%/51%. Sem isto, por acaso amostral, o conjunto de teste podia ficar desequilibrado, distorcendo as métricas de avaliação, especialmente com um dataset relativamente pequeno como o meu (100 registos de teste)."

**P5: Explique o que faz `class_weight='balanced'`.**
> "Ajusta automaticamente o peso atribuído a cada classe na função de perda, de forma inversamente proporcional à sua frequência no conjunto de treino. Isto evita que o modelo, ao tentar minimizar o erro global, 'ignore' a classe minoritária. No meu caso, como o dataset já está quase balanceado (49/51%), o efeito prático é limitado, mas é uma boa prática de precaução, sobretudo pensando em cenários futuros com dados reais, onde o desequilíbrio pode ser maior."

**P6: O que representa exactamente o coeficiente de uma variável na regressão logística? Pode interpretar-se directamente como '% de probabilidade'?**
> "Não directamente. O coeficiente representa o efeito da variável sobre o **log-odds** (o logaritmo da razão entre a probabilidade de sucesso e a probabilidade de fracasso), mantendo as restantes variáveis constantes — não sobre a probabilidade final, que tem uma relação não-linear com z devido à função sigmóide. Por exemplo, um coeficiente de +1,40 no rácio de poupança significa que, para cada unidade padronizada de aumento nessa variável, o log-odds de o serviço ser adequado aumenta 1,40 unidades. Só depois de somar todos os termos e aplicar a sigmóide é que obtenho a probabilidade final."

**P7: Porque é que o AUC-ROC é considerado mais robusto que a acurácia?**
> "Porque a acurácia depende de um limiar de decisão fixo (normalmente 0,5) e pode ser enganadora quando as classes estão desbalanceadas — por exemplo, um classificador que preveja sempre a classe maioritária já tem 51% de acurácia sem aprender nada, como mostra o meu baseline maioritário. O AUC-ROC mede a capacidade do modelo em ordenar correctamente casos positivos acima de negativos, considerando **todos os limiares possíveis** de decisão, o que o torna uma métrica mais robusta e menos sensível a esse desbalanceamento."

**P8: Como sabe que o modelo não está apenas a decorar os dados de treino (overfitting)?**
> "Avalio sempre no conjunto de teste, que o modelo nunca viu durante o treino — os 75% de acurácia e 84% de AUC-ROC reportados são medidos exclusivamente nesses 100 registos separados. Além disso, uso regularização (C=1.0) na regressão logística, que penaliza coeficientes excessivamente grandes e ajuda a prevenir overfitting. Dito isto, reconheço que, com apenas 500 registos no total, a margem para detectar overfitting de forma robusta é limitada — seria algo a validar melhor com um dataset maior e, idealmente, com validação cruzada (k-fold), que não implementei nesta fase."

**P9: Porque não usou validação cruzada (cross-validation) em vez de um único split treino/teste?**
> "É uma limitação que reconheço. Um único split 80/20 dá uma estimativa de desempenho que pode variar consoante que 20% calharam no teste, especialmente com apenas 100 registos de teste. A validação cruzada k-fold daria uma estimativa mais robusta e um intervalo de confiança mais informativo. Não implementei isso nesta fase por foco no *pipeline* completo (dados → ML service → backend → frontend) dentro do tempo do TFC, mas é um refinamento natural para trabalho futuro."

**P10: Se um utilizador tivesse rendimento_mensal = 0 e despesas_mensais = 0, o que aconteceria ao rácio de poupança?**
> "Haveria uma divisão por zero na fórmula (rendimento − despesas) / rendimento, o que geraria um erro ou um valor indefinido (NaN). É um caso limite que a regra de negócio RN02 já filtra a montante — só utilizadores com rendimento mensal igual ou superior a 50.000 Kz são elegíveis para qualquer recomendação de crédito, o que evita este cenário chegar ao cálculo do rácio de poupança."

**P11: Qual é a diferença entre `predict()` e `predict_proba()` no scikit-learn, e qual usou?**
> "`predict()` devolve directamente a classe prevista (0 ou 1), aplicando internamente um limiar de 0,5 sobre a probabilidade. `predict_proba()` devolve a probabilidade contínua entre 0 e 1 para cada classe. Uso `predict_proba()` para gerar o ranking de recomendações — preciso do valor contínuo de probabilidade para poder ordenar os serviços por grau de adequação (RN06), não apenas de uma classificação binária."

**P12: Como é que o modelo lida com uma variável categórica como 'nível de educação', que tem 5 categorias?**
> "É convertida numericamente durante a engenharia de features. No caso de `nivel_educacao_enc`, o sufixo `_enc` sugere um encoding ordinal ou de rótulo, mapeando cada categoria (primária, secundária, licenciatura, mestrado, doutoramento) para um valor numérico ordenado, uma vez que existe uma progressão lógica entre elas. Já para variáveis como o tipo de serviço, que não têm uma ordem natural entre categorias, o padrão de nomes sugere antes um one-hot encoding — uma coluna binária dedicada a cada categoria, como se vê em `tipo_seguro_automovel` ou `tipo_credito_pessoal`."

**P13: O modelo teria funcionado melhor com uma rede neuronal?**
> "Possivelmente teria uma capacidade maior de capturar relações não-lineares complexas entre as variáveis, mas com apenas 500 registos, uma rede neuronal arriscaria overfitting severo e seria muito mais difícil de interpretar — perderia a explicabilidade que é crítica no meu requisito RF04 e na regra de negócio RN09. A regressão logística foi uma escolha deliberada de trade-off entre desempenho e interpretabilidade, adequada à escala e ao domínio deste protótipo."

**P14: Explique porque é que o dataset é 'aproximadamente tautológico' e qual seria a forma correcta de evitar isso no futuro.**
> "O rótulo foi criado por uma regra que usa directamente algumas das mesmas variáveis que depois entram como features no modelo — por exemplo, `rendimento_mensal >= rendimento_min_servico` define o rótulo, e ambas as variáveis (`rendimento_mensal`, `rendimento_min_servico`) estão também disponíveis para o modelo prever com base nelas. Isto significa que, em parte, o modelo pode estar apenas a 'redescobrir' matematicamente essa regra explícita, em vez de aprender um padrão latente e não-óbvio de comportamento real. A forma correcta de evitar isto no futuro é treinar com rótulos vindos de decisões reais e independentes — por exemplo, feedback real de utilizadores sobre se a recomendação lhes pareceu de facto adequada (RN07, RN10) — em vez de rótulos derivados de uma fórmula pré-definida sobre as mesmas variáveis de entrada."

**P15: O re-treino do modelo (RN10) vai usar o mesmo processo (StandardScaler + LogisticRegression)?**
> "A arquitectura do pipeline mantém-se — normalização seguida de regressão logística — mas o scaler terá de ser reajustado (`fit`) com os novos dados de treino reais, não reaproveitado do treino sintético. Também é o momento ideal para reconsiderar se a regressão logística continua a ser o algoritmo mais adequado, ou se, com mais dados reais disponíveis, valeria a pena comparar com outros modelos, como referi como trabalho futuro."

**P16: Como validou que os coeficientes fazem sentido do ponto de vista de negócio, e não são apenas artefactos estatísticos do dataset sintético?**
> "Fiz uma verificação de plausibilidade (sanity check) comparando os sinais e a magnitude relativa dos coeficientes com a intuição de negócio esperada — por exemplo, esperava que rácio de poupança e score de crédito tivessem coeficientes positivos fortes, e taxa de juro um coeficiente negativo, o que se confirmou. Isto dá alguma confiança de que o pipeline está a funcionar correctamente do ponto de vista técnico. Mas, como refiro nas limitações, isto não substitui a validação de que estes coeficientes reflectem o comportamento real de consumidores angolanos — podem estar simplesmente a reflectir fielmente a regra heurística usada para gerar o próprio dataset."

---

## 12. Tabela rápida — números do modelo que tens de saber de cor

| Item | Valor |
|---|---|
| Total de registos | 500 |
| Treino / Teste | 400 / 100 (80% / 20%) |
| Seed | 42 (em todo o processo — geração, split, treino) |
| % de ruído no rótulo | 10% |
| Distribuição final de classes | 48,8% adequado / 51,2% não adequado |
| Algoritmo | LogisticRegression (scikit-learn) |
| Solver | lbfgs |
| C (regularização) | 1.0 |
| max_iter | 1000 (convergiu em 20 iterações) |
| class_weight | balanced |
| Normalização | StandardScaler (fit só no treino) |
| Acurácia (teste) | 75,00% |
| Precisão | 72,22% |
| Recall | 79,59% |
| F1-Score | 75,73% |
| AUC-ROC | 83,99% |
| Falsos Positivos | 15 |
| Falsos Negativos | 10 |
| Ganho vs. baseline estratificado (acurácia) | +27,00 p.p. |
| Ganho vs. baseline estratificado (AUC-ROC) | +36,05 p.p. |
| Feature mais importante | racio_poupanca (+1,4009) |
| Feature com maior efeito negativo | tipo_seguro_automovel (−0,4975) |