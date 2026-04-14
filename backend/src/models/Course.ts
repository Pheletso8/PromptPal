import mongoose, { Document, Schema } from 'mongoose';

export interface ICourseTemplate {
  title: string;
  prompt: string;
  icon: string;
}

export interface IAssessment {
  question: string;
  options: string[];
  correctAnswer: string; // The correct option string or index depending on implementation
}

export interface ICourse extends Document {
  title: string;
  tag: string;
  description: string;
  image: string;
  videoUrl: string;
  whyLearn: string;
  lessonTopic: string;
  templates: ICourseTemplate[];
  assessments: IAssessment[];
  passingThreshold: number;
}

const CourseSchema: Schema = new Schema({
  title: { type: String, required: true },
  tag: { type: String, required: true },
  description: { type: String },
  image: { type: String },
  videoUrl: { type: String },
  whyLearn: { type: String },
  lessonTopic: { type: String },
  templates: [{
    title: { type: String },
    prompt: { type: String },
    icon: { type: String },
  }],
  assessments: [{
    question: { type: String },
    options: [{ type: String }],
    correctAnswer: { type: String }
  }],
  passingThreshold: { type: Number, default: 70 }
}, {
  timestamps: true,
});

export default mongoose.model<ICourse>('Course', CourseSchema);
