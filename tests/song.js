var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');
var chordpro = require('../lib/chordpro');

describe('#song', function() {
  it("should return title",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text : "{t:song}"})
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.title.should.equal('song');
        done();
      });
    });
  });

  it("should return artist",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text : "{st:a band}"})
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.artist.should.equal('a band');
        done();
      });
    });
  });

  it("should return lyrics",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Greensleeves}\n" +
      "{st:Traditional}\n" +
      "{define: Am base-fret 0 frets x 0 2 2 1 0}\n" +
      "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n" +
      "to [Am]cast me off disc[E]ourteously.\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.lyrics[0].should.equal('Alas, my love, you do me wrong,');
        done();
      });
    });
  });

  it("should update chord defs",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Greensleeves}\n" +
      "{st:Traditional}\n" +
      "{define: Am base-fret 0 frets x 0 2 2 1 0}\n" +
      "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .put('/api/song/' + id)
      .send({chorddef:[{ name:"Am" , basefret:"0" , frets:[5,7,7,5,5,5] }]})
      .end(function(){
        test
        .get('/api/song/' + id)
        .end(function(err,res) {
          res.body.chorddefs.length.should.equal(4);
          res.body.chorddefs[0].name.should.equal("Am");
          res.body.chorddefs[0].frets[2].should.equal(7);
          done();
        })
      })
    })
  });

  it("should get songs by id",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Greensleeves}\n" +
      "{st:Traditional}\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.title.should.equal('Greensleeves');
        done();
      });
    });
  });

  it("should do something awesome",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Greensleeves}\n" +
      "{st:Traditional}\n" +
      "{define: Am base-fret 0 frets x 0 2 2 1 0}\n" +
      "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res) {
        res.body.chorddefs.length.should.equal(4);
        res.body.chorddefs[0].name.should.equal("Am");
        done();
      })
    })
  });

  it("should return a list of songs",function(done){
    //calling ADD api
    var test = request;
    test
    .get('/api/song')
    .end(function(err,res) {
      res.body.length.should.be.above(0);
      res.body[0]._id.should.equal("0");
      done();
    })
  });

  it("should end test with instructions",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Song Title}\n" +
      "{st:Artist Name}\n" +
      "Verse 1:\n" +
      "Click on [Am]the pencil to [C]copy/paste a [E]song in [Am]ChordPro format.\n" +
      "[C]Click on a [C]chord [E7]to edit it.\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res) {
        res.body.chorddefs.length.should.equal(5);
        done();
      })
    })
  });


});
