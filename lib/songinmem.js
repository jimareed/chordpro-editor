// Constructor
function SongInMem(bar) {
  // always initialize all instance properties
  this.bar = bar;
  this.baz = 'baz'; // default value
}
// class methods
SongInMem.prototype.save = function(callback) {
  this.baz = 'bar';
};
// export the class
module.exports = SongInMem;
