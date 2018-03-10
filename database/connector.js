const mongoose = require('mongoose');

const MONGO_URL = process.env.MONGO_URL;

module.exports = () => new Promise((resolve, reject) => {
    if(!MONGO_URL) {
        console.error('MONGO_URL envoirement variable required.');
        process.exit();
    }
    
    mongoose.connect(MONGO_URL);
    
    let { connection } = mongoose;
    
    connection.on('error', (error) => {
        console.error(error);
        reject();
    });
    
    connection.once('open', () => {
        console.info('Database connection established.');
        resolve();
    });
});
