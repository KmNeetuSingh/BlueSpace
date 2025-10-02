const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const aiController = require('../controllers/aiController');

router.get('/', auth, aiController.getAISuggestions);
router.post('/', auth, aiController.createAISuggestion);
router.delete('/:id', auth, aiController.deleteAISuggestion);

module.exports = router;
