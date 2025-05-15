const express = require('express');
const router = express.Router();
const { chatController } = require('../controlador/chatController');

router.post('/chat', chatController.responder);

module.exports = router;
