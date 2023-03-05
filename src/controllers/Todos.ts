import { NextFunction, Request, Response } from 'express';
import Users from '../models/Users';
import Todos from '../models/Todos';
import { PaginatedResponse, UserRequest } from './Users';

// Add todo
const addTodo = async (req: UserRequest, res: Response, next: NextFunction) => {
    const { title, isCompleted = false } = req.body;
    const userId = req?.user?.userId;

    const addNewTodo = new Todos({title, isCompleted, userId});

    return Users.find({_id: userId})
        .then((user: any) => {
            if(!user.length) {
                res.status(500).json({message: {
                    msgBody: 'Sorry! no user detail found.',
                    msgError: true
                }})
            } else {
                Todos.find({title})
                    .then((todo: any) => {
                        if(todo.length) {
                            res.status(500).json({message: {
                                msgBody: 'Sorry! Todo with this title is already created.',
                                msgError: true
                            }})
                        } else {
                            addNewTodo.save()
                                .then(() => res.status(200).json({message: {
                                    msgBody: 'Todo created',
                                    msgError: false
                                }}))
                                .catch(err => res.status(400).json({message: {
                                    msgBody: 'Unable to save todo',
                                    msgError: true
                                }}))
                        }
                    })
                    .catch((err: any) => res.status(400).json({message: {
                        msgBody: 'Something went wrong',
                        msgErrorDesc: `${err}`,
                        msgError: true
                    }}))
            }
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
                
}

// Get users all todo
const getUserTodo = (req: Request, res: PaginatedResponse, next: NextFunction) => {
    const userId = req.params.userId;
    
    return Todos.find({userId})
        .then((todo: any) => {
            res.status(200).json(res.paginatedResults)
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
}

// Edit todo using todoId
const editTodo = async (req: Request, res: Response, next: NextFunction) => {
    let todoId = req.params.todoId

    return Todos.findById({_id: todoId})
        .then((todo: any) => {
            if(todo) {
                todo.set(req.body);

                return todo
                    .save()
                    .then((todo: any) => {
                        res.status(200).json({message: {
                            msgBody: 'Todo updated successfully!',
                            msgError: false,
                            todo
                        }})
                    })
                    .catch((err: any) => res.status(400).json({message: {
                        msgBody: 'Something went wrong',
                        msgErrorDesc: `${err}`,
                        msgError: true
                    }}))
            } else {
                res.status(404).json({message: {
                    msgBody: 'Todo not found',
                    msgError: true,
                }})
            }
            
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
}

// Delete todo
const deleteTodo = async (req: Request, res: Response, next: NextFunction) => {
    let todoId = req.params.todoId

    return Todos.findByIdAndDelete({_id: todoId})
        .then((todo: any) => {
            if(todo) {
                res.status(200).json({message: {
                    msgBody: 'Todo deleted successfully!',
                    msgError: false,
                }})
            } else {
                res.status(404).json({message: {
                    msgBody: 'Todo not found',
                    msgError: true,
                }})
            }
            
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
}

export default { addTodo, getUserTodo, editTodo, deleteTodo };