# SRFS — Sistema de Recomendação de Serviços Financeiros

## Como o sistema funciona (visão geral)

O SRFS é uma plataforma que ajuda pessoas a encontrar os melhores serviços financeiros
(créditos, seguros, contas poupança, investimentos) de acordo com o seu perfil.

Imagine que você entra num banco e o gerente, depois de analisar a sua vida financeira,
recomenda o produto mais adequado para si. O SRFS faz exatamente isto, mas de forma
automática e com a ajuda de inteligência artificial.

---

## Quem pode usar o sistema?

O sistema tem três tipos de utilizadores:

| Tipo | O que faz |
|------|-----------|
| **Utilizador** | Pessoa comum que quer recomendações de serviços financeiros |
| **Provedor** | Bancos e seguradoras que cadastram os seus produtos |
| **Administrador** | Supervisiona todo o sistema, ajusta regras e acompanha o desempenho |

---

## Passo a passo: como uma recomendação acontece

### 1. O utilizador cria o seu perfil financeiro

A primeira vez que usa o sistema, responde a algumas perguntas simples:

- **Quanto ganha por mês?** (rendimento)
- **Quanto gasta por mês?** (despesas)
- **Tem conta bancária?**
- **Tem histórico de crédito?** (já pediu empréstimos antes?)
- **Qual o seu grau académico?**
- **Quantas pessoas dependem de si?**
- **Qual o seu objetivo?** (poupar, pedir crédito, fazer seguro, investir)

Com base na diferença entre o que ganha e o que gasta, o sistema calcula automaticamente
a sua **capacidade de endividamento** — ou seja, quanto pode pagar por mês sem se endividar
demais. A regra é simples: 30% do que sobra depois de pagar as despesas.

> **Exemplo real:**
> - Salário: 150.000 Kz
> - Despesas: 80.000 Kz
> - Sobra: 70.000 Kz
> - Capacidade de endividamento: 70.000 × 30% = **21.000 Kz/mês**

### 2. O utilizador pede recomendações

Com o perfil já criado, basta clicar num botão: **"Gerar Recomendações"**.

O sistema então faz três coisas:

#### a) Filtra os serviços que já não servem

Dos vários serviços cadastrados pelos bancos, o sistema elimina automaticamente
aqueles que não são compatíveis. Por exemplo:

- Se o utilizador **ganha 50.000 Kz/mês**, não vai ver produtos que exigem renda mínima de 100.000 Kz
- Se o utilizador **não tem conta bancária**, não vai ver produtos que exigem conta
- Se o utilizador **tem score de crédito baixo**, não vai ver produtos que exigem score alto

Isto evita que o utilizador perca tempo com produtos que não pode contratar.

#### b) Inteligência artificial calcula o grau de adequação

Aqui entra a parte mais interessante. O sistema envia o perfil do utilizador e a lista
de serviços elegíveis para um **modelo de inteligência artificial** que analisa dezenas
de fatores diferentes ao mesmo tempo:

- **Rendimento**: quanto maior, melhor para créditos maiores
- **Despesas**: se gasta muito, sobra menos para pagar prestações
- **Score de crédito**: histórico de 0 a 1000 — quanto maior, melhor
- **Idade, educação, emprego**: influenciam a estabilidade financeira
- **Taxa de juro do serviço**: juros altos tornam o produto menos adequado
- **Prazo do serviço**: prazos muito longos ou muito curtos podem não ser ideais
- **Rácio rendimento/exigido**: quanto mais o salário supera o mínimo exigido, melhor

O modelo foi **treinado com 500 exemplos** representativos do mercado angolano,
aprendendo a reconhecer padrões de quando um serviço é adequado ou não para cada tipo de perfil.

O resultado é uma **probabilidade de 0% a 100%** para cada serviço.

#### c) Gera uma explicação para cada recomendação

Cada recomendação vem acompanhada de um texto simples que explica **porque** aquele
serviço foi recomendado. Por exemplo:

> *"Com base no seu histórico de crédito positivo, conta bancária activa, score de crédito de 650 e rendimento mensal acima do mínimo exigido, este serviço tem 92.3% de adequação ao seu perfil. A sua capacidade de endividamento estimada é de 21.000 Kz/mês, compatível com este produto."*

Isto ajuda o utilizador a confiar na recomendação e a perceber os motivos.

### 3. O utilizador vê as recomendações

As recomendações aparecem ordenadas da mais adequada para a menos adequada
(máximo de 10 por vez), com:

- Nome do serviço e do banco/provedor
- Percentagem de adequação
- Explicação personalizada
- Detalhes como taxa de juro, prazo, valor mínimo e máximo

O utilizador pode então:
- **Aceitar** a recomendação (demonstrar interesse)
- **Rejeitar** a recomendação
- **Avaliar** a recomendação com uma nota de 1 a 5 (feedback)
- Ver mais detalhes clicando na recomendação

### 4. O sistema melhora com o tempo

Cada vez que um utilizador dá feedback, esse dado é guardado. Quando há feedback
suficiente (50 ou mais), o administrador pode pedir ao sistema para **retreinar**
o modelo de inteligência artificial, tornando-o ainda mais preciso.

---

## Exemplo completo com dados reais

### Quem é a Ana?

A Ana Joaquim é uma profissional empregada, com licenciatura, que ganha **150.000 Kz/mês**,
gasta **80.000 Kz/mês**, tem conta bancária, histórico de crédito positivo e um score
de crédito de **650** (numa escala de 0 a 1000). Ela tem 2 dependentes e quer explorar
qualquer tipo de serviço financeiro.

### O que o sistema fez?

**Passo 1 — Filtragem:**
Dos 7 serviços disponíveis no sistema, 1 foi eliminado (Crédito Habitação exige score 700,
e ela tem 650). **Sobraram 6 serviços** para avaliar.

**Passo 2 — IA calcula as probabilidades:**

| Posição | Serviço | Provedor | Adequação |
|---------|---------|----------|-----------|
| 1º | Crédito Pessoal BIC Express | Banco BIC | **92.3%** |
| 2º | Crédito Pessoal BIC Médio | Banco BIC | **83.1%** |
| 3º | Conta Poupança Millennium Plus | Millennium BCP | **78.5%** |
| 4º | Seguro de Saúde Standard Família | Standard Bank | **71.2%** |
| 5º | Seguro de Vida Standard Proteção | Standard Bank | **65.4%** |
| 6º | Microcrédito BIC Empreendedor | Banco BIC | **45.0%** |

**Passo 3 — Explicação gerada para a 1ª recomendação:**

> *"Com base no seu histórico de crédito positivo, conta bancária activa, score de crédito de 650, rendimento mensal (150.000 Kz) acima do mínimo exigido, este serviço tem 92.3% de adequação ao seu perfil. A sua capacidade de endividamento estimada é de 21.000 Kz/mês, compatível com este produto."*

**Por que 92.3%?** A Ana tem um perfil forte: renda boa, histórico de crédito, score alto,
conta bancária. O Crédito BIC Express tem juros razoáveis (18.5%) e prazos flexíveis.
A combinação destes fatores faz com que seja uma excelente recomendação.

**Por que 45.0% para o microcrédito?** O microcrédito é desenhado para pessoas com
rendimentos mais baixos e sem histórico de crédito. A Ana tem um perfil que permite
acesso a produtos mais vantajosos, então o microcrédito não é a melhor opção.

---

## E se a inteligência artificial falhar?

O sistema foi desenhado para **nunca parar de funcionar**. Se o serviço de IA estiver
momentaneamente indisponível (por exemplo, manutenção), o sistema usa uma **fórmula
manual de reserva** que calcula a adequação com base em regras práticas:

- Se o rendimento é muito maior que o mínimo exigido, ganha pontos
- Se tem histórico de crédito, ganha pontos
- Se tem conta bancária, ganha pontos
- Se o score de crédito é alto, ganha mais pontos

Isto garante que o utilizador recebe sempre recomendações, mesmo que um pouco menos
precisas do que com a IA.

---

## Como os bancos (provedores) participam?

Os bancos e seguradoras têm acesso próprio ao sistema onde podem:

1. **Cadastrar novos produtos**: definir nome, tipo, taxa de juro, prazos, valores,
   renda mínima exigida, score mínimo, se precisa de conta bancária
2. **Ver análises**: quantas vezes os seus produtos foram recomendados, aceites ou rejeitados
3. **Actualizar produtos**: alterar condições quando necessário

---

## Como o administrador controla tudo?

O administrador tem um painel completo onde pode:

- **Ver métricas gerais**: quantos utilizadores, quantas recomendações geradas,
  quantos serviços cadastrados, qual a taxa de aceitação
- **Gerir utilizadores**: criar, activar, desactivar contas
- **Acompanhar o modelo de IA**: ver versões, precisão, recall, e outras métricas
  de desempenho
- **Retreinar o modelo**: quando há dados de feedback suficientes, pode mandar
  a IA aprender novamente com os novos dados
- **Ajustar regras de risco**: configurar pesos para diferentes factores
  (rendimento, score, idade, histórico)

---

## Resumo simples

```
Utilizador cria perfil financeiro
         │
         ▼
Sistema filtra serviços incompatíveis
         │
         ▼
IA calcula % de adequação para cada serviço
         │
         ▼
Sistema ordena do melhor para o pior
         │
         ▼
Cada recomendação vem com explicação
         │
         ▼
Utilizador aceita, rejeita ou avalia
         │
         ▼
Sistema guarda feedback e melhora com o tempo
```

Tecnologias usadas (para quem tiver curiosidade técnica):
- **Frontend**: Next.js — a interface que o utilizador vê no browser
- **Backend**: Node.js + PostgreSQL — o cérebro que processa os pedidos e guarda os dados
- **IA**: Python + Scikit-learn — o motor que calcula as probabilidades de adequação
