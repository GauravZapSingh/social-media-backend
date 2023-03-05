import express from 'express';
import userController from '../controllers/Users';
import todoController from '../controllers/Todos';
import postController from '../controllers/Posts';
import pagination from '../middleware/pagination';
import { requireUser } from '../middleware/requireUser';
import Users from '../models/Users';
import Todos from '../models/Todos';
import { Posts } from '../models/Posts';
import { canEditPost, canEditTodo, isAdmin } from '../middleware/editAuth';
import { cacheMiddleware } from '../middleware/cacheData';

const router = express.Router();

router.post('/user/signup', userController.signUp);
router.post('/user/login', userController.login);
router.delete('/user/logout', userController.logout);
router.get('/user/getAllUsers', requireUser, isAdmin, cacheMiddleware, pagination(Users), userController.getAllUsers);

// User's todo
router.post('/addTodo', requireUser, todoController.addTodo);
router.get('/:userId/todos', requireUser, cacheMiddleware, pagination(Todos), todoController.getUserTodo);
router.put('/:userId/updateTodo/:todoId', requireUser, canEditTodo, todoController.editTodo);
router.delete('/:userId/deleteTodo/:todoId', requireUser, canEditTodo, todoController.deleteTodo);

// User's post
router.post('/addPost', requireUser, postController.addPost);
router.get('/:userId/posts', requireUser, pagination(Posts), postController.getUserPost);
router.get('/:userId/posts/:postId', requireUser, postController.getUserPostWitdId);
router.put('/:userId/updatePost/:postId', requireUser, canEditPost, postController.editPost);
router.delete('/:userId/deletePost/:postId', requireUser, canEditPost, postController.deletePost);
router.post('/:userId/comment/:postId', requireUser, postController.addComment);

export = router;