import mongoose from "mongoose";

export interface RegistrationDocument extends mongoose.Document {
  fullName: string;
  email: string;
  phoneNum: string;
  location: string;
  committee: string;
  interest: string;
  skills: string;
  hoursPerWeek: string;
  meetingAvailability: string;
  confidentiality: string;
  suggestions?: string;
  additionalComments?: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    phoneNum: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    location: {
      type: String,
      required: true,
    },
    committee: {
      type: String,
      required: true,
    },
    interest: {
      type: String,
      required: true,
    },
    skills: {
      type: String,
      required: true,
    },
    hoursPerWeek: {
      type: String,
      required: true,
    },
    meetingAvailability: {
      type: String,
      required: true,
    },
    confidentiality: {
      type: String,
      required: true,
    },
    additionalComments: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Registration = mongoose.model<RegistrationDocument>(
  "registration",
  registrationSchema
);

export { Registration };
