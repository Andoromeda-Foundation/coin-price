/*
Coin Price API Server...
Part of Smart Signature Project...
Created on July 3 2019
*/
const _ = require('lodash')
const cron = require('node-cron');
const mongo = require('./mongo');
const sch = require('./schedule');
const express = require('express');
const app = express();
const config = require('./config.json');
const defaultConfig = config.dev;
const port = defaultConfig.node_port;

cron.schedule('*/15 * * * *', function() {
    sch.schtest();
    _.each(defaultConfig.coin_pairs, function (pair) {
        sch.updateCoinPrice(pair.source, pair.convert);
    })
})

// 允许跨站请求CORS
app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
})

app.get('/v1/price', function (req, res) {
    console.log(`Request from ${req.ip} with method ${req.method} originalUrl ${req.originalUrl}`);
    const source = req.query.source;
    const convert = req.query.convert;
    // TBD: Verify parameters...
    mongo.getLatest2(source, convert, function(price) {
        if (price) {
            res.json({ code: 0, source, convert, price: price[0].value,
                add_time: price[0].add_time, platform: price[0].platform,
                update_time: price[0].update_time });
        } else {
            mongo.getLatest2(convert, source, function (xprice) {
                if (xprice) {
                    res.json({ code: 0, source, convert, price: 1/(xprice[0].value),
                        add_time: xprice[0].add_time, platform: xprice[0].platform,
                        update_time: xprice[0].update_time });
                } else {
                    res.json({ code: 999 });
                }
            })
        }
    });
})

app.get('/v1/exchange', function(req, res) {
    console.log(`Request from ${req.ip} with method ${req.method} originalUrl ${req.originalUrl}`);
    const source = req.query.source;
    const amount = req.query.amount;
    const convert = req.query.convert;
    mongo.getLatest2(source, convert, function(price) {
        if (price) {
            const changed = amount * price[0].value;
            res.json({ code: 0, source, convert, price: price[0].value, changed,
                add_time: price[0].add_time, platform: price[0].platform,
                update_time: price[0].update_time });
        } else {
            mongo.getLatest2(convert, source, function (xprice) {
                if (xprice) {
                    const changed = amount / xprice[0].value;
                    res.json({ code: 0, source, convert, price: 1/(xprice[0].value), changed,
                        add_time: xprice[0].add_time, platform: xprice[0].platform,
                        update_time: xprice[0].update_time });
                } else {
                    res.json({ code: 999 });
                }
            })
        }
    })
})

app.listen(port, function() {
    console.log(`Application is listening on http://localhost:${port} ...`);
})