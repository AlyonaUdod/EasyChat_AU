const express = require('express');
const router = express.Router();
const ctrlUser = require('../controllers/messageController');

router.get('/', ctrlUser.getMessages);

router.post('/', ctrlUser.postMessage);

module.exports = router;