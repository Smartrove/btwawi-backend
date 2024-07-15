import mongoose from "mongoose";
import { EDITION_TYPE } from "../utils/Constants";

export interface OrderDocument extends mongoose.Document {
  fullName: string;
  transactionId: string;
  totalPayed: string;
  paymentVerified: boolean;
  editionPaidFor: string;
}

const orderSchema = new mongoose.Schema(
  {
    fullName: { type: String, require: true },
    transactionId: { type: String, require: true },
    totalPayed: { type: String, require: true },
    paymentVerified: { type: Boolean, require: true, default: false },
    editionPaidFor: {
      type: String,
      require: true,
      enum: EDITION_TYPE,
      default: "lagos",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDocument>("Order", orderSchema);
export default Order;
