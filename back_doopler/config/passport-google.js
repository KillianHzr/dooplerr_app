const passport = require('passport');
const crypto = require('crypto');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
},
async function(accessToken, refreshToken, profile, done) {
    try {
        const existingUser = await User.findOne({ where: { email: profile.emails[0].value } });
        if (existingUser) {
            return done(null, existingUser);
        }

        const password = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            username: profile.displayName,
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            password: password,
            image_path: profile.photos[0].value,
            google_id: profile.id
        });

        done(null, newUser);
    } catch (err) {
        console.error(err);
        done(err);
    }
}
));
