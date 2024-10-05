import { throws } from "assert";
import { Request, Response } from "express";
import { get } from "lodash";
import log from "../logger";
import {
  createPost,
  findPost,
  findAndUpdate,
  deletePost,
  findPosts,
} from "../service/post/post.services";

export const createPostHandler = async (req: Request, res: Response) => {
  try {
    const body = req.body;

    const post = await createPost({ ...body });

    return res.send(post);
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const updatePostHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const postId = get(req, "params.postId");
    const update = req.body;

    const post = await findPost({ postId });

    if (!post) {
      return res.sendStatus(404);
    }

    const updatedPost = await findAndUpdate({ postId }, update, { new: true });

    return res.send(updatedPost);
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getPostHandler = async (req: Request, res: Response) => {
  try {
    const postId = get(req, "params.postId");
    const post = await findPost({ postId });

    if (!post) {
      return res.sendStatus(404);
    }

    return res.send(post);
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const getAllPostsHandler = async (req: Request, res: Response) => {
  console.log("controller innit");
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = parseInt(req.query.skip as string) || 0;

    const post = await findPosts({}, { lean: true }, limit, skip);

    return res.status(200).json({
      message: "Resource fetched successfully",
      post,
    });
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};

export const deletePostHandler = async (req: Request, res: Response) => {
  try {
    const userId = get(req, "user._id");
    const postId = get(req, "params.postId");

    const post = await findPost({ postId });

    if (!post) {
      return res.sendStatus(404);
    }

    await deletePost({ postId });

    return res.sendStatus(200);
  } catch (err) {
    //log error with logger which doesn't block i/o like console.log does
    log.error(err);
    return res.status(500).json({
      status: 500,
      message: "Ops something went wrong. Please try again later!!",
    });
  }
};
