


module.exports = {

  getFingerPositions: function(def) {

    frets = def.frets;

    positions = [];

    for (i = 0; i < frets.length; i++) {
      if (frets[i] > 0) {
        position = note2position({ string:i , fret:frets[i]});

        positions.push({ cx:position.cx , cy:position.cy });
      }
    }
    return positions;
  },

  getFretboard: function(def) {

    positions = [];

    for (f = 0; f < 5; f++) {
      for (s = 0; s < 6; s++) {
        position = note2position({ string:s , fret:f});

        positions.push({ string:s , fret:f , cx:position.cx , cy:position.cy , selected:"0.05"});
      }
    }

    frets = def.frets;

    for (p = 0; p < positions.length; p++) {
      for (i = 0; i < frets.length; i++) {
        if (positions[p].string == i && frets[i] > 0 && positions[p].fret == frets[i]) {
          positions[p].selected = "1.0";
        }
      }
    }

    return { positions:positions , chorddef:def };
  },

  selectNote: function(fretboard, position) {
    var pos = parseInt(position);
    if (pos < 0 || pos >= fretboard.positions.length) {
      return fretboard;
    }

    ps = getStringPositions(pos);

    for (i = 0; i < ps.length; i++) {
      fretboard.positions[ps[i]].selected = "0.05";
    }

    fretboard.positions[pos].selected = "1.0";

    return fretboard;
  }

};

function getStringPositions(pos) {
  ps = [];
  string = pos % 6;

  for (n = string; n < 30; n += 6) {
    ps.push(n);
  }

  return ps;
}

function note2position(note) {
  position = { cx:0 , cy:0 };

  if ((note.string+1) % 2 == 0) {
    position.cx = 15 * (note.string+1) / 2;
  } else {
    position.cx = 15 * note.string / 2 + 7;
  }
  if (note.fret == 0) {
    position.cy = 4;
  }
  if (note.fret == 1) {
    position.cy = 11;
  }
  if (note.fret == 2) {
    position.cy = 18;
  }
  if (note.fret == 3) {
    position.cy = 26;
  }
  if (note.fret == 4) {
    position.cy = 33;
  }

  if (position.cy == 0) {
    position.cx
  }
  return position;
}
