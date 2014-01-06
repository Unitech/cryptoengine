
var CryptoEngine = require('./');

var ltc1 = new CryptoEngine({
  instance_name : 'LTC1',
  minimum_confirmations : 5,
  refresh_ratio : 2,
  mongo_database : 'mongodb://localhost/devdb4',
  //global_stats : true,
  crypto_daemon : {
    host : process.env.LITECOIND_HOST,
    port : process.env.LITECOIND_PORT,
    user : process.env.LITECOIND_USER,
    pass : process.env.LITECOIND_PASS
  }
});

ltc1.channel.on('ready', function(infos) {
  console.log('Successfully connected = ', infos);
});

ltc1.channel.on('block:new', function(block) {
  console.log('new block', block);
});

ltc1.channel.on('transaction:confirmation:new', function(tx) {
  console.log('New confirmation = ', tx);
});

ltc1.channel.on('transaction:confirmation:validated', function(tx) {
  console.log('Transaction validated =', tx);
});

ltc1.channel.on('transaction:incoming', function(tx) {
  console.log('New transaction incoming = ', tx);
});
