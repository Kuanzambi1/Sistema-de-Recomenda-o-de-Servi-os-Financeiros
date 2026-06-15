"""
Serviço ML — SRFS
FastAPI + Scikit-learn (Regressão Logística)
"""
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

from app.modelo import obter_modelo

app = FastAPI(
    title="SRFS — Serviço ML",
    description="Serviço de análise preditiva para recomendação de serviços financeiros.",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────
# Schemas Pydantic
# ─────────────────────────────────────────

class PerfilSchema(BaseModel):
    rendimento_mensal:       float = Field(..., ge=0)
    despesas_mensais:        float = Field(..., ge=0)
    dependentes:             int   = Field(0, ge=0)
    nivel_educacao:          str
    situacao_emprego:        str
    tem_conta_bancaria:      bool  = False
    tem_historico_credito:   bool  = False
    score_credito:           float = 0
    objetivo_financeiro:     str   = 'todos'
    capacidade_endividamento:float = 0

class ServicoSchema(BaseModel):
    id:              str
    tipo:            str
    taxa_juro_anual: float = 0
    prazo_max_meses: int   = 12
    montante_max:    float = 0
    rendimento_min:  float = 0

class PedidoPrevisao(BaseModel):
    perfil:   PerfilSchema
    servicos: List[ServicoSchema]

class ItemTreino(BaseModel):
    rendimento_mensal:       float
    despesas_mensais:        float
    dependentes:             int   = 0
    nivel_educacao:          str
    situacao_emprego:        str
    tem_conta_bancaria:      bool  = False
    tem_historico_credito:   bool  = False
    score_credito:           float = 0
    objetivo_financeiro:     str   = 'todos'
    capacidade_endividamento:float = 0
    tipo_servico:            str
    taxa_juro_anual:         float = 0
    prazo_maximo_meses:      int   = 12
    montante_maximo:         float = 0
    rendimento_minimo:       float = 0
    adequado:                int   = Field(..., ge=0, le=1)

class PedidoTreino(BaseModel):
    dados_treino: List[ItemTreino]

# ─────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────

@app.get("/health")
def health():
    modelo = obter_modelo()
    return {
        "estado": "ok",
        "servico": "SRFS ML Service",
        "versao_modelo": modelo.versao,
        "timestamp": datetime.utcnow().isoformat()
    }

@app.post("/prever")
def prever(pedido: PedidoPrevisao):
    """
    Calcular probabilidade de adequação de cada serviço para o perfil dado.
    Retorna dict {servico_id: probabilidade}.
    """
    if not pedido.servicos:
        raise HTTPException(status_code=400, detail="Lista de serviços vazia.")

    modelo = obter_modelo()

    perfil_dict  = pedido.perfil.model_dump()
    servicos_lst = [s.model_dump() for s in pedido.servicos]

    try:
        probabilidades = modelo.prever(perfil_dict, servicos_lst)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro na previsão: {str(e)}")

    # Ordenar do mais adequado para o menos
    ordenado = dict(sorted(probabilidades.items(), key=lambda x: x[1], reverse=True))

    return {
        "probabilidades": ordenado,
        "modelo_versao": modelo.versao,
        "total_servicos_avaliados": len(ordenado)
    }

@app.post("/treinar")
def treinar(pedido: PedidoTreino):
    """
    Re-treinar o modelo com novos dados de feedback.
    Requer pelo menos 50 amostras.
    """
    if len(pedido.dados_treino) < 50:
        raise HTTPException(
            status_code=400,
            detail=f"São necessárias pelo menos 50 amostras. Recebidas: {len(pedido.dados_treino)}"
        )

    modelo = obter_modelo()
    dados  = [d.model_dump() for d in pedido.dados_treino]

    try:
        metricas = modelo.treinar(dados)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no treino: {str(e)}")

    return {
        "mensagem": "Modelo re-treinado com sucesso.",
        "versao": modelo.versao,
        "metricas": metricas,
        "amostras": len(dados)
    }

@app.get("/modelo/info")
def info_modelo():
    """Informação sobre o modelo activo."""
    modelo = obter_modelo()
    coef   = modelo.modelo.coef_[0].tolist() if modelo.modelo else []
    return {
        "versao": modelo.versao,
        "algoritmo": "Regressão Logística",
        "num_features": len(coef),
        "intercept": float(modelo.modelo.intercept_[0]) if modelo.modelo else None,
    }
