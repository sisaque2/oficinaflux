const express = require('express');
const router = express.Router();

const VehicleController = require('../controllers/veicleController');
const AttendanceController = require('../controllers/atendimentoController');

const verifyToken = require('../middlewares/authMiddleware');
const authorizeRole = require('../middlewares/roleMiddleware');

// rotas exclusivas do ATENDENTE (Cadastrar Veículos)
router.post('/veiculos', verifyToken, authorizeRole('atendente'), VehicleController.register);

// rotas exclusivas do CLIENTE (Relatar Problema / Abrir Chamado e Ver seus atendimentos)
router.post('/atendimentos', verifyToken, authorizeRole('cliente'), AttendanceController.create);
router.get('/meus-atendimentos', verifyToken, authorizeRole('cliente'), AttendanceController.getMyAttendances);

module.exports = router;