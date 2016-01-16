var should = require('chai').should();
var request = require('supertest')('http://localhost:3000');

describe('#fretboard', function() {
  it("should select chord notes",function(done){
    //calling ADD api
    var test = request;
    test
    .post('/api/fretboard')
    .send({frets:[0,0,2,2,1,0]})
    .end(function(){
      test
      .get('/api/fretboard').
      end(function(err,res){
        (err == null).should.be.true;
        res.body.positions[9].selected.should.equal("0.0");
        res.body.positions[10].selected.should.equal("1.0");
        res.body.positions[11].selected.should.equal("0.0");
        done();
      });
    });
  });

  it("should update chord",function(done){
    //calling ADD api
    var test = request;
    test
    .put('/api/fretboard')
    .send({positionId:"16"})
    .end(function(){
      test
      .get('/api/fretboard').
      end(function(err,res){
        (err == null).should.be.true;
        res.body.positions[16].selected.should.equal("1.0");
        done();
      });
    });
  });

});
