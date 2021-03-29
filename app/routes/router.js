const express = require('express');
const router = express.Router();

router.get('/', function(request, response, next) {
  response.render('index');
});

module.exports = router;