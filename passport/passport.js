const passport=require('passport')
const USER = require('../model/userModel')

var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = 'scecretKey';
passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
 // { email: 'kelvin', iat: 1672663208, exp: 1672749608 }
    USER.findOne({id: jwt_payload.sub}, function(err, user) {
        if (err) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));