import { Router } from 'express';
import session from 'express-session';
import RedisStore from 'connect-redis';
import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';

const SessionStore = RedisStore(session);

const GITHUB_CLIENT_ID = '6fca31798d9837066784';
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const router = Router();

passport.serializeUser(function(user, done) {
  console.log(user); // eslint-disable-line no-console
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  console.log(obj); // eslint-disable-line no-console
  done(null, obj);
});

passport.use(new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/github/callback'
  },
  function(accessToken, refreshToken, profile, done) {
    // asynchronous verification, for effect...
    process.nextTick(function () {
      console.log(profile); // eslint-disable-line no-console

      // To keep the example simple, the user's GitHub profile is returned to
      // represent the logged-in user.  In a typical application, you would want
      // to associate the GitHub account with a user record in your database,
      // and return that user instead.
      return done(null, profile);
    });
  }
));

router.use(session({
  store: new SessionStore({
    host: 'localhost',
    port: 6379
  }),
  secret: 'a keyboard cat',
  resave: false,
  saveUninitialized: false,
}));

router.use(passport.initialize());
router.use(passport.session());

router.use(function (req, res, next) {
  if (!req.session) {
    return next(new Error('oh no')); // handle error
  }
  next(); // otherwise continue
});

router.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

router.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

router.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

export default router;
