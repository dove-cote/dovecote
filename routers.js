const express = require('express');
const router = express.Router();


router.use('/api/users', require('dovecote/components/user/router'));
router.use('/api/services', require('dovecote/components/service/router'));
router.use('/api/components', require('dovecote/components/component/router'));


module.exports = router;
