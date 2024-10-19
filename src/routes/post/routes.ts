import express from 'express';
import { createPostValidationRules, validate } from '../../middleware/validation/validator'
import { createPostHandler, deletePostHandler, getAllPostsHandler, getPostHandler, updatePostHandler } from '../../controller/post.controller';
const PostRouter = express.Router();

PostRouter.post('/create-post', createPostValidationRules(), validate, createPostHandler )
PostRouter.get('/get/all-posts', getAllPostsHandler)
PostRouter.put('/update/:postId', validate, updatePostHandler)
PostRouter.delete('/:postId', deletePostHandler  )
PostRouter.get('/:postId', getPostHandler)

export default PostRouter;