var router = require('express').Router();
const initiatePasswordReset = require('./initiatePasswordReset');
const resetPasswordForm = require('./resetPasswordForm');
const completePasswordReset = require('./completePasswordReset');

router.post('/initiate', initiatePasswordReset);
router.get('/reset', resetPasswordForm);
router.post('/complete', completePasswordReset);

module.exports = router;
