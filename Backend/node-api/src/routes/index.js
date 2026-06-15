const express = require('express');
const { body, param, query } = require('express-validator');
const { autenticar, autorizar } = require('../middleware/auth');
const { validar } = require('../middleware/errorHandler');

const authCtrl   = require('../controllers/authController');
const perfilCtrl = require('../controllers/perfilController');
const servicosCtrl = require('../controllers/servicosController');
const recsCtrl   = require('../controllers/recomendacoesController');
const fbCtrl     = require('../controllers/feedbackController');
const adminCtrl  = require('../controllers/adminController');

const router = express.Router();

// -----------------------------------------------
// AUTH
// -----------------------------------------------
router.post('/auth/registar',
  body('nome').trim().isLength({ min: 3 }).withMessage('Nome deve ter pelo menos 3 caracteres.'),
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').isLength({ min: 8 }).withMessage('Password deve ter pelo menos 8 caracteres.')
    .matches(/^(?=.*[A-Z])(?=.*[0-9])/).withMessage('Password deve conter maiúscula e número.'),
  body('tipo').optional().isIn(['utilizador','provedor']).withMessage('Tipo inválido.'),
  validar, authCtrl.registar
);

router.post('/auth/login',
  body('email').isEmail().withMessage('Email inválido.'),
  body('password').notEmpty().withMessage('Password obrigatória.'),
  validar, authCtrl.login
);

router.get('/auth/perfil', autenticar, authCtrl.obterPerfil);

router.post('/auth/alterar-password',
  autenticar,
  body('password_atual').notEmpty(),
  body('password_nova').isLength({ min: 8 }).matches(/^(?=.*[A-Z])(?=.*[0-9])/),
  validar, authCtrl.alterarPassword
);

// -----------------------------------------------
// PERFIL FINANCEIRO
// -----------------------------------------------
router.get('/perfil', autenticar, autorizar('utilizador'), perfilCtrl.obterPerfil);

router.post('/perfil',
  autenticar, autorizar('utilizador'),
  body('rendimento_mensal').isFloat({ min: 0 }).withMessage('Rendimento inválido.'),
  body('despesas_mensais').isFloat({ min: 0 }).withMessage('Despesas inválidas.'),
  body('nivel_educacao').isIn(['primaria','secundaria','licenciatura','mestrado','doutoramento']),
  body('situacao_emprego').isIn(['empregado','autonomo','desempregado','reformado','estudante']),
  validar, perfilCtrl.criarPerfil
);

router.put('/perfil',
  autenticar, autorizar('utilizador'),
  body('rendimento_mensal').optional().isFloat({ min: 0 }),
  body('despesas_mensais').optional().isFloat({ min: 0 }),
  validar, perfilCtrl.actualizarPerfil
);

// -----------------------------------------------
// SERVIÇOS FINANCEIROS
// -----------------------------------------------
router.get('/servicos', servicosCtrl.listar);
router.get('/servicos/:id', servicosCtrl.obter);

router.post('/servicos',
  autenticar, autorizar('provedor','administrador'),
  body('nome').trim().notEmpty(),
  body('tipo').isIn([
    'credito_pessoal','credito_habitacao','microcredito',
    'seguro_vida','seguro_saude','seguro_automovel',
    'conta_poupanca','investimento'
  ]),
  body('prazo_minimo_meses').isInt({ min: 1 }),
  body('prazo_maximo_meses').isInt({ min: 1 }),
  body('montante_minimo').isFloat({ min: 0 }),
  validar, servicosCtrl.criar
);

router.put('/servicos/:id',
  autenticar, autorizar('provedor','administrador'),
  validar, servicosCtrl.actualizar
);

// -----------------------------------------------
// RECOMENDAÇÕES
// -----------------------------------------------
router.post('/recomendacoes',
  autenticar, autorizar('utilizador'),
  body('montante_pretendido').optional().isFloat({ min: 0 }),
  validar, recsCtrl.gerar
);

router.get('/recomendacoes', autenticar, autorizar('utilizador'), recsCtrl.listar);
router.get('/recomendacoes/:id', autenticar, autorizar('utilizador'), recsCtrl.obter);

router.patch('/recomendacoes/:id/decisao',
  autenticar, autorizar('utilizador'),
  body('aceite').isBoolean(),
  validar, recsCtrl.registarDecisao
);

// -----------------------------------------------
// FEEDBACK
// -----------------------------------------------
router.post('/feedbacks',
  autenticar, autorizar('utilizador'),
  body('recomendacao_id').isUUID(),
  body('nota_likert').isInt({ min: 1, max: 5 }).withMessage('Nota deve ser entre 1 e 5 (escala Likert).'),
  body('comentario').optional().isString().isLength({ max: 500 }),
  body('util').optional().isBoolean(),
  validar, fbCtrl.submeter
);

router.get('/feedbacks/meus', autenticar, autorizar('utilizador'), fbCtrl.listarMeus);

// -----------------------------------------------
// ADMIN
// -----------------------------------------------
router.get('/admin/metricas',
  autenticar, autorizar('administrador'), adminCtrl.metricas);

router.post('/admin/modelo/retreinar',
  autenticar, autorizar('administrador'), adminCtrl.retreinarModelo);

router.get('/admin/modelo/historico',
  autenticar, autorizar('administrador'), adminCtrl.historicoModelos);

router.get('/admin/utilizadores',
  autenticar, autorizar('administrador'), adminCtrl.listarUtilizadores);

router.get('/admin/feedbacks/estatisticas',
  autenticar, autorizar('administrador'), fbCtrl.estatisticas);

module.exports = router;
