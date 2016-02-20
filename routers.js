const express = require('express');
const router = express.Router();


router.use('/api/users', require('dovecote/components/user/router'));
router.use('/api/services', require('dovecote/components/service/router'));
router.use('/api/components', require('dovecote/components/component/router'));
router.use('/api/projects', require('dovecote/components/project/router'));
router.use('/', require('dovecote/components/index/router'));


module.exports = router;
