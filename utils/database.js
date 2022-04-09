const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
    MongoClient.connect("mongodb+srv://brunomike:LHMex1BqqIC3hfGv@cluster0.yeeda.mongodb.net/shop?retryWrites=true&w=majority")
        .then(client => {
            console.log('MongoDB connected successully!');
            _db = client.db();
            callback();
        })
        .catch(err => {
            console.log({ error: err.message })
            throw err;
        });
};

const getDb = () => {
    if (_db) {
        return _db;
    }
    throw 'No database found!'
}

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
