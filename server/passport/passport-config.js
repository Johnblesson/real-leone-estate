// import passport from 'passport';
// import LocalStrategy from 'passport-local';
// import bcrypt from 'bcrypt';
// import User from  '../models/auth.js'; // Adjust the path based on your project structure

// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });

//       if (!user) {
//         return done(null, false, { message: 'User does not exist.' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return done(null, false, { message: 'Invalid credentials.' });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default passport;


// import passport from 'passport';
// import { Strategy as LocalStrategy } from 'passport-local';
// import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
// import bcrypt from 'bcrypt';
// import User from '../models/auth.js'; // Adjust the path based on your project structure
// import dotenv from 'dotenv'
// dotenv.config();

// passport.use(new LocalStrategy(
//   async (username, password, done) => {
//     try {
//       const user = await User.findOne({ username: username });

//       if (!user) {
//         return done(null, false, { message: 'User does not exist.' });
//       }

//       const isMatch = await bcrypt.compare(password, user.password);

//       if (!isMatch) {
//         return done(null, false, { message: 'Invalid credentials.' });
//       }

//       return done(null, user);
//     } catch (err) {
//       return done(err);
//     }
//   }
// ));

// passport.use(new GoogleStrategy({
//   clientID: process.env.GOOGLE_CLIENT_ID,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//   callbackURL: '/auth/google/callback'
// }, async (token, tokenSecret, profile, done) => {
//   try {
//     let user = await User.findOne({ googleId: profile.id });

//     if (!user) {
//       user = new User({
//         googleId: profile.id,
//         username: profile.displayName,
//         email: profile.emails[0].value
//       });
//       await user.save();
//     }

//     return done(null, user);
//   } catch (err) {
//     return done(err, null);
//   }
// }));

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err, null);
//   }
// });

// export default passport;

import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcrypt';
import User from '../models/auth.js'; // Adjust the path based on your project structure
import dotenv from 'dotenv'
dotenv.config();

passport.use(new LocalStrategy(
  async (username, password, done) => {
    try {
      const user = await User.findOne({ username });

      if (!user) {
        return done(null, false, { message: 'User does not exist.' });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return done(null, false, { message: 'Invalid credentials.' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: '/auth/google/callback'
}, async (token, tokenSecret, profile, done) => {
  try {
    let user = await User.findOne({ googleId: profile.id });

    if (!user) {
      user = new User({
        googleId: profile.id,
        fullname: profile.displayName,
        username: profile.displayName.replace(/\s+/g, '').toLowerCase(), // Generate a username
        email: profile.emails[0].value,
        photo: profile.photos[0].value,   // Use the photo URL from the Google profile
        password: 'default-password',     // Generate or set a default password, ensure to hash it if required
        phone: '000-000-0000',            // Default phone number, you might want to handle this more appropriately
        role: 'user',                     // Default role
        status: 'active',                 // Default status
        accountant: false,                // Default accountant status
        sudo: false                       // Default sudo status
      });
      await user.save();
    }

    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
