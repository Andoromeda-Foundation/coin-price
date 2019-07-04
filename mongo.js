/*
Mongodb Service
*/

const MongoClient = require('mongodb').MongoClient;
const config = require('./config.json');
const defaultConfig = config.dev;

const url = `mongodb://${defaultConfig.mongo_host}:${defaultConfig.mongo_port}`;

// await版本, 已经弃用
module.exports.getLatest = async function getLatest(token) {
    const client = await MongoClient.connect(url, { useNewUrlParser: true });
    try {
        const db = client.db('coin-price-test');
        const collection = db.collection('prices');
        const query = { token };
        const res = await collection.findOne(query);
        console.log(res);
        return res;
    } catch(err) {
        console.log(err);
        return {};
    }
}

// callback版本
module.exports.getLatest2 = function(token, callback) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            console.log(err);
            callback(null);
        }
        const dbobj = db.db('coin-price-test');
        dbobj.collection('prices').find({token}).sort({_id: -1}).limit(1).toArray(function(err, result) {
            if (err) {
                console.log(err);
                callback(null);
            }
            callback(result);
        })
    })
}

module.exports.addLatest = function(source, convert, price) {
    MongoClient.connect(url, { useNewUrlParser: true }, function(err, db) {
        if (err) {
            console.log(err);
            return;
        }
        const current_time = new Date();
        const newPrice = { token: source, base: convert, value: price, update_time: current_time };
        const dbobj = db.db('coin-price-test');
        dbobj.collection('prices').insertOne(newPrice, function(err, res) {
            if (err) {
                console.log(err);
                return;
            }
            console.log(newPrice);
            console.log(res);
            console.log('Add to Database Done...');
        });
    })
}
