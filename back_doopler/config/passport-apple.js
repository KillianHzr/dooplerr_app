const passport = require('passport');
const crypto = require('crypto');
const AppleStrategy = require('passport-apple').Strategy;
const User = require('../models/User');
const crypto = require('crypto');

passport.use(new AppleStrategy({
    clientID: process.env.APPLE_CLIENT_ID,
    teamID: process.env.APPLE_TEAM_ID,
    keyID: process.env.APPLE_KEY_ID,
    privateKeyLocation: process.env.APPLE_PRIVATE_KEY_LOCATION,
    callbackURL: 'http://localhost:3000/auth/apple/callback',
    scope: 'name email'
},
async function(req, accessToken, refreshToken, profile, done) {
    try {
        const existingUser = await User.findOne({ where: { email: profile.email } });
        if (existingUser) {
            return done(null, existingUser);
        }

        const password = crypto.randomBytes(32).toString('hex');

        const newUser = await User.create({
            username: profile.displayName,
            email: profile.email,
            firstname: profile.given_name,
            lastname: profile.family_name,
            password: password,
            image_path: profile.photos[0].value,
            apple_id: profile.sub
        });

        done(null, newUser);
    } catch (err) {
        console.error(err);
        done(err);
    }
}
));
