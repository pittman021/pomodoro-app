const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
  id: String,
  task: String,
  created: Date,
  completed: Date,
  status: String,
  tag: String,
  owner: { type: Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('Task', taskSchema);
