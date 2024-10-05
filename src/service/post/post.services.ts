import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import Post, { PostDocument } from "../../model/post.model";

export function createPost(input: DocumentDefinition<PostDocument>) {
  return Post.create(input);
}

export function findPost(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true }
) {
  return Post.findOne(query, {}, options);
}
export function findPosts(
  query: FilterQuery<PostDocument>,
  options: QueryOptions = { lean: true },
  limit: number = 10,
  skip: number = 0
) {
  return Post.find(query, {}, options).limit(limit).skip(skip);
}

export function findAndUpdate(
  query: FilterQuery<PostDocument>,
  update: UpdateQuery<PostDocument>,
  options: QueryOptions
) {
  return Post.findOneAndUpdate(query, update, options);
}

export function deletePost(query: FilterQuery<PostDocument>) {
  return Post.deleteOne(query);
}
