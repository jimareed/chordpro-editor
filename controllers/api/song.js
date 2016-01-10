var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

var song = {
        title: "", _id: 1, artist: "",
        lyrics: [],
        input: [],
        chorddefs:[],
        chords: [],
        text: "",
        fretboard:[]
    };

function setSong(newText) {

  song = chordpro.fromString(newText);

  chords = chordpro.distinctChords(song);
  defs = chorddefs.getdefs(chords);
  song = chordpro.addDefs(song, defs);

  for (i = 0; i < song.chorddefs.length; i++) {
    song.chorddefs[i].positions = fretboard.getFingerPositions(song.chorddefs[i]);
  }

  var input = newText.split('\n');

  song.input = input;
  song.text = newText;
  song.fretboard = fretboard.getFretboard({frets:[-1,0,2,2,1,0]});

  return song;
}

router.get('/',function(req,res,next) {
  res.json(song);
});

router.post('/',function(req,res,next) {
	res.status(201).json(setSong(req.body.text))
});

module.exports = router
