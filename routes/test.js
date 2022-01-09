const express = require('express');
var router = express.Router();
    
router.get('/getItem', function (req, res, next) {
    console.log("Router Working");
    res.end();
})
module.exports = router;
