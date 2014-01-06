
var mongoose = require('mongoose');
var Schema   = mongoose.Schema, ObjectID = Schema.ObjectId;
var debug    = require('debug')('model:User');

var UserSchema = new mongoose.Schema({
  username : {
    type : String,
    required : true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  email : {
    type : String,
    index: {
      unique: true,
      dropDups: true
    }
  },

  ltc_address : {
    type : String,
    index: {
      unique: true,
      dropDups: true
    }
  },
  btc_address : {
    type : String,
    index: {
      unique: true,
      dropDups: true
    }
  },

  updated_at : { type : Date, default : Date.now },
  created_at : { type : Date, default : Date.now }
});

UserSchema.pre('save', function(next) {
  if (this.isNew) {
    // Process once new
    return next();
  }
  this.updated_at = Date.now();
  return next();
});

module.exports = mongoose.model('User', UserSchema);
