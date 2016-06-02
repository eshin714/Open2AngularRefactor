var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  console.log("This is the Main Page!");

})

module.exports = router;