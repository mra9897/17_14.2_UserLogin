const express = require('express');
const app = express();
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const Route = require('./router/Router');

//config
const PORT = 5002;
app.use(cors());
app.set('views', path.join(__dirname, 'front'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname,'front')));

app.use('/', (req, res, next) => {
    if (typeof req.users === "undefined")
        req.users = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'users.json'), 'utf-8'));
    next();
});

app.use('/', Route);

app.listen(PORT, ()=>console.log(`running on port ${PORT}`));