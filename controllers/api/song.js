var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

var songs = [];

function getId(paramId) {
  i = -1;

  if (paramId != null && !isNaN(paramId)) {
    i = parseInt(paramId);
  }

  return i;
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
  id = getId(req.params.id);

  if (id >= 0 && id < songs.length) {
    res.json(songs[id]);
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
  id = getId(req.params.id);

  if (id >= 0 && id < songs.length) {
    var song = chordpro.addDefs(songs[id], req.body.chorddef, { replace:true });
    song = parseSong(chordpro.toString(song));
    song._id = id.toString();
    songs[id] = song;
  	res.status(200).json(song);
  }
});

module.exports = router
