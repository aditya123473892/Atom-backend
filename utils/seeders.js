const product = require('../models/products');
const dotenv = require('dotenv');
const ConnectDatabase= require('../config/database');

const products = require('../data/product');
const connect = require('mongoose');


dotenv.config({path:'backend/config/config.env'})

ConnectDatabase();


const seedProducts = async()=>{
    try{

        await product.deleteMany();
        console.log('products are deleted')

        await product.insertMany(products)
        console.log('all products are added')
     }
    catch(error){
        console.log(error.message);
        process.exit();

    }
}

seedProducts()




