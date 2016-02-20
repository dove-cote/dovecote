const express = require('express');
const router = express.Router();


router.use('/api/users', require('dovecote/components/user/router'));


module.exports = router;
