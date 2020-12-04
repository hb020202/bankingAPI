const mongoClient = require('mongodb').MongoClient;

function mconnection (url, action, data) {
    mongoClient.connect(url,
        {useNewUrlParser: true, useUnifiedTopology:true},
        (error, client) => {
            console.log('connected');
            let db = client.db('bankstuff');
            action(db, data);

        })

}

module.exports = mconnection;