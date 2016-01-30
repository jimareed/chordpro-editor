var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

var songs = [];

function getSong(paramId) {
  i = -1;

  if (paramId != null && !isNaN(paramId)) {
    i = parseInt(paramId);
  }

  if (i >= 0 && i < songs.length) {
    return songs[i];
  }

  return null;
}

function parseSong(newText) {
  var song = {
          title: "", _id: "", artist: "",
          lyrics: [],
          chorddefs:[],
          chords: [],
          text: ""
      };

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

router.get('/:id',function(req,res,next) {
  var song = getSong(req.params.id);

  if (song != null) {
    res.json(song);
  }
});

router.get('/',function(req,res,next) {
  res.json(songs);
});

router.post('/',function(req,res,next) {
  var song = parseSong(req.body.text);
  song._id = songs.length.toString();
  songs.push(song);
	res.status(201).json(songs[songs.length-1]);
});

router.put('/:id',function(req,res,next) {
  var song = getSong(req.params.id);

  if (song != null) {
    var id = parseInt(song._id);
    song = chordpro.addDefs(song, req.body.chorddef, { replace:true });
    song = parseSong(chordpro.toString(song));
    song._id = req.params.id;
    songs[id] = song;
  	res.status(200).json(song);
  }
});

module.exports = router
