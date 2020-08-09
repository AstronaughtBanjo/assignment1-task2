const router = require('express').Router();
const Product = require('../model/Product');
const product = Product;

// Calculator function

// Function to add two numbers delivered via the URL

var adder=function(num1,num2){
    var result = num1+num2;
    return result

}

// URL branch to get numbers and send the result of adder

// router.get('/', function(req,res){
//     var num1=parseInt(req.query.num1);
//     var num2=parseInt(req.query.num2);
//     var result=adder(num1,num2)
//     res.send('The result is '+result)
// })

// const item = await product.findOne({
//     _id: '5f2fa7b5b242af36280d40c2',
// });

router.get('/', async (req, res, next) => {
    try {
        const item = await product.findOne({
            _id: '5f2fa7b5b242af36280d40c2',
        });
        if (!item) return next();
        var num1 = parseInt(item.price);
        var num2 = parseInt(req.query.num2);
        var result = adder(num1,num2)
        res.send('The result is '+result)

    } catch (error) {
        next(error);
    }
});





module.exports = router;