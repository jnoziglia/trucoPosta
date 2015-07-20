//modelo partidas
var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var partidaSchema = new Schema({
  fecha:    { type: String },
  player1:     { type: Number },
  player2:  { type: Number },
});

module.exports = mongoose.model('partida', partidaSchema);