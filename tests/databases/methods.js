var expect = require("chai").expect,
    _ = require('underscore'),
    async = require('async');

module.exports = function(db) {
    it("Destroy tables", function(done) {
        db.destroyAll(done);
    });
    it("Create new Block", function(done) {
        db.createNewBlock({
            number: 256,
            hash: 'F(*G&(*DF&G(*F&g987zfd89g7bg9b',
            difficulty: 'BGKJBLFKGJBLGKBJGKL'
        },function(err){
            expect(err).to.be.null;
            done();
        });
    });
    it("Get latest Block", function(done) {
        db.getLatestBlock(function(err, block){
            expect(block).not.to.be.null;
            done();
        });
    });
    it("Create new Transaction", function(done) {
        db.createNewTransaction({
            category: 'cat',
            address: 'F(*G&(*DF&G(*F&g987zfd89g7bg9b',
            amount: 234,
            txid:'account',
            account: 'blabla',
            confirmations: 1,
            time: 328953487
        },function(err){
            expect(err).to.be.null;
            done();
        });
    });
    it("Get all non confirmed transactions", function(done) {
        db.getAllNonConfirmedTransactions(function(err, transactions){
            expect(transactions).not.to.be.null;
            done();
        });
    });
    it("Get all transactions by Tx ID", function(done) {
        db.getAllNonConfirmedTransactions(function(err, transactions){
            var txIds = _.map(transactions,function(transaction){
                return transaction.txid;
            });
            db.getAllTransactionsByTxID(txIds,function(err,transactions) {
                expect(transactions).not.to.be.null;
                done();
            });
        });
    });
    it("Confirm transaction", function(done) {
        db.getAllNonConfirmedTransactions(function(err, transactions){
            async.each(transactions,function(transaction,callback) {
                db.confirmTransaction(transaction,function(err){
                    expect(err).to.be.null;
                    callback();
                });
            },function(err){
                if(err) throw err;
                done();
            });
        });
    });
    it("Get all non confirmed transactions", function(done) {
        db.getAllNonConfirmedTransactions(function(err, transactions){
            expect(transactions).to.be.empty;
            done();
        });
    });
}