const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Promotions = require('../models/promotions');
const authenticate = require('../authenticate');

const promoRouter = express.Router();

promoRouter.use(bodyParser.json());

promoRouter.route('/').
    get((req, res, next) => {
        Promotions.find({})
            .then(promotions => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promotions);
            }, err => next(err))
            .catch(err => next(err));
    }).
    post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.create(req.body)
            .then(promo => {
                console.log('Promotion created:\n', promo);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, err => next(err))
            .catch(err => next(err));
    }).
    put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 405;
        res.end('PUT operation not supported on /promotions');
    }).
    delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.deleteMany({})
            .then(result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(result);
            }, err => next(err))
            .catch(err => next(err));
    });

promoRouter.route('/:promoId').
    get((req, res, next) => {
        Promotions.findById(req.params.promoId)
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(promo);
            }, err => next(err))
            .catch(err => next(err));
    }).
    post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        res.statusCode = 405;
        res.end('POST operation not supported on /promotions/' + req.params.promoId);
    }).
    put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndUpdate(req.params.promoId, {
            $set: req.body
        }, { new: true })
            .then(promo => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'apllication/json');
                res.json(promo);
            }, err => next(err))
            .catch(err => next(err));
    }).
    delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
        Promotions.findByIdAndDelete(req.params.promoId)
            .then(result => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'apllication/json');
                res.json(result);
            }, err => next(err))
            .catch(err => next(err));
    });

module.exports = promoRouter;
