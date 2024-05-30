const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET;
dotenv.config();

passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  async function(email, password, done) {
    try {
      const user = await User.findOne({ where: { email: email } });
      if (!user || !user.validatePassword(password)) {
        return done(null, false, { message: 'Incorrect email or password.' });
      }
      const token = user.generateJwtToken();
      return done(null, user, { token });
    } catch (err) {
      return done(err);
    }
  }
));

User.prototype.generateJwtToken = function() {
  const token = jwt.sign({ id: this.id }, secret, { expiresIn: '24h' });
  return token;
};

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});