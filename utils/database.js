const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect(process.env.MONGO_DB_DRIVER)
        .then(client => {
            console.log('MongoDB connected successully!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log({ error: err.message });
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
