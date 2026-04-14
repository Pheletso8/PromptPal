import mongoose, { Document, Schema } from 'mongoose';

export interface IAssessmentMark extends Document {
  user: mongoose.Types.ObjectId;
  course: mongoose.Types.ObjectId;
  score: number;
  passed: boolean;
  attempts: number;
}

const AssessmentMarkSchema: Schema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  score: { type: Number, required: true },
  passed: { type: Boolean, required: true, default: false },
  attempts: { type: Number, required: true, default: 0 }
}, {
  timestamps: true,
});

// Compound index to easily fetch a user's marks for specific courses
AssessmentMarkSchema.index({ user: 1, course: 1 });

export default mongoose.model<IAssessmentMark>('AssessmentMark', AssessmentMarkSchema);
