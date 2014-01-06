


var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectID = Schema.ObjectId;

var TransactionSchema = new Schema({
  category      : {type : String, required : true},
  address       : {type : String, required : true},
  amount        : {type : Number, required : true},
  txid          : {
    type : String,
    required : true
  },
  confirmations : {type : Number, required : true},
  time          : {type : Number, required : true},

  is_fully_confirmed : {type : Boolean, default : false},
  confirmed_at       : {type : Date},

  updated_at    : {type : Date, default : Date.now},
  created_at    : {type : Date, default : Date.now}
});

TransactionSchema.pre('save', function(next) {
  if (this.isNew) {
    // first time the object is created
    return next();
  }
  this.updated_at = Date.now();
  return next();
});

TransactionSchema.methods.confirm = function(cb) {
  this.is_fully_confirmed = true;
  this.confirmed_at = Date.now();
  this.save(cb);
};

module.exports = TransactionSchema;
