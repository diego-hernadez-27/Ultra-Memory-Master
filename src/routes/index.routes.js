const { Router } = require('express');
const router = Router();

const { renderIndex, renderMenu, renderPerfil, renderEstresado, renderTipoDeMemoria, renderNivelesEcoica,
renderNivelesEconica, renderNivelesMuscular} = require('../controllers/index.controller')

const { isAuthenticated, isnotAuthenticated, verifyToken, isAdmin } = require('../helpers/auth');

router.get('/', isnotAuthenticated, renderIndex);

router.get('/menu', [isAuthenticated, verifyToken, isAdmin], renderMenu);

router.get('/perfil', [isAuthenticated, verifyToken, isAdmin], renderPerfil);

router.get('/estresado',[isAuthenticated, verifyToken, isAdmin],  renderEstresado);

router.get('/tipodememoria', [isAuthenticated, verifyToken, isAdmin], renderTipoDeMemoria);

router.get('/nivelesecoica', [isAuthenticated, verifyToken, isAdmin], renderNivelesEcoica);

router.get('/niveleseconica', [isAuthenticated, verifyToken, isAdmin], renderNivelesEconica);

router.get('/nivelesmuscular', [isAuthenticated, verifyToken, isAdmin], renderNivelesMuscular);

module.exports = router;
