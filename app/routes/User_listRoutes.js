const user_lists = require('../controllers/User_listController');
const router = require('express').Router();
const auth = require('../middleware/auth');

router.get('/', user_lists.findAll);
router.get('/one', user_lists.findOne);
router.post('/', user_lists.create);
router.delete('/:id', user_lists.delete);
router.post('/login', user_lists.login);
router.post('/register', user_lists.create);
router.post('/logout', user_lists.logout);
router.post('/:id',user_lists.update);

router.get('/me', auth, user_lists.me);

module.exports = router;
