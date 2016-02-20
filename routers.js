const express = require('express');
const router = express.Router();


router.use('/api/users', require('dovecote/routers/users'));


module.exports = router;
