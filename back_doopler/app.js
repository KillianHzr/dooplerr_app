let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');
const dotenv = require('dotenv');
const cors = require('cors');
const passport = require('passport');
dotenv.config();

// Lecture du fichier models/index.js afin de lancer la synchronisation de Sequelize
require('./models/index.js');

// Configuration de Passport.js
require('./config/passport-local');
require('./config/passport-google');

const indexRouter = require('./routes/index');
const adminRouter = require('./routes/admin.js');
const authRouter = require('./routes/auth');

const crypto = require('crypto');

function generateSecret() {
  return crypto.randomBytes(32).toString('hex');
}

const secret = generateSecret();

let app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Configuration de Passport.js
app.use(require('express-session')({ secret: secret, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/auth', authRouter);

module.exports = app;
