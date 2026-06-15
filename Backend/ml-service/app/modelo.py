"""
Módulo do Modelo Preditivo
Algoritmo: Regressão Logística
Feature engineering + treino + previsão
"""
import os
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, roc_auc_score
)

MODEL_PATH = os.path.join(os.path.dirname(__file__), '../models')
os.makedirs(MODEL_PATH, exist_ok=True)

# Categorias para encoding
NIVEIS_EDU  = ['primaria', 'secundaria', 'licenciatura', 'mestrado', 'doutoramento']
SITUACOES   = ['desempregado', 'estudante', 'autonomo', 'empregado', 'reformado']
OBJETIVOS   = ['poupanca', 'credito', 'seguro', 'investimento', 'todos']
TIPOS_SERV  = [
    'microcredito', 'conta_poupanca', 'credito_pessoal',
    'credito_habitacao', 'seguro_vida', 'seguro_saude',
    'seguro_automovel', 'investimento'
]


def _engenharia_features(df: pd.DataFrame) -> pd.DataFrame:
    """Transformar dados brutos em features para o modelo."""
    feats = pd.DataFrame()

    # Numéricas normalizadas
    feats['rendimento_mensal']      = df['rendimento_mensal'].astype(float)
    feats['despesas_mensais']       = df['despesas_mensais'].astype(float)
    feats['capacidade_endividamento'] = df.get(
        'capacidade_endividamento',
        (df['rendimento_mensal'] - df['despesas_mensais']) * 0.30
    ).astype(float).clip(lower=0)
    feats['dependentes']            = df['dependentes'].astype(int)
    feats['score_credito']          = df['score_credito'].fillna(0).astype(float)
    feats['taxa_juro_anual']        = df.get('taxa_juro_anual', 0).fillna(0).astype(float)
    feats['prazo_max_meses']        = df.get('prazo_maximo_meses', df.get('prazo_max_meses', 0)).fillna(0).astype(float)
    feats['montante_max']           = df.get('montante_maximo', df.get('montante_max', 0)).fillna(0).astype(float)
    feats['rendimento_min_servico'] = df.get('rendimento_minimo', df.get('rendimento_min', 0)).fillna(0).astype(float)

    # Rácio rendimento/mínimo exigido
    feats['racio_rendimento'] = np.where(
        feats['rendimento_min_servico'] > 0,
        feats['rendimento_mensal'] / feats['rendimento_min_servico'],
        2.0
    ).clip(0, 10)

    # Rácio poupança
    feats['racio_poupanca'] = np.where(
        feats['rendimento_mensal'] > 0,
        (feats['rendimento_mensal'] - feats['despesas_mensais']) / feats['rendimento_mensal'],
        0
    ).clip(-1, 1)

    # Booleanas
    feats['tem_conta_bancaria']    = df['tem_conta_bancaria'].astype(int)
    feats['tem_historico_credito'] = df['tem_historico_credito'].astype(int)

    # Encoding ordinal — nível educação
    feats['nivel_educacao_enc'] = pd.Categorical(
        df['nivel_educacao'], categories=NIVEIS_EDU, ordered=True
    ).codes.clip(lower=0)

    # Encoding ordinal — situação emprego
    feats['situacao_emprego_enc'] = pd.Categorical(
        df['situacao_emprego'], categories=SITUACOES, ordered=True
    ).codes.clip(lower=0)

    # One-hot — objetivo financeiro
    for obj in OBJETIVOS:
        feats[f'obj_{obj}'] = (df['objetivo_financeiro'] == obj).astype(int)
    feats['obj_todos_flag'] = (df['objetivo_financeiro'] == 'todos').astype(int)

    # One-hot — tipo de serviço
    tipo_col = df.get('tipo_servico', df.get('tipo', 'credito_pessoal'))
    for tp in TIPOS_SERV:
        feats[f'tipo_{tp}'] = (tipo_col == tp).astype(int)

    return feats


class ModeloRecomendacao:
    def __init__(self):
        self.modelo  = None
        self.scaler  = None
        self.versao  = None
        self._carregar_modelo()

    # ─────────────────────────────────────────
    # Persistência
    # ─────────────────────────────────────────
    def _carregar_modelo(self):
        caminho_modelo  = os.path.join(MODEL_PATH, 'modelo_ativo.pkl')
        caminho_scaler  = os.path.join(MODEL_PATH, 'scaler_ativo.pkl')
        caminho_versao  = os.path.join(MODEL_PATH, 'versao_ativa.txt')

        if os.path.exists(caminho_modelo):
            self.modelo  = joblib.load(caminho_modelo)
            self.scaler  = joblib.load(caminho_scaler)
            with open(caminho_versao) as f:
                self.versao = f.read().strip()
            print(f'[ML] Modelo carregado: {self.versao}')
        else:
            print('[ML] Nenhum modelo guardado — a criar modelo base...')
            self._criar_modelo_base()

    def _guardar_modelo(self, versao: str):
        joblib.dump(self.modelo, os.path.join(MODEL_PATH, 'modelo_ativo.pkl'))
        joblib.dump(self.scaler, os.path.join(MODEL_PATH, 'scaler_ativo.pkl'))
        with open(os.path.join(MODEL_PATH, 'versao_ativa.txt'), 'w') as f:
            f.write(versao)
        # Arquivo histórico
        joblib.dump(self.modelo, os.path.join(MODEL_PATH, f'modelo_{versao}.pkl'))
        self.versao = versao

    # ─────────────────────────────────────────
    # Modelo base (dados sintéticos)
    # ─────────────────────────────────────────
    def _criar_modelo_base(self):
        """Criar modelo inicial com dados sintéticos representativos de Angola."""
        np.random.seed(42)
        n = 500

        dados = {
            'rendimento_mensal':     np.random.uniform(30000, 500000, n),
            'despesas_mensais':      np.random.uniform(20000, 400000, n),
            'dependentes':           np.random.randint(0, 6, n),
            'score_credito':         np.random.randint(0, 1000, n),
            'taxa_juro_anual':       np.random.uniform(8, 25, n),
            'prazo_max_meses':       np.random.choice([12,24,36,48,60,120,360], n),
            'montante_max':          np.random.uniform(100000, 50000000, n),
            'rendimento_min_servico':np.random.uniform(0, 200000, n),
            'tem_conta_bancaria':    np.random.randint(0, 2, n),
            'tem_historico_credito': np.random.randint(0, 2, n),
            'nivel_educacao':        np.random.choice(NIVEIS_EDU, n),
            'situacao_emprego':      np.random.choice(SITUACOES, n),
            'objetivo_financeiro':   np.random.choice(OBJETIVOS, n),
            'tipo_servico':          np.random.choice(TIPOS_SERV, n),
            'capacidade_endividamento': None,
        }
        df = pd.DataFrame(dados)
        df['capacidade_endividamento'] = (
            (df['rendimento_mensal'] - df['despesas_mensais']) * 0.30
        ).clip(lower=0)

        # Rótulo sintético baseado em regras heurísticas
        adequado = (
            (df['rendimento_mensal'] >= df['rendimento_min_servico']) &
            (df['rendimento_mensal'] > df['despesas_mensais']) &
            (
                (df['score_credito'] >= 400) |
                (df['tipo_servico'].isin(['microcredito','seguro_vida','seguro_saude','conta_poupanca']))
            )
        ).astype(int)
        # Adicionar algum ruído
        ruido = np.random.binomial(1, 0.1, n)
        y = np.abs(adequado - ruido)

        self._treinar_interno(df, y, versao='v1.0.0-base')

    # ─────────────────────────────────────────
    # Treino
    # ─────────────────────────────────────────
    def _treinar_interno(self, df: pd.DataFrame, y, versao: str) -> dict:
        X = _engenharia_features(df)
        X_arr = X.values

        X_train, X_test, y_train, y_test = train_test_split(
            X_arr, y, test_size=0.2, random_state=42, stratify=y
        )

        self.scaler = StandardScaler()
        X_train_sc  = self.scaler.fit_transform(X_train)
        X_test_sc   = self.scaler.transform(X_test)

        self.modelo = LogisticRegression(
            C=1.0,
            max_iter=1000,
            solver='lbfgs',
            random_state=42,
            class_weight='balanced'
        )
        self.modelo.fit(X_train_sc, y_train)

        y_pred  = self.modelo.predict(X_test_sc)
        y_proba = self.modelo.predict_proba(X_test_sc)[:, 1]

        metricas = {
            'acuracia':  round(accuracy_score(y_test, y_pred),  4),
            'precisao':  round(precision_score(y_test, y_pred, zero_division=0), 4),
            'recall':    round(recall_score(y_test, y_pred, zero_division=0), 4),
            'f1_score':  round(f1_score(y_test, y_pred, zero_division=0), 4),
            'auc_roc':   round(roc_auc_score(y_test, y_proba), 4),
        }

        self._guardar_modelo(versao)
        print(f'[ML] Modelo treinado {versao} → AUC-ROC: {metricas["auc_roc"]}')
        return metricas

    def treinar(self, dados_treino: list) -> dict:
        """Treinar com dados reais vindos da API."""
        df = pd.DataFrame(dados_treino)
        y  = df.pop('adequado').values
        versao = f'v{datetime.now().strftime("%Y%m%d%H%M%S")}'
        return self._treinar_interno(df, y, versao)

    # ─────────────────────────────────────────
    # Previsão
    # ─────────────────────────────────────────
    def prever(self, perfil: dict, servicos: list) -> dict:
        """Calcular probabilidade de adequação para cada serviço."""
        if not servicos:
            return {}

        linhas = []
        for s in servicos:
            linha = {**perfil, **s}
            linhas.append(linha)

        df   = pd.DataFrame(linhas)
        X    = _engenharia_features(df)
        X_sc = self.scaler.transform(X.values)

        probas = self.modelo.predict_proba(X_sc)[:, 1]

        return {s['id']: float(round(p, 4)) for s, p in zip(servicos, probas)}


# Singleton — partilhado por todos os requests
_instancia_modelo = None

def obter_modelo() -> ModeloRecomendacao:
    global _instancia_modelo
    if _instancia_modelo is None:
        _instancia_modelo = ModeloRecomendacao()
    return _instancia_modelo
