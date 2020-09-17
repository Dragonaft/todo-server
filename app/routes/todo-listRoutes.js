const list_todos = require('../controllers/todolistController');
const router = require('express').Router();

router.get('/', list_todos.findAll);
router.get('/one', list_todos.findOne);
router.post('/', list_todos.create);
router.delete('/:id', list_todos.delete);

module.exports = router;
