"use strict";

module.exports = function(Schema) {
    var Transaction = Schema.define('Transaction', {
        category: {
            type: String
        },
        address: {
            type: String
        },
        amount: {
            type: Number
        },
        txid: {
            type: String,
            index: true
        },
        account : {
            type : String
        },
        confirmations: {
            type: Number
        },
        time: {
            type: Number
        },

        is_fully_confirmed: {
            type: Boolean,
            default: false
        },
        confirmed_at: {
            type: Date
        },

        updated_at: {
            type: Date,
            default: Date.now
        },
        created_at: {
            type: Date,
            default: Date.now
        }
    });

    Transaction.validatesPresenceOf('category', 'address','amount','txid','account','confirmations','time');

    Transaction.beforeUpdate = function (next) {
        this.updated_at = Date.now();
        return next();
    };

    return Transaction;
}
