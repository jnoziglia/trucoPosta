//modelo partidas
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var partidaSchema = new Schema({
  fecha:    { type: String },
  player1:     { type: Number },
  player2:  { type: String },
});

module.exports = mongoose.model('partida', partidaSchema);