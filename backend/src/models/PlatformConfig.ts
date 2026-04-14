import mongoose, { Document, Schema } from 'mongoose';

export interface IPlatformConfig extends Document {
  platformName: string;
  tagline: string;
  maintenanceMode: boolean;
  registrationOpen: boolean;
  announcementText: string;
  announcementEnabled: boolean;
  defaultPassingThreshold: number;
  maxAssessmentAttempts: number;
  maxCoursesPerStudent: number;
  allowStudentProfileEdits: boolean;
  leaderboardEnabled: boolean;
  aiChatbotEnabled: boolean;
}

const PlatformConfigSchema: Schema = new Schema({
  platformName: { type: String, default: 'PromptPal' },
  tagline: { type: String, default: 'Learn AI Prompting. Unlock Your Potential.' },
  maintenanceMode: { type: Boolean, default: false },
  registrationOpen: { type: Boolean, default: true },
  announcementText: { type: String, default: '' },
  announcementEnabled: { type: Boolean, default: false },
  defaultPassingThreshold: { type: Number, default: 70 },
  maxAssessmentAttempts: { type: Number, default: 3 },
  maxCoursesPerStudent: { type: Number, default: 5 },
  allowStudentProfileEdits: { type: Boolean, default: true },
  leaderboardEnabled: { type: Boolean, default: true },
  aiChatbotEnabled: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model<IPlatformConfig>('PlatformConfig', PlatformConfigSchema);
