import os
import sys
import tempfile
import json

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

import numpy as np
from app.modelo import ModeloRecomendacao, obter_modelo


class TestModeloRecomendacao:
    def setup_method(self):
        self.modelo = ModeloRecomendacao()

    def test_modelo_carregado(self):
        assert self.modelo.modelo is not None
        assert self.modelo.scaler is not None
        assert self.modelo.versao is not None

    def test_prever_com_servicos(self):
        perfil = {
            'rendimento_mensal': 150000,
            'despesas_mensais': 80000,
            'dependentes': 2,
            'nivel_educacao': 'licenciatura',
            'situacao_emprego': 'empregado',
            'tem_conta_bancaria': True,
            'tem_historico_credito': True,
            'score_credito': 650,
            'objetivo_financeiro': 'credito',
            'capacidade_endividamento': 21000,
        }
        servicos = [
            {'id': 's1', 'tipo': 'credito_pessoal', 'taxa_juro_anual': 15.0, 'prazo_max_meses': 48, 'montante_max': 5000000, 'rendimento_min': 60000},
            {'id': 's2', 'tipo': 'seguro_vida', 'taxa_juro_anual': 0, 'prazo_max_meses': 12, 'montante_max': 0, 'rendimento_min': 0},
        ]

        resultado = self.modelo.prever(perfil, servicos)
        assert isinstance(resultado, dict)
        assert 's1' in resultado
        assert 's2' in resultado
        for v in resultado.values():
            assert 0.0 <= v <= 1.0

    def test_prever_sem_servicos(self):
        resultado = self.modelo.prever({}, [])
        assert resultado == {}

    def test_engenharia_features(self):
        import pandas as pd
        df = pd.DataFrame([{
            'rendimento_mensal': 150000,
            'despesas_mensais': 80000,
            'dependentes': 2,
            'nivel_educacao': 'licenciatura',
            'situacao_emprego': 'empregado',
            'tem_conta_bancaria': True,
            'tem_historico_credito': True,
            'score_credito': 650,
            'objetivo_financeiro': 'credito',
            'tipo_servico': 'credito_pessoal',
        }])

        # Testando a função interna importando diretamente
        from app.modelo import _engenharia_features
        feats = _engenharia_features(df)
        assert feats is not None
        assert len(feats) > 0
