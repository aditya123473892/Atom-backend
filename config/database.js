const mongoose= require('mongoose');




const ConnectDatabase=()=>{
    mongoose.connect('mongodb+srv://adityathakur6199:mern123@cluster0.sxurzjg.mongodb.net/?retryWrites=true&w=majority',{  
        
    }).then(con=>{
        console.log("connected to database")
    })
}


module.exports = ConnectDatabase