const express = require('express');
const router = express.Router();
const caseController = require('../controllers/caseController');

// API Endpoints
router.get('/', caseController.getAllCases);
router.post('/', caseController.createCase);
router.get('/:id', caseController.getCaseById);
router.put('/:id', caseController.updateCase);
router.delete('/:id', caseController.deleteCase);

module.exports = router;
