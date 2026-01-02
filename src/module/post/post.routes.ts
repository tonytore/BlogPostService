import { Router } from 'express';

import {
  getAllPost,
  getAllPostBySlug,
  getPostByStatus,
} from '@/module/post/post.controller';

const postRoutes = Router();

// Define your post routes here
postRoutes.get('/', getAllPost);
postRoutes.get('/:status', getPostByStatus);
postRoutes.get('/:slug', getAllPostBySlug);

export default postRoutes;
