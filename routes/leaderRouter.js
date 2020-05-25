const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Leaders = require('../models/leaders');
const authenticate = require('../authenticate');

const leaderRouter = express.Router();

leaderRouter.use(bodyParser.json());

leaderRouter.route('/').
    get((req, res, next) => {
        Leaders.find({})
            .then(leaders => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leaders);
            }, err => next(err))
            .catch(err => next(err));
    }).
    post(authenticate.verifyUser,(req, res, next) => {
        Leaders.create(req.body)
            .then(leader => {
                console.log('Leader created:\n', leader);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, err => next(err))
            .catch(err => next(err));
    }).
    put(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 405;
        res.end('PUT operation not supported on /leaders');
    }).
    delete(authenticate.verifyUser,(req, res, next) => {
        Leaders.deleteMany({})
            .then(result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            }, err => next(err))
            .catch(err => next(err));
    });

leaderRouter.route('/:leaderId').
    get((req, res, next) => {
        Leaders.findById(req.params.leaderId)
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(leader);
            }, err => next(err))
            .catch(err => next(err));
    }).
    post(authenticate.verifyUser,(req, res, next) => {
        res.statusCode = 405;
        res.end('POST operation not supported on /leaders/' + req.params.leaderId);
    }).
    put(authenticate.verifyUser,(req, res, next) => {
        Leaders.findByIdAndUpdate(req.params.leaderId, {
            $set: req.body
        }, { new: true })
            .then(leader => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'apllication/json');
                res.json(leader);
            }, err => next(err))
            .catch(err => next(err));
    }).
    delete(authenticate.verifyUser,(req, res, next) => {
        Leaders.findByIdAndDelete(req.params.leaderId)
            .then(result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'apllication/json');
                res.json(result);
            }, err => next(err))
            .catch(err => next(err));
    });


module.exports = leaderRouter;
