
var mongoose = require('mongoose');
var Schema = mongoose.Schema, ObjectID = Schema.ObjectId;


var BlockSchema = new Schema({
  number     : {
    type : Number,
    required : true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  difficulty : {
    type : String
  },
  hash       : {
    type : String,
    required : true,
    index: {
      unique: true,
      dropDups: true
    }
  },
  ended_at : {type : Date},
  updated_at : {type : Date, default : Date.now},
  created_at : {type : Date, default : Date.now}
});

BlockSchema.pre('save', function(next) {
  if (this.isNew) {
    return next();
  }
  this.updated_at = Date.now();
  return next();
});

BlockSchema.statics.createNew = function(data, cb) {
  var self = this;

  this.findOne().sort('-created_at').exec(function(err, prev_block) {
    if (err) throw new Error(err);
    var block = new self(data);
    if (prev_block)
      prev_block.ended_at = Date.now();

    block.save(cb);
  });
};

BlockSchema.statics.getLatest = function(cb) {
  this.findOne().sort('-created_at').exec(cb);
};

BlockSchema.methods.processed = function(cb) {
  this.ended_at = Date.now();
  this.save(cb);
};

module.exports = BlockSchema;
