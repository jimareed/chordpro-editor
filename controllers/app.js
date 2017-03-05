var app = angular.module("app", [
  'ngStorage',
  'ngRoute'
]);

var defaultSong = {text:
  "{t:Song Title}\n" +
  "{st:Artist Name}\n" +
  "Verse 1\n" +
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

  this.moveChord = function(col, id, chordid) {
    return $http.put('/api/song/' + id + '/chords/' + chordid, col)
  }

  this.getSection = function(id, sectionid) {
    return $http.get('/api/song/' + id + '/sections/' + sectionid)
  }

  this.updateSection = function(id, section, sectionid) {
    return $http.put('/api/song/' + id + '/sections/' + sectionid, section)
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
      .when('/songs/:id/sections/:sectionid', { controller:'controller' , templateUrl:'views/section.html'})
      .when('/songs/:id/chordpro', { controller:'controller' , templateUrl:'views/chordpro.html'})
      .when('/songs/:id/copychords', { controller:'controller' , templateUrl:'views/copychords.html'})
      .when('/songs/:id', { controller:'controller' , templateUrl:'views/song.html'})
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

  $scope.initSection = function() {

    var id = $routeParams.id;
    var sectionid = $routeParams.sectionid;

    service.getSection(id, sectionid)
    .success(function(section) {
      $scope.section = section;
      $scope.sectionid = sectionid;
      if ($scope.section.chords.length > 0) {
        $scope.from = $scope.section.chords[0];
        $scope.to = $scope.section.chords[0];
      }
    });
    service.getSong(id)
    .success(function(song) {
      $scope.song = song;
    });
  }

  $scope.changeSectionChord = function(chordId) {

    var ch = parseInt(chordId);

    $scope.from = $scope.section.chords[ch];
    $scope.to = $scope.section.chords[ch];
    $scope.confirmMoveChord();
  }

  $scope.moveChordRight = function() {

    $scope.to.col += 1;
    $scope.confirmMoveChord();
  }

  $scope.moveChordLeft = function() {

    $scope.to.col -= 1;
    $scope.confirmMoveChord();
  }

  $scope.updateSection = function() {
    service.updateSection($scope.section._id, {section:$scope.section}, $scope.sectionid)
    .success(function(song) {
      $scope.song = song;
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

  $scope.editSection = function(sectionid) {
    if (id >= 0 && id < $scope.song.chorddefs.length) {
      service.getSection($scope.song._id, sectionid)
      .success(function(section) {
        $scope.section = section;
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

  $scope.confirmMoveChord = function() {
    console.log("confirmMoveChord");
    for (chordid = 0; chordid < $scope.song.chords.length; chordid++) {
      if ($scope.song.chords[chordid].name == $scope.from.name && $scope.song.chords[chordid].line == ($scope.from.line + $scope.song.sections[$scope.sectionid].start + 1) && $scope.song.chords[chordid].col == $scope.from.col) {
        console.log("move chord!!!!!");
        service.moveChord({ col:$scope.to.col }, $scope.song._id, chordid)
        .success(function(song) {
          $scope.song = song;
        });
      }
    }
  }

});
