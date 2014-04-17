"use strict";

module.exports = function(Schema) {
    var User = Schema.define('User', {
        username: {
            type: String,
            index:true
        },
        email: {
            type: String,
            index: true
        },

        ltc_address: {
            type: String,
            index: true
        },
        btc_address: {
            type: String,
            index: true
        },

        updated_at: { type: Date, default: Date.now },
        created_at: { type: Date, default: Date.now }
    });

    //Check unique field
    User.validatesUniquenessOf('ltc_address','email','username','btc_address');
    //Check required fields
    User.validatesPresenceOf('ltc_address','email','username','btc_address');

    User.beforeUpdate = function (next) {
        this.updated_at = Date.now();
        return next();
    };

    return User;
}
