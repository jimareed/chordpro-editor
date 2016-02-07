var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');
var chordpro = require('../lib/chordpro');

describe('#restsongdb', function() {

  it("should return an id when you add a song",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/songdb')
    .send({text : "{t:song}"})
    .end(function(err,res){
      (err == null).should.be.true;
      res.body._id.should.not.equal('');
      done();
    });
  });

  it("should set the title",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/songdb')
    .send({ title:"the song" , artist:"the artist" , text:"{t:the song}" })
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
