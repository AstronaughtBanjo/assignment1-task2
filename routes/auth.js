const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const {registerValidation, loginValidation} = require('../validation')
const user = User;

router.post('/register', async (req, res) => {

    // Validate the user
    const { error } = registerValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user exists

    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already exists.');

    // Hash the password

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create a user

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try{
        const savedUser = await user.save();
        res.send({ user: user._id});
    } catch (err) {
        res.status(400).send(err)
    }
});

// Login a user

router.post('/login', async (req, res) => {

    // Validate the user
    const { error } = loginValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // Check if email is registered user

    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email not registered');

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Password is not correct');

    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

});

// Display all users

router.get('/', async (req, res, next) => {
    try {
        const items = await user.find({});
        res.json(items);
    } catch (error) {
        next(error);
    }
});

// Display single user

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await user.findOne({
            _id: id,
        });
        if (!item) return next();
        return res.json(item);
    } catch (error) {
        next(error);
    }
});

module.exports = router;