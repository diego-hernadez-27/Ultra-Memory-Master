const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const jwt = require('jsonwebtoken');
const { SECRET } = process.env;
const storage = require('node-sessionstorage')

const User = require('../models/User');

passport.use(new LocalStrategy({
  usernameField: 'username',
  passewordField: 'password'
}, async (username, password, done, res) => {

  //Confirmar si coinciden los nombres de usuario
  const user = await User.findOne({username})
  if (!user) {
    return done(null, false, { message: 'Not User Found'});
  } else{
    //Coincidencia de contraseña
    const match = await user.matchPassword(password);
    if(match) {
      const token = jwt.sign({id: user._id}, `${SECRET}`, {expiresIn: 86400})

      console.log({token})

      storage.setItem("token", token)

      //console.log(storage.getItem("token"))

      return done(null, user);
    }else{
      return done(null, false, { message: 'Incorrect Password' });
    }
  }

}));


passport.serializeUser((user, done) =>{
  done(null, user.id);
});

passport.deserializeUser((id, done) =>{
  User.findById(id, (err, user) =>{
    done(err, user);
  })
});