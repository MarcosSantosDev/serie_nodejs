const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/users');
const authConfig = require('../config/auth');

const router = express.Router();

function generateToken(params = {}) {
    return jwt.sign(params, authConfig.secret, {
        expiresIn: 86400
    });
}

router.post('/register', async (req, res) => {

    const { email } = req.body;

    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Email already exists.' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({ user, token: generateToken({ id: user.id }) });
    } catch (err) {
        return res.status(400).send({ error: 'Register Failed.' })
    }
});

router.post('/authenticate', async (req, res) => {
    const {
        email,
        password
    } = req.body;

    const user = await User.findOne({ email }).select('+password');

    const passwordCompare = await bcrypt.compare(password, user.password);

    if (!user)
        return res.status(400).send({
            error: 'User not found'
        });

    if (!passwordCompare)
        return res.status(400).send({
            error: 'Invalid password'
        });

    user.password = undefined;

    res.send({
        user,
        token: generateToken({ id: user.id })
    });
});

module.exports = app => app.use('/auth', router);