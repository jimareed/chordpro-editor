var app = angular.module("app", []);

app.service('service', function($http){
  this.fetch = function() {
    return $http.get('/api/songs')
  }
  this.create = function(song) {
    return $http.post('/api/songs',song)
  }
});

app.controller("controller", function($scope,service) {

  $scope.data = {
    songs: [
      {
        title: "", _id: 1, artist: "",
        lyrics: [],
        input: [],
        chorddefs:[],
        chords: []
      }
    ]
  };

  service.fetch()
  .success(function(songs) {
    $scope.data.songs[0].title = songs.title;
    $scope.data.songs[0].artist = songs.artist;
    $scope.data.songs[0].lyrics = songs.lyrics;
    $scope.data.songs[0].chords = songs.chords;
    $scope.data.songs[0].input = songs.input;
    $scope.data.songs[0].chorddefs = songs.chorddefs;
    $scope.data.songs[0].text = songs.text;
  })

  $scope.updateSongText = function() {
  }

});

var chordpro = require('../lib/chordpro');
