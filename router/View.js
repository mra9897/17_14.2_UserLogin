const express = require('express');
const router = express.Router();

const ADMIN = require('./Admin');
const security = require('../tools/security');

router.get('/', (req,res)=>{
    res.render('index');
});
router.get('/login', (req,res)=>{
    res.render('login');
});
router.use('/admin', ADMIN);

module.exports = router;