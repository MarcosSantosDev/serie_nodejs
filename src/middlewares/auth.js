const jwt = require('jsonwebtoken');
const authConf = require('../config/auth');

module.exports = (req, res, next) => {
    const authHeader = req.headers.auhorization;

    if (!authHeader) 
        return res.status(401).send({ error: 'No token provided.' });

    const parts =  authHeader.split(' ');

    if (!parts.length == 2)
        return res.status(401).send({ error: 'Token error.' });

    const [ scheme, token ] = parts;

    if(! /^Bearer$/i.test(scheme)) 
        return res.status(401).send({ error: 'Token malformateed.' });

    jwt.verify(token, authConf.secret, (error, decoded) => {
        if(error) return res.status(401).send({ error: 'Token invalid.' });

        req.userId = decoded.id;

        return next();
    });    
}