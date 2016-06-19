var Song = require('../../models/song')
var router = require('express').Router()

router.get('/',function(req,res,next) {
   Song.find()
    .sort('-date')
    .exec(function(err,songs){
     if(err) { return next(err)}
     res.json(songs)
   })
})

router.get('/:id', function(req, res, next) {
    Song.findById(req.params.id, function(err, song) {
        if (err) {
            console.error(err);
            return next(err);
        }

        if (!song) {
            return res.status(404).send();
        }

        res.status(200).send(song);
    });
});


router.post('/',function(req,res,next){
  var song = new Song( {
	   username:req.body.username,
     title: req.body.title,
     artist: req.body.artist,
     text: req.body.text
  })
  song.save(function(err,song) {
    if (err) { return next(err) }
	  res.status(201).json(song)
  })
})

router.put('/:id',function(req,res,next) {
  Song.findById(req.params.id, function(err, song) {
      if (err) {
          console.error(err);
          return next(err);
      }

      if (!song) {
          return res.status(404).send();
      }

      song.username = req.body.username;
      song.title = req.body.title;
      song.artist = req.body.artist;
      song.text = req.body.text;

      song.save(function(err,song) {
        if (err) { return next(err) }
    	  res.status(200).json(song)
      })
  });
});

module.exports = router
