"use strict";
var caminte = require('caminte'),
    domain = require('domain');

var DB = (function(){
    var self = {
        connection: null,

        initConnection: function(dbSettings,callback) {
            var debug = require('debug')('crypto:db:' + dbSettings),
                Schema = caminte.Schema,
                d = domain.create();

            d.on('error',function(err){
                debug(err.stack);
                console.error(err.stack);
            });

            d.run(function () {
                debug('Connecting');
                self.connection = new Schema(dbSettings.driver, dbSettings);
                self.loadModels();

                self.connection.log = function(q) {
                    return console.log(q);
                };

                self.connection.once('connected', function(){
                    debug('Database successfully connected');
                    self.connection.autoupdate(callback);
                });
            });
        },
        loadModels: function() {
            require('./../models/Transaction')(self.connection);
            require('./../models/Block')(self.connection);
            require('./../models/User')(self.connection);
        },
        getAllTransactions: function(options,callback) {
            self.connection.models.Transaction.find(options,callback);
        },
        getLatestBlock: function(callback) {
            self.connection.models.Block.findOne({order :'created_at DESC'},callback);
        }
    }

    //Public methods and variables
    return {
        /**
         * Create initiate db class and connect tot database, after connect called callback
         *
         * @param options
         * @param callback
         */
        construct: function(options,callback){
            self.initConnection(options,callback);
        },
        /**
         * Function callback with finded latest block, or null is table blocks empty
         *
         * @param fields Object
         * @param callback
         */
        getLatestBlock: function(callback) {
            self.getLatestBlock(callback);
        },
        /**
         * Function create new Block from object fields
         * If validation error then callback called with field errors
         *
         * @param fields Object
         * @param callback
         */
        createNewBlock: function(fields,callback) {
            self.getLatestBlock(function(err, prev_block) {
                if (err) throw new Error(err);
                var block = new self.connection.models.Block(fields);

                if (prev_block)
                    prev_block.ended_at = Date.now();

                block.isValid(function(valid){
                    if(!valid)
                        callback(block.errors);
                    else
                        block.save(callback);
                });

            });
        },
        /**
         * Function create new Transaction from object fields
         * If validation error then callback called with field errors
         *
         * @param fields Object
         * @param callback
         */
        createNewTransaction: function(fields,callback) {
            var transaction = new self.connection.models.Transaction(fields);

            transaction.isValid(function(valid){
                if(!valid)
                    callback(transaction.errors);
                else
                    transaction.save(callback);
            });
        },
        /**
         * Function return all transactions with ids
         *
         * @param ids Array
         * @param callback
         */
        getAllTransactionsByTxID: function(ids,callback) {
            self.getAllTransactions({where: {txid: { in : ids}}},callback);
        },
        /**
         * Function send in callback all transaction with is_fully_confirmed == false
         *
         * @param callback
         */
        getAllNonConfirmedTransactions: function(callback) {
            self.getAllTransactions({where: {is_fully_confirmed : false}},callback);
        },
        /**
         * Check exist transactions in table
         *
         * @param transaction
         * @param callback
         */
        checkExistTransaction: function(transaction,callback) {
            self.connection.models.Transaction.findById(transaction.id,function(err,result){
                if(err) throw err;
                if(result)
                    callback(true);
                else
                    callback(false);
            });
        },
        /**
         * Function set fully confirm for transaction if transaction exist in database
         *
         * @param transaction (models/Transaction)
         * @param callback
         */
        confirmTransaction: function(transaction,callback) {
            this.checkExistTransaction(transaction,function(exist){
                if(exist) {
                    transaction.is_fully_confirmed = true;
                    transaction.confirmed_at = Date.now();

                    transaction.isValid(function(valid){
                        if(!valid)
                            callback(transaction.errors);
                        else {
                            transaction.save();
                            callback(null);
                        }
                    });
                } else {
                    debug('Transaction to address %s | txid = %s not confirmed at %s for %d Ł, Error: Transaction not exist in database',
                        transaction.address, transaction.txid, transaction.confirmed_at, transaction.amount);
                    callback(null);
                }
            });
        },
        /**
         * Drop all tables, use for tests. Not use in production!!!
         *
         * @param callback
         */
        destroyAll: function(callback) {
            self.connection.models.Block.destroyAll(function(err){
                if(err) throw err;
                self.connection.models.Transaction.destroyAll(function(err){
                    if(err) throw err;
                    self.connection.models.User.destroyAll(function(err){
                        if(err) throw err;
                        callback();
                    });
                });
            });
        }

    };
})();

module.exports = DB;
