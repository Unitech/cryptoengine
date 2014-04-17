var each = require('each');

var VerifyTransactions = (function () {
    function cls(crypto_daemon, opts, channel, db) {

        var debug = require('debug')('crypto:transactions:verify:' + opts.instance_name);

        /**
         * Verify that transactions has enough confirmations
         */
        function work() {
            db.getAllNonConfirmedTransactions(function (err, _transactions) {
                if (err) throw new Error(err);

                each(_transactions)
                    .on('item', function (tx, i, next) {
                        crypto_daemon.getTransaction(tx.txid, function (err, txinfo) {
                            if (err) throw new Error(err);

                            if (tx.confirmations != txinfo.confirmations) {
                                debug('Transaction %s has got a new confirmation (%d)',
                                    tx.txid, txinfo.confirmations);
                                tx.confirmations = txinfo.confirmations;

                                channel.emit('transaction:confirmation:new', tx);

                                tx.save(function () {
                                });
                            }
                            if (txinfo.confirmations >= opts.minimum_confirmations) {
                                confirmTransaction(tx, function (err) {
                                    channel.emit('transaction:confirmation:validated', tx);
                                    if (err) return next(err);
                                    return next();
                                });
                                return false;
                            }
                            return next();
                        });
                    })
                    .on('error', function (err) {
                        throw err;
                    })
                    .on('end', function () {
                        debug('%s transactions processed', _transactions.length);
                    });
            });
        }

        function confirmTransaction(transaction, cb) {
            db.confirmTransaction(transaction,function (err) {
                if (err) throw new Error(err);

                debug('Transaction to address %s | txid = %s has been confirmed at %s for %d Ł',
                    transaction.address, transaction.txid, transaction.confirmed_at, transaction.amount);
                return cb(err, transaction);
            });
        }

        return {
            worker: work
        };
    }

    return cls;
})();

module.exports = VerifyTransactions;
