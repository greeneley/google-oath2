const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');
var userProfile;


app.set('view engine', 'ejs');


app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'SECRET'
}));

app.use(passport.initialize());
app.use(passport.session());


app.get('/', (req, res) => {
    res.render('pages/auth');
});

app.get('/success', (req, res) => {
    res.send(userProfile)
});

app.get('/error', (req, res) => {
    res.send('error logging in');
})

passport.serializeUser(function (user, cb) {
    cb(null, user);
})

passport.deserializeUser(function (obj, cd) {
    cb(null, obj);
})


/* Google AUTH */

const GoogleStratyge = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '552937063788-pd0hd1cvdsmm00e33bku21anihh28jav.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'N4M_ThIH5fSVf0aXmbFzmMwI';

passport.use(new GoogleStratyge({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        userProfile = profile;
        return done(null, userProfile);
    }
))

app.get('/auth/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/error'
    },
        function (req, res) {
            res.redirect('/success');
        })
)

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('app listening on port ' + port))