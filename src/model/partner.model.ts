import mongoose from "mongoose";

export interface PartnerDocument extends mongoose.Document {
  email: string;
  phoneNum: string;
  companyName: string;
  businessNature: string;
  contactPerson: string;
  partnerLevel: string;
  createdAt: Date;
  updatedAt: Date;
}

const partnerSchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
    },
    contactPerson: {
      type: String,
      required: true,
    },
    businessNature: {
      type: String,
      required: true,
    },
    partnerLevel: {
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
  },
  { timestamps: true }
);

const Partner = mongoose.model("partner", partnerSchema);

export { Partner };
