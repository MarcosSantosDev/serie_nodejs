const express = require('express');
const bcrypt = require('bcryptjs');

const User = require('../models/users');

const router = express.Router();

router.post('/register', async (req, res) => {
    const { email } = req.body;
    
    try {
        if(await User.findOne({ email }))
            return res.status(400).send({ error: 'Register already exists' });

        const user = await User.create(req.body);

        user.password = undefined;

        return res.send({
            user
        });
    } catch (err) {
        return res.status(400).send({
            error: 'Registration Failed!'
        })
    }
})

router.post('/authenticate', async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    const passwordCompare = await bcrypt.compare(password, user.password);

    if(!user)
        return res.status(400).send({ error: 'User not found' });
    
    if(!passwordCompare)
        return res.status(400).send({ error: 'Invalid password' });

    user.password = undefined;

    res.send({ user });
});

module.exports = app => app.use('/auth', router);
