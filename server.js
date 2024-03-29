const app = require('./app');

const dotenv = require('dotenv');
const  ConnectDatabase= require('./config/database');
require('dotenv').config();





// Setting up config file
dotenv.config({ path: "backend2\config2\config.env" });


// data base connection 
ConnectDatabase();
console.log('PORT:', process.env.PORT);



const server =
app.listen( process.env.PORT, () => {
    console.log(`Server is running on port: mongodb+srv://adityathakur6199:mern123@cluster0.tx7zc2l.mongodb.net/?retryWrites=true&w=majority in ${process.env.MODE} Mode`);
    
});
//Handle Unhandled promise rejection
process.on('unhandledRejection',err=>{
    console.log(`ERROR :${err.stack}`);
    console.log(`shutting down server due to unhandled promise rejection`)
    server.close(()=>{
        process.exit(1)
    })
})
//handle uncaught exceptions

process.on('uncaughtException',err=>{
    console.log(`ERROR: ${err.message}`);
    console.log('shutting down server  due to uncaught exceptions')
    process.exit(1)
})
