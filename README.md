# CryptoEngine

Monitor incoming transactions and validates transactions (based on minimum confirmations).
It can connect to litecoind, bitcoind and other equivalent daemon.

It connects to mongodb to save all his data.
NodeJS library, and the code is quite clean.

## Support

I can provide support to use it or customize it, contact me at : as AT unitech DOT io

Donate at :

LTC : LS8upeXjDbEyGZ4TwYRWdJeUdbnftRMibW

BTC : 1BujZemR8mjUc4zSZTV8UHHQ8mupGTPsfj

## Quick example

A little example once you have your litecoind daemon ready (if not go to the chapter **How to install litecoind**)

```javascript
var CryptoEngine = require('./');

var ltc1 = new CryptoEngine({
  instance_name : 'LTC1',
  minimum_confirmations : 5,
  refresh_ratio : 2,
  coin: 'coinName',
  database : { //Database settings
    driver:'mongodb'
    url: 'mongodb://localhost/devdb4',
  }
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
```

## Database options

Supported databse list https://github.com/biggora/caminte/tree/master/lib/adapters

###Settings for MongoDB

For MongoDB database need install mongodb client. Then:

```bash
$ npm install mongodb -g
```

```js
{
     driver     : "mongodb",
     url        : "localhost",
     port       : "27017",
     username   : "test",
     password   : "test",
     database   : "test"
};
```

###Settings for MySQL

For MySQL database need install mysql client. Then:

```bash
$ npm install mysql -g
```

```js
{
     driver     : "mysql",
     host       : "localhost",
     port       : "3306",
     username   : "test",
     password   : "test",
     database   : "test"
     pool       : true // optional for use pool directly 
};
```

###Settings for Redis

For Redis database need install redis client. Then:

```bash
$ npm install redis -g
```

```js
{
     driver     : "redis",
     host       : "localhost",
     port       : "6379"
};
```

###Settings for SQLite

For SQLite database need install sqlite3 client. Then:

```bash
$ npm install sqlite3 -g
```

```js
{
     driver     : "sqlite3",
     database   : "/db/mySite.db"
};
```

## Debug mode

```bash
$ DEBUG="crypto:*" node example.js
```

## Events emitted through the channel

- ready
- block:new
- transaction:confirmation:new
- transaction:confirmation:validated
- transaction:incoming

## How to install litecoind (or equivalent daemon)

First, the basic install (for ubuntu) :

```bash
$ sudo apt-get update
$ sudo apt-get install build-essential libssl-dev libdb5.1-dev libdb5.1++-dev libboost-all-dev git
$ git clone https://github.com/litecoin-project/litecoin
$ cd litecoin/src
$ make -j4 -f makefile.unix USE_UPNP=
$ ne ~/.litecoind/litecoin.conf # cp what litcoind say
```

Then to make litecoind synchronized faster with the network (minutes instead of days) :

```bash
$ sudo apt-get install transmission-cli
$ mkdir dat
$ transmission-cli http://www.lurkmore.com/litecoin-bootstrap/litecoin-bootstrap.torrent -w dat
$ xz -d litecoin-bootstrap/bootstrap.dat.xz
$ cp bootstrap.dat ~/.litecoin/
```

Finally launch it :

```bash
$ ./litecoind -daemon -dbcache=1000
```

# Thanks

https://github.com/biggora/caminte

# License

MIT
