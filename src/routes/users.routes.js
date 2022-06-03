const { Router } = require('express');
const router = Router();

const { renderLoginForm, signin, register, logout, renderRegisterAdmin, adminregister,
        renderTabUser, renderEditPerfil, actualizar, forgetLoad, forgetVerify, forgetPasswordLoad, resetPassword, findUser, edituser, deleteuser } = require('../controllers/users.cotroller.js')

const { isnotAuthenticated, isAuthenticated, verifyToken, isAdmin } = require('../helpers/auth');

router.get('/login', isnotAuthenticated, renderLoginForm);

router.post('/signin', isnotAuthenticated, signin);

router.post('/register', isnotAuthenticated, register);

router.get('/logout', isAuthenticated, logout);

router.get('/registeradmin', isnotAuthenticated, renderRegisterAdmin);

router.post('/adminregister', isnotAuthenticated, adminregister);

router.get('/tablausers', isAuthenticated, renderTabUser);

router.get('/editarperfil', isAuthenticated, renderEditPerfil);

router.post('/actualizar', isAuthenticated, actualizar);

router.get('/forget', isnotAuthenticated, forgetLoad);//desde aquí

router.post('/forget', isnotAuthenticated, forgetVerify);

router.get('/forget-password', isnotAuthenticated, forgetPasswordLoad);

router.post('/forget-password',isnotAuthenticated, resetPassword);

router.get('/findUser',isAuthenticated, findUser);

router.post('/edituser',isAuthenticated, edituser);

router.get('/deleteuser/:id', isAuthenticated, deleteuser);

module.exports = router;
