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

  it("should return lyrics of a larger song",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Have Yourself A Merry Little Christmas}\n" +
      "{st:Frank Sinatra}\n" +
      "[G]Have your[Em]self a[Am] merry littl[D7]e Christmas\n" +
      "[G]Let your [Em]heart be[Am] ligh[D7]t\n" +
      "[G]From now [Em]on, our[Am] troubles will b[D7]e out [B7]of s[E7]igh[A7]t  [D7]\n" +
      "[G]Have your[Em]self a[Am] merry littl[D7]e Christmas\n" +
      "[G]Make the [Em]Yuletide[Am] ga[D7]y\n" +
      "[G]From now [Em]on, our[Am] troubles will b[B7]e mil[Em]es away   [G]\n" +
      "[C]Here were are as in [Bm]olden days\n" +
      "[Am]happy gold[D7]en [Gmaj7]days of yore\n" +
      "[Em]Faithful[F#7] friends who ar[Bm]e dear to us\n" +
      "[D]gather nea[Em]r to us[Am]  o[D7]nce more\n" +
      "[G]Through the [Em]years we[Am] all will b[D7]e together\n" +
      "[G]If the [Em]Fates a[Am]llo[D7]w\n" +
      "[G]Hang a [Em]shining[Am] star upon th[D7]e highe[Em]st bough\n" +
      "[C]And have yoursel[Am]f a merry li[D7]ttle Chri[G]stmas now.\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.lyrics[0].should.equal('Have yourself a merry little Christmas');
        res.body.lyrics.length.should.equal(14);
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

  it("should rename a chord",function(done){
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
      .put('/api/song/' + id + "/chords/0")
      .send({ name:"Am7" })
      .end(function(){
        test
        .get('/api/song/' + id)
        .end(function(err,res) {
          res.body.chorddefs.length.should.equal(4);
          res.body.chorddefs[0].name.should.equal("Am7");
          done();
        })
      })
    })
  });

  it("should get a section",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/song')
    .send({text :
      "{t:Song Title}\n" +
      "{st:Artist Name}\n" +
      "Verse 1\n" +
      "Click on [Am]the pencil to [C]copy/paste a [E]song in [Am]ChordPro format.\n" +
      "[C]Click on a [C]chord [E7]to edit it.\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id + "/sections/0")
      .send()
      .end(function(err,res){
        res.body.title.should.equal("Verse 1");
        done();
      })
    })
  });

  it("should update a section",function(done){

    var TWOVERSESONG =
        "{t:Greensleeves}\n" +
        "{st:Traditional}\n" +
        "Verse 1\n" +
        "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n" +
        "to [Am]cast me off disc[E]ourteously.\n" +
        "For [Am]I have [C]loved you [G]well and [Em]long,\n" +
        "de[Am]lighting [E7]in your [Am]company.\n" +
        "Verse 2\n" +
        "Greensleeves was all my joy,\n" +
        "Greensleeves was my delight\n" +
        "Greensleeves was my heart of gold,\n" +
        "and who but my lady greensleeves.\n";

    var test = request;
    test
    .post('/api/song')
    .send({text :
      TWOVERSESONG
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/song/' + id + "/sections/0")
      .send()
      .end(function(err,res){
        (err == null).should.be.true;
        id = res.body._id;
        test
        .put('/api/song/' + id + "/sections/1")
        .send({section:res.body})
        .end(function(err,res){
          (err == null).should.be.true;
          res.body.chords.length.should.equal(26);
          done();
        })
      })
    })
  });

  it("should update a chord lyric position (column)",function(done){
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
      .put('/api/song/' + id + "/chords/0")
      .send({ col:5 })
      .end(function(){
        test
        .get('/api/song/' + id)
        .end(function(err,res) {
          res.body.chorddefs.length.should.equal(4);
          res.body.chords[0].col.should.equal(5);
          done();
        })
      })
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
      "Verse 1\n" +
      "Click on [Am]the pencil to [C]copy/paste a [E]song\n" +
      "in [Am]ChordPro format.  [C]Click on a chord [E7]to edit it.\n" +
      "Verse 2\n" +
      "Click on a [Am]verse to [C]change chord [D]positions.\n" +
      "Click on the [E]two documents [C]to copy chords from\n" +
      "one verse to [E7]another.\n"
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
