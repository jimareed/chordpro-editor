var should = require('chai').should();
var songdb = require('../lib/songdb');

describe('#songdblib', function() {

  it("should return an id when you add a song",function(done){
    //calling ADD api
    var song = songdb.add("", "song", "", "{t:song}");
    song._id.should.not.equal('');
    done();
  });

  it("should set the title",function(done){
    //calling ADD api
    var song = songdb.add("", "the song", "the artist", "{t:the song}");
    song._id.should.not.equal('');

    var song2 = songdb.get(song._id);
    song2.should.not.equal(null);

    song2.title.should.equal("the song");
    done();
  });

/*
  it("should update the song",function(done){
    var song = songdb.add("the song", "the artist", "{t:the song}");
    song._id.should.not.equal('');

    song2 = songdb.update(song._id, "updated song", "updated artist", "{t:updated song}");

    var song3 = songdb.get(song._id);
    song3.should.not.equal(null);

    song3.title.should.equal("updated song");
    done();
  });
*/

});
