const express =require('express')
const app =express();

const cookieParser = require('cookie-parser')
app.use(express.json());
app.use(cookieParser())



const errorMiddleware = require('./middlewares/error')

// import all the routes 
const products= require('./Routes/product');

const auth= require('./Routes/auth');
const order = require('./Routes/order');


app.use('/api/v1',products)
app.use('/api/v1',auth)
app.use('/api/v1',order)
//middleware to handle error
app.use(errorMiddleware);


module.exports=app;