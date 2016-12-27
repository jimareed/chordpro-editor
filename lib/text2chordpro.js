

module.exports = {

  isChordpro: function(input) {

    return hasCurlyBraces(input);
  },

  fromText: function(input) {
    title = "";
    artist = "";
    body = "";
    output = "";

    lines = input.split("\n");

    if (lines.length >= 1) {
      output += "{t:" + lines[0].trim() + "}\n";
    }
    if (lines.length >= 2) {
      output += "{st:" + lines[1].trim() + "}\n";
    }

    chordLine = "";
    for (i = 2; i < lines.length; i++) {
      if (isAChordLine(lines[i])) {
        chordLine = lines[i].trim();
      } else {
        output += mergeLine(chordLine, lines[i].trim()) + "\n";
        chordLine = "";
      }
    }

    return output;
  }
};

function isAChord(word) {
  result = false;

  if (word.length > 0 && word[0] >= 'A' && word[0] <= 'G') {
    result = true;
  }

  return result;
}

function isAChordLine(line) {
  isChord = true;

  words = line.split(" ");

  if (words.length == 0) {
    isChord = false;
  }

  for (j = 0; j < words.length; j++) {
    if (words[j].trim().length > 0 && !isAChord(words[j])) {
      isChord = false;
    }
  }

  return isChord;
}

function mergeLine(chordLine, lyricsLine) {
  mergedLine = "";
  chordLineIndex = 0;
  if (chordLine.length == 0) {
    mergedLine = lyricsLine;
  } else {
    maxLength = lyricsLine.length;
    if (chordLine.length > maxLength) {
      maxLength = chordLine.length;
    }
    for (k = 0; k < lyricsLine.length; k++) {
      if (chordLineIndex < chordLine.length) {
        if (chordLine[chordLineIndex] != ' ') {
          mergedLine += "[";
          while (chordLineIndex < chordLine.length && chordLine[chordLineIndex] != ' ') {
            mergedLine += chordLine[chordLineIndex];
            chordLineIndex++;
          }
          mergedLine += "]";
        } else {
          chordLineIndex++;
        }
      }
      if (k < lyricsLine.length) {
        mergedLine += lyricsLine[k];
      }
    }
  }

  while (chordLineIndex < chordLine.length) {
    if (chordLine[chordLineIndex] != ' ') {
      mergedLine += "[";
      while (chordLineIndex < chordLine.length && chordLine[chordLineIndex] != ' ') {
        mergedLine += chordLine[chordLineIndex];
        chordLineIndex++;
      }
      mergedLine += "]";
    } else {
      mergedLine += " ";
      chordLineIndex++;
    }
  }

  return mergedLine;
}

function hasCurlyBraces(input) {
  result = false;

  if (input.indexOf("{") >= 0 && input.indexOf("}") >= 0) {
    result = true;
  }

  return result;
}
