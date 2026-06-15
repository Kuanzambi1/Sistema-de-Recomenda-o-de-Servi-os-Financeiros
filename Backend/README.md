# SRFS — Sistema de Recomendação de Serviços Financeiros
## Back-end Completo

### Arquitectura

```
backend/
├── node-api/          # API principal (Node.js + Express)
│   ├── src/
│   │   ├── server.js
│   │   ├── routes/index.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── perfilController.js
│   │   │   ├── servicosController.js
│   │   │   ├── recomendacoesController.js
│   │   │   ├── feedbackController.js
│   │   │   └── adminController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   └── config/database.js
│   ├── package.json
│   └── .env.example
├── ml-service/        # Serviço ML (Python + FastAPI)
│   ├── main.py
│   ├── app/modelo.py
│   └── requirements.txt
└── database/
    ├── schema.sql     # Criação das tabelas
    ├── migrate.js     # Script de migração
    └── seed.js        # Dados de exemplo
```

---

## Pré-requisitos

- Node.js >= 18
- Python >= 3.10
- PostgreSQL >= 14

---

## Instalação e arranque

### 1. Base de dados

```bash
# Criar base de dados e utilizador no PostgreSQL
psql -U postgres -c "CREATE USER srfs_user WITH PASSWORD 'srfs_password_segura';"
psql -U postgres -c "CREATE DATABASE srfs_db OWNER srfs_user;"
```

### 2. API Node.js

```bash
cd node-api
cp .env.example .env          # Editar .env com as suas credenciais
npm install
node ../database/migrate.js   # Criar tabelas
node ../database/seed.js      # Inserir dados de exemplo
npm run dev                   # Iniciar em modo desenvolvimento
```

A API fica disponível em: `http://localhost:3000`

### 3. Serviço ML (Python)

```bash
cd ml-service
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

O serviço ML fica disponível em: `http://localhost:8000`

---

## Endpoints principais

### Autenticação
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/registar` | Registar utilizador |
| POST | `/api/auth/login` | Login (retorna JWT) |
| GET  | `/api/auth/perfil` | Dados do utilizador autenticado |

### Perfil Financeiro
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/perfil` | Criar perfil financeiro |
| GET  | `/api/perfil` | Obter perfil |
| PUT  | `/api/perfil` | Actualizar perfil |

### Recomendações
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/recomendacoes` | Gerar recomendações (chama ML) |
| GET  | `/api/recomendacoes` | Listar recomendações do utilizador |
| PATCH| `/api/recomendacoes/:id/decisao` | Aceitar ou rejeitar |

### Feedback
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/feedbacks` | Submeter avaliação (Likert 1–5) |
| GET  | `/api/feedbacks/meus` | Histórico de feedbacks |

### Admin
| Método | Rota | Descrição |
|--------|------|-----------|
| GET  | `/api/admin/metricas` | Dashboard de métricas |
| POST | `/api/admin/modelo/retreinar` | Re-treinar modelo ML |
| GET  | `/api/admin/modelo/historico` | Histórico de versões do modelo |

---

## Exemplo de uso

```bash
# 1. Registar
curl -X POST http://localhost:3000/api/auth/registar \
  -H "Content-Type: application/json" \
  -d '{"nome":"João Silva","email":"joao@exemplo.ao","password":"Teste123"}'

# 2. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@exemplo.ao","password":"Teste123"}' | jq -r '.token')

# 3. Criar perfil financeiro
curl -X POST http://localhost:3000/api/perfil \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "rendimento_mensal": 150000,
    "despesas_mensais": 80000,
    "nivel_educacao": "licenciatura",
    "situacao_emprego": "empregado",
    "tem_conta_bancaria": true,
    "tem_historico_credito": true,
    "score_credito": 650
  }'

# 4. Gerar recomendações
curl -X POST http://localhost:3000/api/recomendacoes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

## Credenciais de teste (após seed)

| Tipo | Email | Password |
|------|-------|----------|
| Administrador | admin@srfs.ao | Admin@2025! |
| Utilizador | ana@exemplo.ao | User@2025! |
| Provedor | bic@srfs.ao | Banco@2025! |

---

## Regras de negócio implementadas

- **RN01–RN03**: Validação de elegibilidade (rendimento, conta bancária, score de crédito)
- **RN04**: Recomendações ordenadas por probabilidade de adequação (modelo ML)
- **RN05**: Explicação textual de cada recomendação (XAI simplificado)
- **RN06**: Escala Likert 1–5 para feedback
- **RN07**: Rate limiting — máx. 100 pedidos / 15 minutos por IP
- **RN08**: Re-treino automático do modelo quando existem ≥ 50 feedbacks
- **RN09**: Máximo de 10 recomendações por sessão
- **RN10**: Fallback heurístico quando serviço ML está indisponível
