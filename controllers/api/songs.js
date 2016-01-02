var chordpro = require('../../lib/chordpro');
var chorddefs = require('../../lib/chorddefs');
var fretboard = require('../../lib/fretboard');
var router = require('express').Router();

router.get('/',function(req,res,next) {
  song = chordpro.fromString(
    "{t:Greensleeves}\n" +
    "{st:Traditional}\n" +
    "{define: Am base-fret 0 frets x 0 2 2 1 0}\n" +
    "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n" +
    "to [Am]cast me off disc[E]ourteously.\n" +
    "For [Am]I have [C]loved you [G]well and [Em]long,\n" +
    "de[Am]lighting [E7]in your [Am]company.\n" +
    "[C]Greensleeves was [G]all my [Em]joy,\n" +
    "[Am]Greensleeves was [E]my delight\n" +
    "[C]Greensleeves was my [G]heart of [Em]gold,\n" +
    "and [Am]who but my [E7]lady [Am]greensleeves.\n"
  );

  chords = chordpro.distinctChords(song);
  defs = chorddefs.getdefs(chords);
//  song = chordpro.addDefs(song, defs);

  for (i = 0; i < song.chorddefs.length; i++) {
    song.chorddefs[i].positions = fretboard.getFingerPositions(song.chorddefs[i]);
  }

  song.input = [
    "{t:Greensleeves}",
    "{st:Traditional}",
    "{define: Am base-fret 0 frets x 0 2 2 1 0}",
    "A[Am]las, my [C]love, you [G]do me [Em]wrong,",
    "to [Am]cast me off disc[E]ourteously.",
    "For [Am]I have [C]loved you [G]well and [Em]long,",
    "de[Am]lighting [E7]in your [Am]company.",
    "[C]Greensleeves was [G]all my [Em]joy,",
    "[Am]Greensleeves was [E]my delight",
    "[C]Greensleeves was my [G]heart of [Em]gold,",
    "and [Am]who but my [E7]lady [Am]greensleeves."
  ];
  res.json(song);
});

router.post('/',function(req,res,next) {
	res.status(201).json([])
});

module.exports = router
