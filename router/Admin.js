const express = require('express');
const router = express.Router();

const security = require('../tools/security');

router.get(
        '/',
        (
            req,
            res
        ) => res.render('./dashboard/index')
    );
router.get('/refresh', (req,res)=>{
    let token = security.decode(req.query.token);
    res.json(req.users.find(u=>u.username === token[0] && u.password === token[1]));
});
router.post('/', (req, res) => {
    console.log(req.body);
    let user = req.users.find(u => {
        return u.username === req.body.username;
    });
    if (user) {
        let token = security.encode(user.username + "***" + user.password);
        user.isLoggedIn = true;
        console.log(token);
        security.updateDB(req.users);
        res.render('./dashboard/index', {user, token});
    } else
        res.redirect(301, '/login?error=true');
    // let token = security.decode(gLoginToken);
    // res.render('./dashboard/index', {user: security.findUser(req.users, token[0], token[1])});
});

module.exports = router;