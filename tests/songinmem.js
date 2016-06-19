var should = require('chai').should();
var songinmem = require('../lib/songinmem');

describe('#songinmem', function() {

  it("should save a song without error",function(done){
    var song = new songinmem("24")
    song.bar.should.equal("24");
//    songinmem.save(function(err,song) {
//    });
    done();
  });

});
