import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  AttendeeUser,
  AttendeeUserDocument,
  User,
  UserWithRoleDocument,
  VendorUser,
  VendorUserDocument,
} from "../../model/user.model";
import { omit } from "lodash";

export const createUserWithRole = async (
  input: DocumentDefinition<UserWithRoleDocument>
) => {
  return await User.create(input);
};
export const createUser = async (
  input: DocumentDefinition<AttendeeUserDocument>
) => {
  return await AttendeeUser.create(input);
};

export const createVendorUser = async (
  input: DocumentDefinition<VendorUserDocument>
) => {
  return await VendorUser.create(input);
};

export const validateWithEmail = async ({
  email,
}: {
  email: AttendeeUserDocument["email"];
}) => {
  const user = await AttendeeUser.findOne({ email });

  if (!user) {
    return false;
  }

  return omit(user.toJSON(), "password");
};

export const findUser = async (
  query: FilterQuery<AttendeeUserDocument>,
  options: QueryOptions = {}
) => {
  return await AttendeeUser.findOne(query, options).lean();
};
export const findUserWithRole = async (
  query: FilterQuery<UserWithRoleDocument>,
  options: QueryOptions = {}
) => {
  return await AttendeeUser.findOne(query, options).lean();
};

export const findVendorUser = async (
  query: FilterQuery<VendorUserDocument>,
  options: QueryOptions = {}
) => {
  return await VendorUser.findOne(query, options).lean();
};

export const findUsers = async (
  query: FilterQuery<AttendeeUserDocument>,
  options: QueryOptions
) => {
  return await AttendeeUser.find(query, options).lean();
};
export const findVendorUsers = async (
  query: FilterQuery<VendorUserDocument>,
  options: QueryOptions
) => {
  return await VendorUser.find(query, options).lean();
};

export const findAndUpdate = async (
  query: FilterQuery<AttendeeUserDocument>,
  update: UpdateQuery<AttendeeUserDocument>,
  options: QueryOptions
) => {
  return await AttendeeUser.findOneAndUpdate(query, update, options);
};

export const findAndUpdateVendor = async (
  query: FilterQuery<VendorUserDocument>,
  update: UpdateQuery<VendorUserDocument>,
  options: QueryOptions
) => {
  return await VendorUser.findOneAndUpdate(query, update, options);
};
