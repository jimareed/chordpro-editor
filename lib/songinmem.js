
var songs = [];


// Constructor
function SongInMem(song) {
  // always initialize all instance properties
  this.username = song.username;
  this.title = song.title;
  this.artist = song.artist;
  this.text = song.text;
  this._id = null;
}

// class methods
SongInMem.prototype.save = function(callback) {
  this._id = songs.length;

  songs[this._id] = {
    username:this.username,
    title:this.title,
    artist:this.artist,
    text:this.text,
    _id:this._id
  };

  callback(null,this);
};

SongInMem.prototype.findById = function(songId, callback) {
  this._id = null;
  for (i = 0; i < songs.length; i++) {
    if (songs[i]._id == songId) {
      this.username = songs[i].username;
      this.title = songs[i].title;
      this.artist = songs[i].artist;
      this.text = songs[i].text;
      this._id = songs[i]._id;
    }
  }

  var error = null;

  if (this._id == null) {
    error = true;
  }
  
  callback(error,this);
};

// export the class
module.exports = SongInMem;
