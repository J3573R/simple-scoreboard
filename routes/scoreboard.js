const server = require('../server');
const errors = require('restify-errors');
const scoreboard = require('../database/scoreboard');
const fs = require('fs');
const restify = require('restify');

const TOKEN = process.env.TOKEN || "";

module.exports = () => {
    
    if(!TOKEN) {
        console.warn('No access token set! Running server is unsafe.');
    }

    server.get({
        url: '/'
    }, (req, res, next) => {
        res.send({
            status: 'Ok',
            timestamp: new Date()
        })
    });

    /**
     * 
     * @api {GET} /scores/:secret Get scores by secret
     * @apiName getScores
     * @apiGroup Score
     * @apiVersion  1.0.0
     * 
     * 
     * @apiParam  {String} secret Your secret. Don't show anyone.
     * 
     * @apiHeaderExample {json} Header-Example:
     * {
     *     Authorization : String
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * [{
     *     createdAt : Date,
     *     _id : ObjectId,
     *     secret : String,
     *     name : String,
     *     score : Number
     * }]
     * 
     * 
     */
    server.get({
        url: '/scores/:secret',
        validation: {
            headers: {
                Authorization: TOKEN
            },
            resources: {
                secret: { isRequired: true }
            }
        }
    }, (req, res, next) => {
        let { secret } = req.params;

        scoreboard.find({
            secret,
        })
        .sort({score: -1})
        .exec((error, scores) => {
            if(error) {
                console.error(error);
                return next(new errors.InternalServerError(error));
            }
            res.send(scores);
            return next();
        });
    });


    /**
     * 
     * @api {POST} /scores Create new score
     * @apiName createScore
     * @apiGroup Score
     * @apiVersion  1.0.0
     * 
     * 
     * @apiParam (body) {String} secret Your secret. Don't show anyone.
     * @apiParam (body) {String} name Players name.
     * @apiParam (body) {String} score Players score.
     * 
     * @apiHeaderExample {json} Header-Example:
     * {
     *     Authorization : String
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * [{
     *     createdAt : Date,
     *     _id : ObjectId,
     *     secret : String,
     *     name : String,
     *     score : Number
     * }]
     * 
     * 
     */
    server.post({
        url: '/scores',
        validation: {
            headers: {
                Authorization: TOKEN,
            },
            content: {
                secret: { isRequired: true },
                name: { isRequired: true },
                score: { isRequired: true, isNumeric: true }
            }
        }
    }, (req, res, next) => {
        const {
            secret,
            name,
            score
        } = req.body;

        scoreboard.create({
            secret,
            name,
            score
        }, (error, score) => {
            if(error) {
                console.error(error);
                return next(new errors.InternalServerError(error));
            }

            res.send(score);
            return next();
        });
    });


        /**
     * 
     * @api {DELETE} /scores/:id Delete score
     * @apiName deleteScore
     * @apiGroup Score
     * @apiVersion  1.0.0
     * 
     * 
     * @apiParam  {String} id Object id of score (_id).
     * 
     * @apiHeaderExample {json} Header-Example:
     * {
     *     Authorization : String
     * }
     *
     * @apiSuccessExample {json} Success-Response:
     * [{
     *     createdAt : Date,
     *     _id : ObjectId,
     *     secret : String,
     *     name : String,
     *     score : Number
     * }]
     * 
     * 
     */
    server.del({
        url: '/scores/:id',
        validation: {
            headers: {
                Authorization: TOKEN,
            },
            resources: {
                id: { isRequired: true }
            }
        }
    }, (req, res, next) => {
        const { id } = req.params;

        scoreboard.findByIdAndRemove(id, (error, response) => {
            if(error){
                console.error(error);
                return next(new errors.InternalServerError(error));
            }

            res.send(response);
            return next();
        });
    });

};