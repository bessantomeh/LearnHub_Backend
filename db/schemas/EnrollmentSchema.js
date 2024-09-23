import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const enrollmentSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },
  enrollmentDate: {
    type: Date,
    default: Date.now, 
  },
}, { timestamps: true }); 

const Enrollment = model('Enrollment', enrollmentSchema);

export default Enrollment;
