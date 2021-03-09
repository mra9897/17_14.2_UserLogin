const express = require('express');
const router = express.Router();

const Api = require('./Api');
const View = require('./View');

router.use('/api', Api);
router.use('/', View);


module.exports = router;