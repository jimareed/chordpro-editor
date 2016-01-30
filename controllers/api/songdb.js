var router = require('express').Router();

var songs = [];

function getId(paramId) {
  i = -1;

  if (paramId != null && !isNaN(paramId)) {
    i = parseInt(paramId);
  }

  return i;
}

router.get('/:id',function(req,res,next) {

  id = getId(req.params.id);

  if (id >= 0 && id < songs.length) {
    res.json(songs[id]);
  }
});

router.post('/',function(req,res,next) {
  var song = { title: "", _id: "0", artist: "", text: "" };

  song.text = req.body.text;
  song.title = req.body.title;
  song.artist = req.body.artist;
  song._id = songs.length.toString();

  songs.push(song);

	res.status(201).json(song)
});

router.put('/:id',function(req,res,next) {
  id = getId(req.params.id);

  if (id >= 0 && id < songs.length) {
    songs[id].text = req.body.text;
    songs[id].title = req.body.title;
    songs[id].artist = req.body.artist;

    res.status(200).json(songs[id]);
  }
});

module.exports = router
