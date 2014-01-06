
/**
 * @file Main entry
 * @author Alexandre Strzelewicz <as@unitech.io>
 * @project cryptocurrency-engine
 */

var bitcoin_rpc = require('bitcoin');
var each        = require('each');
var ev2         = require('events').EventEmitter;
var _           = require('underscore');

var DB                  = require('../models/db.js');

var VerifyTransactions  = require('./VerifyTransactions.js');
var MonitorTransactions = require('./MonitorTransactions.js');
var GlobalStats         = require('./GlobalStats.js');

var CryptoEngine = (function() {

  function cls(opts) {
    var crypto_daemon = new bitcoin_rpc.Client(opts.crypto_daemon);
    var db            = new DB(opts.mongo_database);
    var channel       = new ev2();
    var verifytransactions = new VerifyTransactions(crypto_daemon, opts, channel, db);
    var monitortransactions = new MonitorTransactions(crypto_daemon, opts, channel, db);
    var globalstats = new GlobalStats(crypto_daemon, opts, channel, db);

    var debug       = require('debug')('crypto:engine:' + opts.instance_name);

    /**
     * Returned object
     * with public variable and methods
     */
    var obj = {
      crypto_daemon : crypto_daemon,
      channel : channel,
      getDb: function() {return db;}
    };

    function startWorkers() {
      setInterval(function() {
        createNewBlock();
      }, 1000 * opts.refresh_ratio);

      setInterval(function() {
        monitortransactions.worker();
      }, 1500 * opts.refresh_ratio);

      setInterval(function() {
        verifytransactions.worker();
      }, 3000 * opts.refresh_ratio);

      if (opts.global_stats) {
        setInterval(function() {
          globalstats.worker();
        }, 1000 * opts.refresh_ratio);
      }
    }

    function createNewBlock(cb) {
      var self = this;
      /**
       * Get the last block in blockchain
       * (only one block is mined at the same time)
       */
      crypto_daemon.getBlockCount(function(err, blockcount) {
        if (err) throw new Error(err);
        crypto_daemon.getBlockHash(blockcount, function(err, hash) {
          if (err) throw new Error(err);

          db.Block.getLatest(function(err, block) {

            if (block && block.hash == hash) return;

            debug('New block detected = %s', hash);

            crypto_daemon.getDifficulty(function(err, difficulty) {

              db.Block.createNew({
                number     : blockcount,
                hash       : hash,
                difficulty : difficulty
              }, function(err, _block) {
                if (err) throw new Error(err);
                debug('Created new block = %s', _block.hash);
                channel.emit('block:new', _block);
                if (cb) return cb(_block);
                return false;
              });
            });
          });
        });
      });
    }

    function init(cb) {
      db.Block.getLatest(function(err, block) {
        if (err) throw new Error(err);

        if (block && block.hash) {
          debug('Processing old block number = %s, hash = %s', block.number, block.hash);
          return cb(block);
        }

        createNewBlock(function(block) {
          return cb(block);
        });

        return false;
      });
    }

    /**
     * Main
     */
    init(function(current_block) {
      channel.emit('ready', {
        opts : opts,
        current_block : current_block
      });
      debug('Starting workers');
      startWorkers();
    });

    return obj;
  }

  return cls;
})();

module.exports = CryptoEngine;
