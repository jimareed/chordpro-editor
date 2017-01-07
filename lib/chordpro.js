
module.exports = {

  fromString: function(input) {
    title = "";
    artist = "";
    lyrics = [];
    chords = [];
    chorddefinitions = [];
    lineNum = 0;
    sections = [];

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
          lyric = parseLyric(line, lineNum);
          if ((lyric.text.startsWith("Verse")  ||
               lyric.text.startsWith("Intro") ||
               lyric.text.startsWith("Outro") ||
               lyric.text.startsWith("Chorus") ||
               lyric.text.startsWith("Bridge")) && lyric.chords.length == 0) {
            if (sections.length > 0) {
              sections[sections.length-1].end = lineNum-1;
            }
            sections.push({ text:lyric.text , start:lineNum , end:0 });
            lyrics.push("");
          } else {
            lyrics.push(lyric.text);
          }
          lineNum++;
          for (c = 0; c < lyric.chords.length; c++) {
            chords.push(lyric.chords[c]);
          }
        }
      }
    }
    if (sections.length > 0) {
      sections[sections.length-1].end = lineNum-1;
    }

    return { title:title , artist:artist , lyrics:lyrics , chords:chords , chorddefs:chorddefinitions , sections:sections };
  },

  toString: function(song) {
    string = "";

    if (song.title != "") {
      string += "{t:" + song.title + "}\n";
    }
    if (song.artist != "") {
      string += "{st:" + song.artist + "}\n";
    }

    for (i = 0; i < song.chorddefs.length; i++) {
      string += "{define: " + song.chorddefs[i].name +
                " base-fret " + song.chorddefs[i].basefret.toString() +
                " frets ";

      for (f = 0; f < song.chorddefs[i].frets.length; f++) {
        if (song.chorddefs[i].frets[f] < 0) {
          string += "x";
        } else {
          string += song.chorddefs[i].frets[f].toString();
        }
        if (f < 5) {
          string += " ";
        }
      }
      string += "}\n"
    }

    var chordNum = 0;
    var sectionNum = 0;
    for (i = 0; i < song.lyrics.length; i++) {
      if (song.sections.length > 0 && song.lyrics[i].length == 0 && song.sections[sectionNum].start == i) {
        string += song.sections[sectionNum].text + "\n";
        if (sectionNum < song.sections.length-1) {
          sectionNum++;
        }
      } else {
        lastCol = 0;
        while (chordNum < song.chords.length && song.chords[chordNum].line == i) {
          string += song.lyrics[i].substring(lastCol, song.chords[chordNum].col) + "["+ song.chords[chordNum].name + "]";
          lastCol = song.chords[chordNum].col;
          chordNum++;
        }
        string += song.lyrics[i].substring(lastCol, song.lyrics[i].length) + "\n";
      }
    }
    return string;
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

    var hasDefine = defs[0].hasOwnProperty('define');

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
  },

  renameChord: function(song, from, to) {

    for (i = 0; i < song.chords.length; i++) {
      if (song.chords[i].name == from) {
        song.chords[i].name = to;
      }
    }

    for (i = 0; i < song.chorddefs.length; i++) {
      if (song.chorddefs[i].name == from) {
        song.chorddefs[i].name = to;
      }
    }

    return song;
  },

  getSection: function(song, id) {

    section = { title:"" , chords:[] , lyrics:[] };

    if (id >= 0 && id < song.sections.length) {
      section.title = sections[id].text;
    }

    for (li = sections[id].start+1; li <= sections[id].end; li++) {
      section.lyrics.push(song.lyrics[li]);
    }

    for(ci = 0; ci < song.chords.length; ci++) {
      if (song.sections[id].start <= song.chords[ci].line && song.chords[ci].line <= song.sections[id].end) {
        var newChord = { line:song.chords[ci].line , col:song.chords[ci].col , name:song.chords[ci].name };
        newChord.line -= (song.sections[id].start+1);
        section.chords.push(newChord);
      }
    }

    return section;
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
