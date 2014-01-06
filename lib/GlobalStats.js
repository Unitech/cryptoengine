
/**
 * Not to use
 * here is for development
 */

var GlobalStats = (function(){
  function cls(crypto_daemon, opts, channel, db) {
    var debug = require('debug')('crypto:global:' + opts.instance_name);


    function MonitorAllTransactions(block) {

      crypto_daemon.getBlockCount(function(err, blockcount) {
        if (err) throw new Error(err);
        crypto_daemon.getBlockHash(blockcount, function(err, hash) {
          if (err) throw new Error(err);
          crypto_daemon.getBlock(hash, function(err, _block) {
            console.log(_block);
          });
        });
      });
    }

    function work() {
      db.Block.getLatest(function(err, block) {
        if (err) throw new Error(err);
        if (!block) return;

        MonitorAllTransactions(block);
      });
    }

    return {
      worker : work
    };
  }

  return cls;
})();


module.exports = GlobalStats;
