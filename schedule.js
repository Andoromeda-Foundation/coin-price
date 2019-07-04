/*
Schedule Job
Get Coin Price Every * minutes...
*/

const request = require('request');
const mongo = require('./mongo');
const config = require('./config.json');
const defaultConfig = config.dev;

module.exports.schtest = function() {
    const current_time = new Date();
    console.log(`Scheduler Job test at ${current_time}...`);
}

module.exports.updateCoinPrice = function(source, convert) {
    console.log(`Catching ${source} to ${convert} price from CoinMarketCap...`)
    const options = {
        method: 'GET',
        url: `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${source}&convert=${convert}`,
        headers: {
            Accepts: 'application/json',
            'X-CMC_PRO_API_KEY': defaultConfig.cmc_key,
        },
    };
    request(options, function(err, resp, body) {
        if (err) {
            console.log(err);
            return;
        }
        // console.log(resp);
        // console.log(body);
        console.log('Latest Price Catched...');
        const resData = JSON.parse(body);
        mongo.addLatest(source, convert, resData['data'][source]['quote'][convert]['price'], 
            'CoinMarketCap', resData['data'][source]['quote'][convert]['last_updated']);
    })
}