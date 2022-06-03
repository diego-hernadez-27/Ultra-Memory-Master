const usersCtrl = {};

const jwt = require('jsonwebtoken');

const { SECRET } = process.env;

const passport = require('passport');

const User = require('../models/User');

const Role = require('../models/Role');

const randormstring = require("randomstring");

const nodemailer = require("nodemailer");

const bcrypt = require('bcryptjs');

usersCtrl.renderLoginForm = (req, res) => {
  res.render('./login');
}

usersCtrl.signin = passport.authenticate('local', {
  failureRedirect: '/login',
  successRedirect: '/menu',
  failureFlash: true
})

usersCtrl.register = async (req, res) => {
  //const errors = [];
  const {name, appe, email, username, password, roles} = req.body;
  const score = 0;
  const level = 0;
  /*
  if(errors.length > 0){
    res.render('login', {
      errors
    })
  } else{*/
    const emailUser = await User.findOne({email: email});
    if (emailUser){
      //Poner una alguna alerta de que el usuario esta repetido, ya me dio huevita
      console.log('usuario repetido');
      res.redirect('/login');
    }
    const nameUser = await User.findOne({username: username});
    if (nameUser){
      console.log('usuario repetido');
      res.redirect('/login');
    }else{
    const newUser = new User({name, appe, email, username, password, score, level});
    newUser.password = await newUser.encryptPassword(password);

    if(roles) {
      const foundRoles = await Role.find({name: {$in: roles}});
      newUser.roles = foundRoles.map(role => role._id)
    }else{
      const role = await Role.findOne({name: "user"})
      newUser.roles = [role._id];
    }

    const savedUser = await newUser.save();
    console.log(savedUser)

    /*const token = jwt.sign({id: savedUser._id}, `${SECRET}`, {
      expiresIn: 86400
    })

    console.log({token});*/

    //Escribir un mensaje de registro satisfactorio, porfas de usuario
    console.log('registro satisfactorio');
    res.redirect('/login');
    }
}

usersCtrl.logout = (req, res) => {
  req.logout();
  console.log('Se cerro la sesión');
  res.redirect('/login');
}

usersCtrl.renderRegisterAdmin = ('/registeradmin', (req, res) => {
  res.render('registeradmin')
});

usersCtrl.adminregister = async (req, res) => {
  console.log("holaaaa")
  const {email, username, password, roles} = req.body;

    const emailUser = await User.findOne({email: email});
    if (emailUser){
      //Poner una alguna alerta de que el usuario esta repetido, ya me dio huevita
      console.log('usuario repetido');
      res.redirect('/registeradmin');
    }
    const nameUser = await User.findOne({username: username});
    if (nameUser){
      console.log('usuario repetido');
      res.redirect('/registeradmin');
    }else{

    const newUser = new User({username, email, password});
    newUser.password = await newUser.encryptPassword(password);

    const role = await Role.findOne({name: "admin"})
    newUser.roles = [role._id];

    const savedUser = await newUser.save();
    console.log(savedUser)

    const token = jwt.sign({id: savedUser._id}, `${SECRET}`, {
      expiresIn: 86400
    })

    console.log({token});

    //Escribir un mensaje de registro satisfactorio, porfas de usuario
    console.log('registro satisfactorio');
    res.redirect('/login');
  }
}

//for reset password enviar correo de reset
const SendResetPasswordMail = async (name, email, token) => {
  try {
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth:{
        user:'npcusuario12@gmail.com ',
        pass:'npcusuario12345678'
      }
    })

    const mailOptions = {
      from: 'memorymaster@gmail.com',
      to: email,
      subject: 'Para resetear',
      html: '<p>Hola '+name+', por favor da click aquí <a href="http://localhost:4000/forget-password?token='+token+'"> Reset </a> your password.</p>'
    }
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log("Email has been sent", info.response);
      }
    })
  } catch (error) {
    console.log(error.message);
  }
}

usersCtrl.renderTabUser = ('/tablausers', (req, res) => {
  res.render('tablausers')
});

usersCtrl.renderEditPerfil = ('/editarperfil', (req, res) => {
  res.render('editarperfil')
});

usersCtrl.actualizar = async (req, res) => {

  const {name, appe, email, username, id} = req.body;

  User.findByIdAndUpdate(id, {name, appe, email, username}, (error, user) =>{
    if(error){
        return res.redirect('/editarperfil')
    }
    res.redirect('/perfil')
  });




  /*const savedUser = await updateUser.save();
  console.log(savedUser)

  //Escribir un mensaje de registro satisfactorio, porfas de usuario
  console.log('actualización satisfactoria');
  res.redirect('/perfil');*/

}

  //forget password
  usersCtrl.forgetLoad = async (req, res) => {
    try {
      res.render('forget');
    } catch (error) {
      console.log(error.message);
    }
  }
  //verifica que su correo exista
  usersCtrl.forgetVerify = async (req, res) => {
    try {
      const email = req.body.email;
      const userData = await User.findOne({email: email});
  
      if(userData){
        const randomString = randormstring.generate();
        const updateData = await User.updateOne({email: email}, {$set:{token: randomString}});
        SendResetPasswordMail(userData.name, userData.email, randomString);
        res.render('forget', {message:"Por favor checa tu email"});
      }else{
        res.render('forget', {message: "User email is incorrect"});
      }
  
    } catch (error) {
      console.log(error.message);
    }
  }
  //cuando el token es invalido en la pagina
  usersCtrl.forgetPasswordLoad = async (req, res) => {
    try {
      const token = req.query.token;
      const tokenData = await User.findOne({token: token});
      if (tokenData) {
        res.render('forget-password', {user_id: tokenData._id});
      } else {
        res.render('404', {message: "Token is invalid."});
      }
    } catch (error) {
      console.log(erro.message)
    }
  }
  //Para poder encriptar la contraseña
  const securePassword = async(password) => {
    try {
      const passwordHash = await bcrypt.hash(password, 10);
      return passwordHash;
    } catch (error) {
      console.log(error.message);
    }
  }
  //Aquí reseteo la contraseña
  usersCtrl.resetPassword = async (req, res) => {
    try {
      const password = req.body.password;
      const user_id = req.body.user_id;
      const secure_password = await securePassword(password);
      const updateData = await User.findByIdAndUpdate({ _id: user_id }, {$set: {password: secure_password, token:''} });
      res.redirect("/login")
    } catch (error) {
      console.log(error.message);
    }
  }

  usersCtrl.findUser = async (req, res) => {
    const role = await Role.findOne({name: "user"})
    const roleusers = [role._id];
  
    const usuarios = await User.find({roles:roleusers});
    res.render('tablausers', { usuarios });
  }
  
  usersCtrl.edituser = (req,res)=>{
    const id = req.body.id_editar
    const name = req.body.nombre_editar
    const appe = req.body.apellido_editar
    const username = req.body.usuario_editar
    const email = req.body.edad_editar
    User.findByIdAndUpdate(id, {name, appe, email, username}, (error, usuario)=>{
        if(error){
            return res.status(500).json({
                message: 'Error actualizando al Usuario'
            })
        }
        res.redirect('/findUser')
    })
}
  
  usersCtrl.deleteuser = (req, res) =>{
    const id = req.params.id
      User.findByIdAndRemove(id, (error, usuario)=>{
        if(error){
            return res.status(500).json({
                  message: 'Error eliminando al Usuario'
            })
        }
        res.redirect('/findUser')
      })
  }
module.exports = usersCtrl;
