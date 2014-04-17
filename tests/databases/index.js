var DB = require('../../api/database'),
    _ = require('underscore');

module.exports = function() {
    describe("DB as mongodb", function() {
        var mongoDB = _.clone(DB);

        it("Initialize", function(done) {
            mongoDB.construct({
                driver: "mongodb",
                url: 'mongodb://localhost/devdb4'
            },done);
        });
        require('./methods')(mongoDB);
    });
    describe("DB as mysql", function() {
        var mysqlDB = _.clone(DB);

        it("Initialize", function(done) {
            mysqlDB.construct({
                driver     : "mysql",
                host       : "localhost",
                port       : "3306",
                username   : "cryptoengine",
                password   : "test",
                database   : "cryptoengine"
            },done);
        });
        require('./methods')(mysqlDB);
    });
}