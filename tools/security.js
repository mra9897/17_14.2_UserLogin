const fs = require('fs');
const path = require('path');

const encode = content => Buffer.from(content).toString('base64');
const decode = content => Buffer.from(content, 'base64').toString('ascii').split('***');
const checkLogin = (req, res, next) => {
    if (!req.body.token)
        return res.json({status: 301, url: "/login"});
    next();
};
const findUser = (users, username, password) => users.find(user => user.username === username && user.password === password);
const updateDB = users => {
    fs.writeFileSync(
        path.join(__dirname, '..', 'data', 'users.json'),
        JSON.stringify(users, null, 2),
        'utf-8'
    )
}

module.exports = {encode, decode, checkLogin, findUser, updateDB};