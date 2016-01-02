

module.exports = {

  getFingerPositions: function(def) {

    frets = def.frets;

    positions = [];

    for (i = 0; i < frets.length; i++) {
      if (frets[i] > 0) {
        cx = 0;
        cy = 0;

        if ((i+1) % 2 == 0) {
          cx = 15 * (i+1) / 2;
        } else {
          cx = 15 * i / 2 + 7;
        }
        if (frets[i] == 1) {
          cy = 11;
        }
        if (frets[i] == 2) {
          cy = 18;
        }
        if (frets[i] == 3) {
          cy = 26;
        }
        if (frets[i] == 4) {
          cy = 33;
        }

        positions.push({ cx:cx , cy:cy });
      }
    }
    return positions;
  }

};
