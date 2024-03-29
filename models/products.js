const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
  name:{
    type:String,
    required:[true, 'please enter product name'],
    
    trim:true,
    maxLength:[100,'product name cannot exceed 100 characters']
  },
  price:{
    type:Number,
    required:[true, 'please enter product name'],
    
    trim:true,
    maxLength:[5,'product name cannot exceed 100 characters'],
    default:0.0
  },
description:{
    type:String,
    required:[true, 'please enter product description'],
    
    
  },
  ratings:{
    type:Number,
   default:0
    
    
  },
  images:[

{    public_id:{
        type:String,
        required:true
    },

    url:{
        type:String,
        required:true

    }}
],
  category:{
    type:String,
    required:[true,'pls enter the category'],
    enum:{
        values:[
            'Electronics',
            'Cameras',
            'Laptops',
            'Accessories',
            'Headphones',
            'Food',
            'Books',
            'Clothes/Shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'
        ],message:'pls select the correct category from above'
    }
    
  }
  ,
  seller:{
    type:String,
    required:[true,'please enter product seller'],
    
  },
  stock:{
    type:Number,
    required:[true,'please enter product stock'],
   
  },
  numOfReviews:{
    type:Number,
    required:true
  },
  reviews:[
    {
        name:{
            type:String,
            required:true
        },
        rating:{
            type:Number,
            required:true
        },
        comment:{
            type:String,
            required:true
        }
    }
  ]
,
user :{
  type:mongoose.Schema.ObjectId,
  ref:'User',
  required:true

},
createDate:{
    type:Date,
    default:Date.now
}

})

module.exports =  mongoose.model('Product',productSchema)