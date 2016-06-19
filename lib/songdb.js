var songs = [];


module.exports = {


  get: function(songid) {

    var id = getId(songid);

    if (id >= 0 && id < songs.length) {
      return (songs[id]);
    }

    return null;
  },

  add: function(username, title, artist, text) {

    var song = { title: "", _id: "0", artist: "", text: "" };

    song.text = text;
    song.title = title;
    song.artist = artist;
    song._id = songs.length.toString();

    songs.push(song);

    return song;
  },

  update: function(songid, title, artist, text) {

    var id = getId(songid);

    if (id >= 0 && id < songs.length) {
      songs[id].text = text;
      songs[id].title = title;
      songs[id].artist = artist;

      return songs[id];
    }

    return null;
  }

};

function getId(paramId) {
  i = -1;

  if (paramId != null && !isNaN(paramId)) {
    i = parseInt(paramId);
  }

  return i;
}
