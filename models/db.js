"use strict";

var mongoose    = require('mongoose');

var DB = (function(){
  function cls(database) {
    var debug       = require('debug')('crypto:db:' + database);
    var mongoDB = mongoose.connection;

    debug('Connecting');

    var connection = mongoose.createConnection(database);

    connection.on('error', function cb() {
      debug('Error when connecting');
    });

    connection.once('open', function cb() {
      debug('Successfully connected');
    });

    var obj = {
      Transaction : connection.model('Transaction', require('./Transaction')),
      Block : connection.model('Block', require('./Block')),
      connection : connection
    };

    return obj;
  }

  return cls;
})();

module.exports = DB;
