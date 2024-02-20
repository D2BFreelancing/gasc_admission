const express = require('express');
const app = express();
const bp = require('body-parser');
const express_layouts = require('express-ejs-layouts');
const routes = require('./server/routers/router');
require('./server/models/models');
port=300;

const mongoose = require('mongoose');
const connect = require("./server/database/database");
app.use(express_layouts);
app.set('layout','./layouts/main');

app.use(bp.json());
app.use(bp.urlencoded({extended:false}));

app.use(express.static('public'));
app.set('view engine','ejs');

app.use(routes);

app.listen(port,()=>{
    console.log(`http://localhost:${port}`);
})