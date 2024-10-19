import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { EDITION_TYPE, USER_TYPE } from "../utils/Constants";

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
  revenue?: string;
  createdAt: Date;
  updatedAt: Date;
}
export interface UserWithRoleDocument extends mongoose.Document {
  email: string;
  password: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePasswords: string): Promise<boolean>;
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
    revenue: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);
const UserWithRoleSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: USER_TYPE,
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

const User = mongoose.model<UserWithRoleDocument>(
  "userWithRole",
  UserWithRoleSchema
);

UserWithRoleSchema.pre("save", async function (next) {
  let user = this as unknown as UserWithRoleDocument;

  //only hash the password if it has been modified or new
  if (!user.isModified("password")) return next();

  //get salt
  const salt = await bcrypt.genSalt(
    parseInt(process.env.saltWorkFactor as any)
  );
  // const salt = await bcrypt.genSalt(config.get("saltWorkFactor"));

  const hash = await bcrypt.hashSync(user.password, salt);

  // Replace the password with the hash
  user.password = hash;

  return next();
});

//Used for logging in users
UserWithRoleSchema.methods.comparePassword = async function (
  candidatePasswords: string
) {
  const user = this as UserWithRoleDocument;

  return bcrypt.compare(candidatePasswords, user.password).catch((e) => false);
};

export { VendorUser, AttendeeUser, User };
