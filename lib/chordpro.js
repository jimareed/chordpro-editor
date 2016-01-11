
module.exports = {

  fromString: function(input) {
    title = "";
    artist = "";
    lyrics = [];
    chords = [];
    chorddefinitions = [];
    lineNum = 0;

    lines = input.split("\n");

    for (i = 0; i < lines.length; i++) {
      line = lines[i].trim();

      if (isaDirective(line)) {
        directive = parseDirective(line);

        if (directive.name == 'title') {
          title = directive.value;
        }
        if (directive.name == 'subtitle') {
          artist = directive.value;
        }
        if (directive.name == 'define') {
          chorddefinitions.push(parseDefinition(directive.value));
        }
      } else {
        if (i == lines.length-1 && !line) {
          // ignore last line if it's empty
        } else {
          lyric = parseLyric(line, lineNum++);
          lyrics.push(lyric.text);
          for (c = 0; c < lyric.chords.length; c++) {
            chords.push(lyric.chords[c]);
          }
        }
      }
    }

    return { title:title , artist:artist , lyrics:lyrics , chords:chords , chorddefs:chorddefinitions };
  },

  distinctChords: function(song) {
    distinct = [];

    for (i = 0; i < song.chords.length; i++) {
      found = false;
      if (distinct.indexOf(song.chords[i].name) == -1) {
        distinct.push(song.chords[i].name);
      }
    }

    return distinct;
  },

  addDefs: function(song, defs, options) {

    if (defs.length == 0) {
      return song;
    }

    hasDefine = defs[0].hasOwnProperty('define');

    // replace first
    if (options.replace) {
      for (i = 0; i < song.chorddefs.length; i++) {
        for (j = 0; j < defs.length; j++) {
          if (song.chorddefs[i].name == defs[j].name) {
            if (hasDefine) {
              define = defs[i].define.substring(8,defs[j].define.length);
              song.chorddefs[i] = parseDefinition(define);
            } else {
              song.chorddefs[i] = defs[j];
            }
          }
        }
      }
    }

    // then add the rest
    for (i = 0; i < defs.length; i++) {
      if (!hasDefinition(song.chorddefs, defs[i].name)) {
        if (hasDefine) {
          define = defs[i].define.substring(8,defs[i].define.length);
          song.chorddefs.push(parseDefinition(define));
        } else {
          song.chorddefs.push(defs[i]);
        }
      }
    }

    return song;
  },

  setChordSequence: function(song, sequence) {
    newChordDefs = [];

    for (i = 0; i < sequence.length; i++) {
      newChordDefs.push(getDefinition(song.chorddefs, sequence[i]));
    }

    song.chorddefs = newChordDefs;

    return song;
  }

};

function hasDefinition(chorddefs, name) {
  for (d = 0; d < chorddefs.length; d++) {
    if (chorddefs[d].name == name) {
      return true;
    }
  }
  return false;
}

function getDefinition(chorddefs, name) {
  for (d = 0; d < chorddefs.length; d++) {
    if (chorddefs[d].name == name) {
      return chorddefs[d];
    }
  }
  return {};
}

function parseDefinition(definition) {
  name = "";
  basefret = "";
  frets = [0,0,0,0,0,0];

  // {define: Am base-fret 0 frets x 0 2 2 1 0}
  var defineRegEx = /([^}]+)\sbase-fret\s([^}]+)\sfrets\s([^}]+)\s([^}]+)\s([^}]+)\s([^}]+)\s([^}]+)\s([^}]+)/;

  if (defineRegEx.test(definition)) {
    match = defineRegEx.exec(definition);
    name = match[1].trim();
    basefret = parseInt(match[2]);
    for (f = 0; f < frets.length; f++) {
      if (match[3+f] == 'x') {
        frets[f] = -1;
      } else {
        frets[f] = parseInt(match[3+f]);
      }
    }
  }

  return { name:name , basefret:basefret , frets:frets };
}

var directiveRegEx = /{([^}]+):([^}]+)}/;

function isaDirective(line) {
  return directiveRegEx.test(line);
}

function parseDirective(line) {
  var matches = directiveRegEx.exec(line);

  if (matches.length == 3) {
    if (matches[1] == 't') {
      matches[1] = 'title';
    }
    if (matches[1] == 'st') {
      matches[1] = 'subtitle';
    }
    return { name:matches[1] , value:matches[2] }
  }

  return {};
}

function parseLyric(line, lineNum) {

  lyric = "";

  isaChord = false;
  chord = "";
  linechords = [];
  col = 0;

  for (j=0; j < line.length; j++) {
    if (line[j] == '[') {
      isaChord = true;
    } else if (line[j] == ']') {
      isaChord = false;
      linechords.push({ name:chord , line:lineNum , col:col });
      chord = "";
    } else {
      if (isaChord) {
        chord += line[j];
      } else {
        col++;
        lyric += line[j];
      }
    }
  }

  return { text:lyric , chords:linechords };

}
