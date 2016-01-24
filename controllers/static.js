var express = require('express')
var router = require('express').Router()

router.use(express.static(__dirname + '/../'))

router.get('/',function(req,res) {
  res.sendfile('views/app.html')
})

module.exports = router
