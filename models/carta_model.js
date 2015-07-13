//modelo carta

var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var cartaSchema = new Schema({
  nombre:    { type: String },
  valor:     { type: Number },  
});

module.exports = mongoose.model('carta', cartaSchema);