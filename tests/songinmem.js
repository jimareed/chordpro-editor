var should = require('chai').should();
var Song = require('../lib/songinmem');

describe('#songinmem', function() {

  it("should save a song without error",function(done){
    var song = new Song({
  	   username:"guest",
       title: "title",
       artist: "artist",
       text: "{t:title}"
    })
    should.not.exist(song._id);
    song.save(function(err,theSong) {
      should.not.exist(err);
      should.exist(theSong._id);
      done();
    });
  });

  it("should find a saved song",function(done){
    var song = new Song({
  	   username:"guest2",
       title: "title2",
       artist: "artist2",
       text: "{t:title2}"
    })
    song.save(function(err,theSong) {
      should.exist(theSong._id);
      theSong.findById(theSong._id, function(err2, theSong2) {
        should.not.exist(err2);
        theSong2.title.should.equal("title2");
        done();
      });
    });
  });

  it("should return error finding an invalid id",function(done){
    var song = new Song({
  	   username:"",
       title: "",
       artist: "",
       text: ""
    })
    song.findById(267, function(err, song) {
      should.exist(err);
      done();
    });
  });

  it("should update a song",function(done){
    var song = new Song({
  	   username:"guest2",
       title: "title2",
       artist: "artist2",
       text: "{t:title2}"
    })
    song.save(function(err,theSong) {
      should.exist(theSong._id);
      theSong.findById(theSong._id, function(err2, theSong2) {
        should.not.exist(err2);
        theSong2.title.should.equal("title2");
        theSong2.title = "title3";
        theSong2.save(function(err,theSong) {
          should.exist(theSong._id);
          theSong.findById(theSong._id, function(err2, theSong2) {
            should.not.exist(err2);
            theSong2.title.should.equal("title3");
            done();
          });
        });
      });
    });
  });


});
