const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LinkSchema = new Schema (
    {
        linkName: String,
        url:String,
        iconName:String,
        linkId:String,
    }
    
)

  module.exports = LinkSchema;