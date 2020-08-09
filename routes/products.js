const router = require('express').Router();
const verify = require('./verifyToken');
const User = require('../model/User');
const user = User;
const Product = require('../model/Product');
const product = Product;
const {productValidation} = require('../validation')

// Get id of user from token

router.get('/', verify, async (req,res) => {
    res.send(req.user);
});

// View product by id

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const item = await product.findOne({
            _id: id,
        });
        if (!item) return next();
        return res.json(item.price);
    } catch (error) {
        next(error);
    }
});

// Create a product

router.post('/add', async (req, res, next) => {

    // Validate the product
    const { error } = productValidation(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    // Check if product exists

    const productExist = await Product.findOne({name: req.body.name});
    if(productExist) return res.status(400).send('Product already exists.');

    // Create a product

    const product = new Product({
        name: req.body.name,
        price: req.body.price,
    });
    try{
        const savedProduct = await product.save();
        res.send({ product: product._id});
    } catch (err) {
        res.status(400).send(err)
    }
});

// Get id of user from token

router.get('/', verify, async (req,res) => {
    res.send(req.user);
});

// Get user by id

// router.get('/test/:id', verify, async (req, res, next) => {
//     try {
//         res.send(req.user);
//         const { id } = req.params;
//         const item = await user.findOne({
//             _id: id,
//         });
//         if (!item) return next();
//         return res.json(item);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = router;