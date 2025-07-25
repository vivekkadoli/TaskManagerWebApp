import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: false },
  task: { type: String, required: true },
  date: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export default mongoose.model('Task', taskSchema);