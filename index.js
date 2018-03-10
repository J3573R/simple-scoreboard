const server = require('./server');
const connector = require('./database');
const routes = require('./routes');

const PORT = 80;

module.exports = server.listen(PORT, async() => {
    await connector();
    routes();
    console.info(`Server started. Listening port ${PORT}`);
});