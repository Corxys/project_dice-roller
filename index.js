// récupération des modules
// express permet de créer des serveurs
// https://expressjs.com/en/api.html
const express = require('express');
// path fournit des utilitaires pour travailler avec les chemins de fichiers et de répertoires
// https://nodejs.org/api/path.html
const path = require('path');
// morgan permet de logger les données envoyées pendant les requêtes
// https://github.com/expressjs/morgan#readme
const logger = require('morgan');
// http-errors permet de créer rapidement des erreurs sur express
// https://github.com/jshttp/http-errors#readme
const createError = require('http-errors');
// cookie-parser facilite la manipulation des cookies
// https://github.com/expressjs/cookie-parser#readme
// const cookieParser = require('cookie-parser');
// (non nécessaire pour ce projet)

// gestion des routes via le router
const indexRouter = require('./app/routes/router');

// création du serveur
const app = express();

// paramétrage d'ejs
app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

// paramétrage de morgan
app.use(logger('dev'));
// initialisation de cookie-parser
// app.use(cookieParser());
// app.use(express.urlencoded({extended: false}));
// fontion middleware liée à express
// https://expressjs.com/fr/api.html
app.use(express.json());

// chemin vers les fichiers statics
app.use(express.static(path.join(__dirname, '/app/public')));

app.use('/', indexRouter);

// récupère l'erreur 404 et renvoie vers le gestionnaire d'erreurs
app.use(function(request, response, next) {
  next(createError(404));
});

// gestionnaire d'erreurs
app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env' === 'development' ? error : {});

  // affiche la page d'erreur
  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;



