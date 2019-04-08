const mongoose = require('mongoose');
// const ObjectId = require('mongoose').ObjectID;



const ThreadSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: {type:String },
  body:{type:String, required: true},
  image:{type:String},
  rate:{type: Number},
  rated_by:[{user_id: {type: mongoose.Types.ObjectId}, rate: {type: Number}} ],
  subforum_id:{type: mongoose.Types.ObjectId},
  created_by:{type: mongoose.Types.ObjectId},
  created_on:{type: Date}
});


module.exports = mongoose.model('Thread', ThreadSchema);
