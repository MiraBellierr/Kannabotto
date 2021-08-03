const router = require('express').Router();
const auth = require('./auth');
const discord = require('./discord');

router.use('/auth', auth);
router.use('/discord', discord);
router.get('/', (req, res) => {
	res.sendStatus(200);
});

module.exports = router;