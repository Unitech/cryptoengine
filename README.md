# CryptoEngine

Monitor incoming transactions and validates transactions (based on minimum confirmations).
It can connect to litecoind, bitcoind and other equivalent daemon.

It connects to mongodb to save all his data.
NodeJS library, and the code is quite clean.

## Support

Before publishing sources and correcting some things, I would like to know if any company or people is interested about sponsoring the util.

LTC : LS8upeXjDbEyGZ4TwYRWdJeUdbnftRMibW

BTC : 1BujZemR8mjUc4zSZTV8UHHQ8mupGTPsfj

Feel free to tell me your name by email at as AT unitech DOT io, you will be listed as a sponsor on the README and later on the website !

I can also provide support to use it or customize it.

## Quick example

A little example once you have your litecoind daemon ready (if not go to the chapter **How to install litecoind**)

```javascript
var CryptoEngine = require('./');

var ltc1 = new CryptoEngine({
  instance_name : 'LTC1',
  minimum_confirmations : 5,
  refresh_ratio : 2,
  mongo_database : 'mongodb://localhost/devdb4',
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

# License

MIT
