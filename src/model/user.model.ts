import mongoose from "mongoose";
import { EDITION_TYPE } from "../utils/Constants";

export interface AttendeeUserDocument extends mongoose.Document {
  fullName: string;
  email: string;
  phoneNum: string;
  stateOfResidence: string;
  organization?: string;
  jobTitle?: string;
  attendanceRole?: string;
  experienceOfPastSeminar?: string;
  attendingAs: string;
  howDidYouHear: string;
  expectations: string[];
  sharedTopics?: string;
  support?: string;
  agreement: string;
  edition: string;
  editionChecked: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface VendorUserDocument extends mongoose.Document {
  vendorCompanyName: string;
  email: string;
  editionChecked: string;
  contactPersonName: string;
  website?: string;
  socialMedia?: string;
  attendanceRole: string;
  experienceOfPastSeminar?: string;
  businessCategory: string[];
  servicesDescription: string;
  otherRequirements?: string;
  agreement: string;
  edition: string;
  createdAt: Date;
  updatedAt: Date;
}

const attendeeUserSchema = new mongoose.Schema(
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
    edition: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    stateOfResidence: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: false,
    },
    jobTitle: {
      type: String,
      required: false,
    },
    attendanceRole: {
      type: String,
      required: false,
    },
    experienceOfPastSeminar: {
      type: String,
      required: false,
    },
    attendingAs: {
      type: String,
      required: true,
    },
    howDidYouHear: {
      type: String,
      required: true,
    },
    expectations: {
      type: [String],
      required: true,
    },
    sharedTopics: {
      type: String,
      required: false,
    },
    support: {
      type: String,
      required: false,
    },
    agreement: {
      type: String,
      required: true,
    },
    editionChecked: {
      type: String,
      required: false,
      default: "lagos",
      enum: EDITION_TYPE,
    },
  },
  { timestamps: true }
);

const vendorUserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    editionChecked: {
      type: String,
      required: false,
      default: "lagos",
      enum: EDITION_TYPE,
    },
    edition: {
      type: String,
      required: true,
    },
    vendorCompanyName: {
      type: String,
      required: true,
      unique: true,
    },
    contactPersonName: {
      type: String,
      required: true,
    },
    website: {
      type: String,
      required: false,
    },
    socialMedia: {
      type: String,
      required: false,
    },
    attendanceRole: {
      type: String,
      required: true,
    },
    experienceOfPastSeminar: {
      type: String,
      required: false,
    },
    businessCategory: {
      type: [String],
      required: true,
    },
    servicesDescription: {
      type: String,
      required: true,
    },
    otherRequirements: {
      type: String,
      required: false,
    },
    agreement: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const VendorUser = mongoose.model<VendorUserDocument>(
  "VendorUser",
  vendorUserSchema
);
const AttendeeUser = mongoose.model<AttendeeUserDocument>(
  "AttendeeUser",
  attendeeUserSchema
);

export { VendorUser, AttendeeUser };
