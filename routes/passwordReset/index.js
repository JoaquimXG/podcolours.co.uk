var router = require('express').Router();
const initiatePasswordReset = require('./initiatePasswordReset');

router.use('/initiate', initiatePasswordReset);

module.exports = router;
