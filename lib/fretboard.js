

module.exports = {

  getFingerPositions: function(def) {

    frets = def.frets;

    positions = [];

    for (i = 0; i < frets.length; i++) {
      if (frets[i] == -1) { // muted string
        position = note2position({ string:i , fret:0 });
        positions.push({ cx:position.cx , cy:position.cy , selected:"1.0" , opacity:"0.0" , mute:true });        
      }
      if (frets[i] > 0) {
        position = note2position({ string:i , fret:frets[i]});

        positions.push({ cx:position.cx , cy:position.cy , selected:"1.0" , opacity:"1.0" , mute:false });
      }
    }
    return positions;
  },

  getFretboard: function(def) {

    positions = [];

    for (f = 0; f < 5; f++) {
      for (s = 0; s < 6; s++) {
        position = note2position({ string:s , fret:f});

        positions.push({ string:s , fret:f , cx:position.cx , cy:position.cy , selected:"0.0" , opacity:"0.0" , mute:false });
      }
    }

    frets = def.frets;

    for (p = 0; p < positions.length; p++) {
      for (i = 0; i < frets.length; i++) {
        if (positions[p].string == i && frets[i] > 0 && positions[p].fret == frets[i]) {
          positions[p].selected = "1.0";
          positions[p].opacity = "1.0";
        }
      }
    }

    return { positions:positions , chorddef:def };
  },

  selectPositionId: function(fretboard, positionId) {
    var pid = parseInt(positionId);
    if (pid < 0 || pid >= fretboard.positions.length) {
      return fretboard;
    }

    var isSelected = fretboard.positions[pid].selected == "1.0";

    ps = getStringPositionIds(pid);

    for (i = 0; i < ps.length; i++) {
      fretboard.positions[ps[i]].selected = "0.0";
      fretboard.positions[ps[i]].opacity = "0.0";
    }

    if (!isSelected) {
      fretboard.positions[pid].selected = "1.0";
      fretboard.positions[pid].opacity = "1.0";
    }

    note = positionId2note(pid);

    if (isSelected) {
      fretboard.chorddef.frets[note.string] = 0;
    } else {
      fretboard.chorddef.frets[note.string] = note.fret;
    }

    return fretboard;
  }

};

function positionId2note(pid) {
  string = pid % 6;
  fret = Math.floor(pid / 6);

  return { string:string , fret:fret };
}

function getStringPositionIds(pid) {
  ps = [];
  string = pid % 6;

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
