import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {
  Registration,
  RegistrationDocument,
} from "../../model/registration.model";
import { omit } from "lodash";

export const createVolunteer = async (
  input: DocumentDefinition<RegistrationDocument>
) => {
  return await Registration.create(input);
};

export const validateWithEmail = async ({
  email,
}: {
  email: RegistrationDocument["email"];
}) => {
  const user = await Registration.findOne({ email });

  if (!user) {
    return false;
  }

  return omit(user.toJSON(), "password");
};

export const findVolunteer = async (
  query: FilterQuery<RegistrationDocument>,
  options: QueryOptions = {}
) => {
  return await Registration.findOne(query, options).lean();
};

export const findVolunteers = async (
  query: FilterQuery<RegistrationDocument>,
  options: QueryOptions
) => {
  return await Registration.find(query, options).lean();
};

export const findAndUpdate = async (
  query: FilterQuery<RegistrationDocument>,
  update: UpdateQuery<RegistrationDocument>,
  options: QueryOptions
) => {
  return await Registration.findOneAndUpdate(query, update, options);
};
