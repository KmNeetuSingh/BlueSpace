const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const taskController = require('../controllers/taskControllers')

router.get('/', auth, taskController.getTasks)
router.get('/debug-all', auth, taskController.getAllTasksDebug) // Debug endpoint
router.get('/test-all', taskController.testAllTasks) // Test endpoint without auth
router.post('/', auth, taskController.createTask)
router.put('/:id', auth, taskController.updateTask)
router.delete('/:id', auth, taskController.deleteTask)

module.exports = router
