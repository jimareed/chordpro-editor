var app = angular.module("app", [
  'ngStorage',
  'ngRoute'
]);

var defaultSong = {text:
  "{t:Song Title}\n" +
  "{st:Artist Name}\n" +
  "Verse 1:\n" +
  "Click on [Am]the pencil to [C]copy/paste a [E]song\n" +
  "in [Am]ChordPro format. [C]Click on a [C]chord [E7]to edit it.\n"
};

app.service('service', function($http){

  this.getSong = function(id) {
    if (!id || id == "") {
      return $http.post('/api/song', defaultSong)
    } else {
      return $http.get('/api/song/' + id)
    }
  }

  this.getSongs = function() {
    return $http.get('/api/song')
  }

  this.updateSong = function(songtext, id) {
    return $http.put('/api/song/' + id, songtext)
  }

  this.updateChord = function(chorddef, id) {
    return $http.put('/api/song/' + id, chorddef)
  }

  this.renameChord = function(name, id, chordid) {
    return $http.put('/api/song/' + id + '/chords/' + chordid, name)
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
      .when('/song/:id', { controller:'controller' , templateUrl:'views/song.html'})
});

app.controller("controller", function($scope, $localStorage, $routeParams, service) {

  $scope.init = function() {

    var id = $routeParams.id;

    service.getSongs()
    .success(function(songs) {
      if (!id || id == "") {
        if (songs != null && songs.length > 0) {
          var length = songs.length - 1;
          id = length.toString();
        }
      }
      service.getSong(id)
      .success(function(song) {
        $scope.song = song;
      });
    });

    service.getFretboard()
    .success(function(fb) {
      $scope.fretboard = fb;
      $scope.newchordname = fb.chorddef.name;
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
    service.updateSong({text:$scope.song.text}, $scope.song._id)
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
    service.updateChord({chorddef:[$scope.fretboard.chorddef]}, $scope.song._id)
    .success(function(song) {
      $scope.song = song;
    });
  }

  $scope.renameChord = function() {
    for (chordid = 0; chordid < $scope.song.chords.length; chordid++) {
      if ($scope.newchordname != "" && $scope.song.chords[chordid].name == $scope.fretboard.chorddef.name) {
        service.renameChord({name:$scope.newchordname}, $scope.song._id, chordid)
        .success(function(song) {
          $scope.song = song;
          $scope.fretboard.chorddef.name = $scope.newchordname;
        });
      }
    }
  }

});
