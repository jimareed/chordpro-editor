var app = angular.module("app", [
  'ngStorage',
  'ngRoute'
]);

var defaultSong = {text:
  "{t:Song Title}\n" +
  "{st:Artist Name}\n" +
  "Verse 1:\n" +
  "Copy [Am]paste a song in [C]ChordPro [E7]format.\n"
};

app.service('service', function($http){

  this.getSong = function(id) {
    if (id == "") {
      return $http.get('/api/song')
    } else {
      return $http.get('/api/song')
    }
  }

  this.updateSong = function(songtext) {
    return $http.post('/api/song',songtext)
  }
  this.updateChord = function(chorddef) {
    return $http.put('/api/song',chorddef)
  }

  this.getFretboard = function() {
    return $http.get('/api/fretboard')
  }
  this.updateFretboard = function(chorddef) {
    return $http.post('/api/fretboard',chorddef)
  }
  this.updatePositionId = function(positionId) {
    return $http.put('/api/fretboard',positionId)
  }

});

app.config(function($routeProvider) {
    $routeProvider
      .when('/', { controller:'controller' , templateUrl:'views/song.html'})
      .when('/chord', { controller:'controller' , templateUrl:'views/chord.html'})
});

app.controller("controller", function($scope, $localStorage, service) {

  $scope.init = function() {

    service.getSong("56a3cab171dc1125d7e90b25")
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

  $scope.filterMutedStrings = function(note) {
      return note.mute;
  }

  $scope.filterExcludeMutedStrings = function(note) {
      return !note.mute;
  }

  $scope.filterBaseFretNotZero = function(chorddef) {
      return chorddef.basefret != 0;
  }

  $scope.updateSong = function() {
    service.updateSong({text:$scope.song.text})
    .success(function(song) {
      $scope.song = song;
    });
  }

  $scope.editChord = function(chordId) {
    var ch = parseInt(chordId);
    if (ch >= 0 && ch < $scope.song.chorddefs.length) {
      service.updateFretboard($scope.song.chorddefs[ch])
      .success(function(fb) {
        $scope.fretboard = fb;
      });
    }
  }

  $scope.selectNote = function(posId) {
    service.updatePositionId({positionId:posId})
    .success(function(fb) {
      $scope.fretboard = fb;
    });
  }

  $scope.updateChord = function() {
    service.updateChord({chorddef:[$scope.fretboard.chorddef]})
    .success(function(song) {
      $scope.song = song;
    });
  }

});
