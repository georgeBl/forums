const mongoose = require('mongoose');
// const ObjectId = require('mongoose').ObjectID;

const CommentSchema = new mongoose.Schema({
  threadId: { type: mongoose.Types.ObjectId },
  comment: { type: String},
  name: {type: String},
  upvotes: {type: Number}
});

module.exports = mongoose.model('Comment', CommentSchema);
