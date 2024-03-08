let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin.js');

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/', indexRouter);
app.use('/admin', adminRouter);

module.exports = app;
