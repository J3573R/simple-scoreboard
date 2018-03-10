const restify = require('restify');
const restifyErrors = require('restify-errors');
const restifyValidation = require('node-restify-validation');

const server = restify.createServer();

const {
    queryParser,
    bodyParser,
    throttle
} = restify.plugins;

// Parse query parameters
server.use(queryParser());

// Parse request body
server.use(bodyParser());

// Rate limit requests
server.use(throttle({
    burst: 5,
    rate: 2,
    ip: true
}));

// Add request validation
server.use(restifyValidation.validationPlugin( {
    errorsAsArray: false,
    forbidUndefinedVariables: false,
    errorHandler: restifyErrors.InvalidArgumentError
}));

module.exports = server;