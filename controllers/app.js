var app = angular.module("app", ['ngStorage']);

var defaultSong = {text:
  "{t:Song Title}\n" +
  "{st:Artist Name}\n" +
  "Verse 1:\n" +
  "Copy [Am]paste a song in [C]ChordPro [E7]format.\n"
};

app.service('service', function($http){
  this.getSong = function() {
    return $http.get('/api/song')
  }
  this.updateSong = function(songtext) {
    return $http.post('/api/song',songtext)
  }

  this.getFretboard = function() {
    return $http.get('/api/fretboard')
  }
  this.updateFretboard = function(chorddef) {
    return $http.post('/api/fretboard',chorddef)
  }
  this.updateNote = function(note) {
    return $http.put('/api/fretboard',note)
  }

});

app.controller("controller", function($scope, $localStorage, service) {

  $scope.init = function() {

    service.getSong()
    .success(function(song) {
      if (song.text == '') {
        service.updateSong(defaultSong)
        .success(function(song) {
          $scope.song = song;
        })
      } else {
        $scope.song = song;
      }
    });

    service.getFretboard()
    .success(function(fb) {
      $scope.fretboard = fb;
    });
  }

  $scope.updateSong = function() {
    service.updateSong({text:$scope.song.text})
    .success(function(song) {
      $scope.song = song;
    });
  }

  $scope.test = function(positionId) {
  }

  $scope.selectNote = function(positionId) {
    service.updateNote({note:positionId})
    .success(function(fb) {
      $scope.fretboard = fb;
    });
  }

});
