"use strict";

module.exports = function(Schema) {
    var Block = Schema.define('Block',{
        number: {
            type: Number,
            index: true
        },
        difficulty: {
            type: String
        },
        hash: {
            type: String,
            index: true
        },
        ended_at: {type: Date},
        updated_at: {type: Date, default: Date.now},
        created_at: {type: Date, default: Date.now}
    });

    Block.beforeUpdate = function (next) {
        this.updated_at = Date.now();
        return next();
    };

    Block.prototype.createNew = function (data, cb) {
        var self = this;

        this.findOne({order :'created_at DESC'},function (err, prev_block) {
            if (err) throw new Error(err);
            var block = new self(data);
            if (prev_block)
                prev_block.ended_at = Date.now();

            block.save(cb);
        });
    };

    Block.validatesPresenceOf('number');
    Block.validatesUniquenessOf('hash','number');


    Block.processed = function (cb) {
        this.ended_at = Date.now();
        this.save(cb);
    };

    return Block;
}