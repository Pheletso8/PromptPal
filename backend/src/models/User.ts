import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  assignedCourses: mongoose.Types.ObjectId[];
  stars: number;
  assessmentsPassed: number;
  profileImage?: string;
  disabled: boolean;
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  // Max 5 courses assigned limit enforced via mongoose validation or controller
  assignedCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  stars: { type: Number, default: 0 },
  assessmentsPassed: { type: Number, default: 0 },
  profileImage: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
}, {
  timestamps: true,
});

export default mongoose.model<IUser>('User', UserSchema);
