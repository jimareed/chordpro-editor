var app = angular.module("app", ['ngStorage']);

var defaultSong = {text:
  "{t:Song Title}\n" +
  "{st:Artist Name}\n" +
  "Verse 1:\n" +
  "Copy [Am]paste a song in [C]ChordPro [E7]format.\n"
};

app.service('service', function($http){
  this.fetch = function() {
    return $http.get('/api/song')
  }
  this.update = function(songtext) {
    return $http.post('/api/song',songtext)
  }
});

app.controller("controller", function($scope, $localStorage, service) {

  $scope.init = function() {

    service.fetch()
    .success(function(song) {
      if (song.text == '') {
        service.update(defaultSong)
        .success(function(song) {
          $scope.song = song;
        })
      } else {
        $scope.song = song;
        $localStorage.song = song;
      }
    });
  }

  $scope.updateSong = function() {
    service.update({text:$scope.song.text})
    .success(function(song) {
      $scope.song = song;
      $localStorage.song = song;
    });
  }
});
