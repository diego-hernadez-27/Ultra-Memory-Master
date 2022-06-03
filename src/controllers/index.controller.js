const indexCtrl = {};

indexCtrl.renderIndex = ('/', (req, res) => {
  res.render('index')
});

indexCtrl.renderMenu = ('/menu', (req, res) => {
  res.render('menu')
});

indexCtrl.renderPerfil = ('/perfil', (req, res) => {
  res.render('perfil')
});

indexCtrl.renderEstresado = ('/estresado', (req, res) => {
  res.render('estresado')
});

indexCtrl.renderTipoDeMemoria = ('/tipodememoria', (req, res) => {
  res.render('tipodememoria')
});

indexCtrl.renderNivelesEcoica = ('/nivelesecoica', (req, res) => {
  res.render('nivelesecoica')
});

indexCtrl.renderNivelesEconica = ('/niveleseconica', (req, res) => {
  res.render('niveleseconica')
});

indexCtrl.renderNivelesMuscular = ('/nivelesmuscular', (req, res) => {
  res.render('nivelesmuscular')
});

module.exports = indexCtrl;
