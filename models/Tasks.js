const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const timestamp = require('mongoose-timestamp');

const TasksSchema = new mongoose.Schema({
  status: {
    type: String,
    required: true,
    trim: true
  },
  definition: {
    type: String,
    required: true,
    trim: true
  },
  user_id: {
    type: Schema.ObjectId,
    required: true,
    trim: true
  }

});

TasksSchema.plugin(timestamp);

const Tasks = mongoose.model('Tasks', TasksSchema);
module.exports = Tasks;