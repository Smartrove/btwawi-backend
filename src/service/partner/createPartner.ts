import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import { Partner, PartnerDocument } from "../../model/partner.model";
import { omit } from "lodash";

export const createPartner = async (
  input: DocumentDefinition<PartnerDocument>
) => {
  return await Partner.create(input);
};

export const validateWithEmail = async ({
  email,
}: {
  email: PartnerDocument["email"];
}) => {
  const user = await Partner.findOne({ email });

  if (!user) {
    return false;
  }

  return omit(user.toJSON(), "password");
};

export const findPartner = async (
  query: FilterQuery<PartnerDocument>,
  options: QueryOptions = {}
) => {
  return await Partner.findOne(query, options).lean();
};

export const findPartners = async (
  query: FilterQuery<PartnerDocument>,
  options: QueryOptions
) => {
  return await Partner.find(query, options).lean();
};

export const findAndUpdatePartner = async (
  query: FilterQuery<PartnerDocument>,
  update: UpdateQuery<PartnerDocument>,
  options: QueryOptions
) => {
  return await Partner.findOneAndUpdate(query, update, options);
};
