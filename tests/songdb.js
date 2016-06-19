var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');
var chordpro = require('../lib/chordpro');

describe('#songdb', function() {

  it("should return id when you add a song",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/songdb')
    .send({username:"testuser" , title:"the song" , artist:"the artist" , text:"{t:song}"})
    .end(function(err,res){
      (err == null).should.be.true;
      res.status.should.equal(201);
      res.body._id.should.not.equal('');
      done();
    });
  });

  it("should set the title",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/songdb')
    .send({username:"testuser" ,  title:"the song" , artist:"the artist" ,
      text:
        "{t:the song}\n" +
        "{st:the artist}\n" +
        "A[Am]las, my [C]love, you [G]do me [Em]wrong,\n" +
        "to [Am]cast me off disc[E]ourteously.\n"
    })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .get('/api/songdb/' + id)
      .end(function(err,res){
        (err == null).should.be.true;
        res.body.title.should.equal('the song');
        done();
      });
    });
  });

  it("should update the song",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/songdb')
    .send({ title:"the song" , artist:"the artist" , text:"{t:the song}" })
    .end(function(err,res){
      (err == null).should.be.true;
      id = res.body._id;
      test
      .put('/api/songdb/' + id)
      .send({ title:"updated song" , artist:"updated artist" , text:"{t:updated song}" })
      .end(function(err,res){
        (err == null).should.be.true;
        test
        .get('/api/songdb/' + id)
        .end(function(err,res){
          (err == null).should.be.true;
          res.body.title.should.equal('updated song');
          done();
        });
      });
    });
  });

});
