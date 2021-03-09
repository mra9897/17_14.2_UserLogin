const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const security = require('../tools/security');

router.post('/create', (req, res) => {
    //todo: username should be unique
    if(!security.findUser(req.users, req.body.username, req.body.password)) {
        req.users.push({...req.body, isLoggedIn: false});
        fs.writeFileSync(path.join(__dirname, '..', 'data', 'users.json'), JSON.stringify(req.users, null, 2));
        console.log(`LOG::> ${req.body.username} created`);
        return res.status(201).json({result: true});
    }
    console.log(`LOG::> ${req.body.username} exist`);

    res.status(200).json({result: "user exist"});
});

router.post('/logout', (req,res)=>{
    let token = security.decode(req.body.user);
    let user = req.users.find(u=>u.username === token[0] && u.password === token[1]);
    user.isLoggedIn = false;
    security.updateDB(req.users);
    res.json({status:200});
});

router.post('/update-info', security.checkLogin, (req,res)=>{
    let reqToken = security.decode(req.body.token);
    let user = req.users.find(u => u.username === reqToken[0] && u.password === reqToken[1]);
    let update = req.body;
    user.name = update.name;
    user.username = update.username;
    user.email = update.email;
    user.gender = update.gender;
    let token = security.encode(user.username+"***"+user.password);
    security.updateDB(req.users);
    res.json({status:200, token});
});

router.post('/update-password', security.checkLogin, (req, res) => {
    let reqToken = security.decode(req.body.token);
    let user = req.users.find(u => u.username === reqToken[0] && u.password === reqToken[1]);
    let update = req.body;
    if(update.oldPassword !== reqToken[1])
        return res.json({status: 400, message: "old password is incorrect"});
    user.password = update.newPassword;
    let token = security.encode(user.username+"***"+user.password);
    security.updateDB(req.users);
    res.json({status:200, token});
});



module.exports = router;