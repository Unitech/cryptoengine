var each = require('each'),
    _ = require('underscore');

var MonitorTransactions = (function () {
    function cls(crypto_daemon, opts, channel, db) {
        var debug = require('debug')('crypto:monitor:' + opts.instance_name);

        /**
         * Monitor incoming transactions
         */
        function work() {
            debug('Looking at new transactions');
            /**
             * List all transactions for the block
             */
            db.getLatestBlock(function (err, block) {
                crypto_daemon.listSinceBlock(block.hash, function (err, resp) {
                    if (err) throw new Error(err);
                    injectTransactions(resp.transactions, channel);
                });
            });
        }

        function injectTransactions(transactions, channel) {

            transactions = _.filter(transactions, function (transaction) {
                if (transaction.category == 'send') return null;
                return transaction;
            });

            var txids = _.map(transactions, function (transaction) {
                return transaction.txid;
            });

            debug('%d transactions catched', txids.length);
            if (txids.length == 0) return;

            // Find all transaction with a matching transaction id
            db.getAllTransactionsByID(txids, function (err, _transactions) {
                if (err) throw new Error(err);

                // Get transaction retrieved
                var present_transactions = _.map(_transactions, function (transaction) {
                    return transaction.txid;
                });

                // Make difference to know which transactions should be saved
                var not_saved_transactions = _.difference(txids, present_transactions);

                // Iterate all unsaved transactions and save them
                not_saved_transactions.forEach(function (not_saved_tx) {
                    var trans = _.findWhere(transactions, {txid: not_saved_tx});
                    var tx = new db.Transaction(trans);

                    tx.is_fully_confirmed = false;

                    tx.save(function (err, _tx) {
                        if (err) throw new Error(err);
                        channel.emit('transaction:incoming', _tx);
                        debug('Transaction saved = ', tx);
                    });
                });
            });
        }

        return {
            worker: work
        };
    }

    return cls;
})();

module.exports = MonitorTransactions;
