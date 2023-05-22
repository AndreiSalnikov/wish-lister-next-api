const passport = require('passport');
const VKontakteStrategy = require('passport-vkontakte').Strategy;

const vkClientID = '51646210';
const vkClientSecret = 'HrhQ2Omv7qVBIgYELFvg';
const vkRedirectURI = 'http://localhost:4200/auth/vk/callback';

passport.use(
  new VKontakteStrategy(
    {
      clientID: vkClientID,
      clientSecret: vkClientSecret,
      callbackURL: vkRedirectURI,
      lang: 'ru',
    },
    (accessToken, refreshToken, params, profile, done) => {
      // Here, you can access the user's VK.com profile information
      // and perform any necessary operations like user authentication or account creation
      // 'profile' object contains the user's VK.com profile data

      // Example:
      const user = {
        vkontakteId: profile.id,
        displayName: profile.displayName,
        // ... add more user data as needed
      };
      // Call the 'done' callback to complete the authentication process
      // Pass 'null' as the first argument to indicate no error, and 'user'
      // as the second argument to provide the
      // authenticated user object
      done(null, user);
    },
  ),
);
