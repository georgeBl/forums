const mongoose = require('mongoose');
const ObjectId = require('mongoose').ObjectID;

const SubforumSchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true },
  logo: { type: String, required: true}

});
module.exports = mongoose.model('Subforum', SubforumSchema);
