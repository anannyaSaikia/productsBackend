const mongoose = require("mongoose");

const prodSchema = new mongoose.Schema({
    name : {type : String, required : true},
    description : {type : String, required : true},
    category : {type : String, required : true},
    image : {type : String, required : true},
    location : {type : String, required : true},
    postedAt : {type : String, required : true},
    price : {type : String, required : true},
    user_id : {type : String}
})

const ProdModel = mongoose.model("products", prodSchema);

module.exports = {ProdModel};