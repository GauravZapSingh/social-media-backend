import { NextFunction, Request, Response } from "express";
import { UserRequest } from "../controllers/Users";
import { Posts } from "../models/Posts";
import Todos from "../models/Todos";

export const canEditTodo = (req: UserRequest, res: Response, next: NextFunction) => {
    const todoId = req.params.todoId;
    console.log("req ",req.user)
    const userId = req?.user?.userId;
    const role = req?.user?.role;
  
    Todos.findById(todoId)
        .then((todo: any) => {
            if (!todo) {
                return res.status(404).json({ message: 'Todo not found' });
            }
            if(role === 'admin') {
                return next();
            }
            console.log("hmm todo",todo.userId, userId)
            if (todo.userId !== userId) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
};

export const canEditPost = (req: UserRequest, res: Response, next: NextFunction) => {
    const postId = req.params.postId;
    const userId = req?.user?.userId;
    const role = req?.user?.role;
  
    Posts.findById(postId)
        .then((post: any) => {
            if (!post) {
                return res.status(404).json({ message: 'Post not found' });
            }
            if(role === 'admin') {
                return next();
            }
            console.log("hmm ",post.userId, userId)
            if (post.userId !== userId) {
                return res.status(403).json({ message: 'Forbiddenas' });
            }
            next();
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
};

export const isAdmin = (req: UserRequest, res: Response, next: NextFunction) => {
    const role = req?.user?.role;
  
    if(role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
    }
    next();
};