var router = require('express').Router();

var song = {
        title: "song", _id: "", artist: "artist",
        text: "hello"
    };

router.get('/',function(req,res,next) {
  res.json(song);
});

router.post('/',function(req,res,next) {
  song.text = req.body.text;
	res.status(201).json(song)
});

router.put('/',function(req,res,next) {
	res.status(200).json(song);
});

module.exports = router
