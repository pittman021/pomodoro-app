const mongoose = require('mongoose');
const { Schema } = mongoose;

const pomzSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pom', pomzSchema);
