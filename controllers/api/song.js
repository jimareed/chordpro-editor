var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

var song = {
        title: "", _id: 1, artist: "",
        lyrics: [],
        chorddefs:[],
        chords: [],
        text: ""
    };

function setSong(newText) {

  song = chordpro.fromString(newText);

  chords = chordpro.distinctChords(song);
  defs = chorddefs.getdefs(chords);
  song = chordpro.addDefs(song, defs, { replace:false });

  for (s = 0; s < song.chorddefs.length; s++) {
    song.chorddefs[s].positions = fretboard.getFingerPositions(song.chorddefs[s]);
  }

  song.text = chordpro.toString(song);

  return song;
}

router.get('/',function(req,res,next) {
  res.json(song);
});

router.post('/',function(req,res,next) {
	res.status(201).json(setSong(req.body.text))
});

router.put('/',function(req,res,next) {
  song = chordpro.addDefs(song, req.body.chorddef, { replace:true });
  setSong(chordpro.toString(song));
	res.status(200).json(song);
});

module.exports = router
