//modelo partidas
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var partidaSchema = new Schema({
  fecha:    { type: Date },
  player1:     { type: Number },
  player2:  { type: Number },
  numero: {type: Number}
});

/*partidaSchema.statics.findMax = function (callback) {
  this.findOne({}) // 'this' now refers to the Member class
    .sort({numero: -1})
    .exec(callback);
}*/

module.exports = mongoose.model('partida', partidaSchema);