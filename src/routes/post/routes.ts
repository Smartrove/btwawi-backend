import express from 'express';
import { postValidationRules, createPostValidationRules, validate } from '../../middleware/validation/validator'
import { createPostHandler, deletePostHandler, getPostHandler, updatePostHandler } from '../../controller/post.controller';
const PostRouter = express.Router();

PostRouter.post('/create-post', createPostValidationRules(), validate, createPostHandler )
PostRouter.put('/:postId', postValidationRules(), validate, updatePostHandler)
PostRouter.delete('/:postId', deletePostHandler  )
PostRouter.get('/:postId', getPostHandler)

export default PostRouter;