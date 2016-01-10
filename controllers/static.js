var express = require('express')
var router = require('express').Router()

router.use(express.static(__dirname + '/../'))

router.get('/editchord',function(req,res) {
  res.sendfile('views/editchord.html')
})

router.get('/',function(req,res) {
  res.sendfile('views/edit.html')
})

module.exports = router
