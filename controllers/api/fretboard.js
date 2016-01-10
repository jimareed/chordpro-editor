var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

var fb = fretboard.getFretboard({frets:[]});

router.get('/',function(req,res,next) {
  res.json(fb);
});

router.post('/',function(req,res,next) {
  fb = fretboard.getFretboard(req.body);
	res.status(201).json(fb);
});

router.put('/',function(req,res,next) {
  fb = fretboard.selectNote(fb, req.body.note);
	res.status(200).json(fb);
});

module.exports = router
