const express = require('express');
const path = require('path');
const logger = require('morgan');
const createError = require('http-errors');

const indexRouter = require('./app/routes/router');

const app = express();

app.set('views', path.join(__dirname, '/app/views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());

app.use(express.static(path.join(__dirname, '/app/public')));

app.use('/', indexRouter);

app.use(function(request, response, next) {
  next(createError(404));
});

app.use(function(error, request, response, next) {
  response.locals.message = error.message;
  response.locals.error = request.app.get('env' === 'development' ? error : {});

  response.status(error.status || 500);
  response.render('error');
});

module.exports = app;



