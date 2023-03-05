import { NextFunction, Request, Response } from 'express';
import Users from '../models/Users';
import { Posts, Comments, IComment } from '../models/Posts';
import { PaginatedResponse, UserRequest } from './Users';

// Create new post
const addPost = (req: UserRequest, res: Response, next: NextFunction) => {
    const { title, body } = req.body;
    const userId = req?.user?.userId;

    const addNewPost = new Posts({title, body, userId});

    return Users.find({_id: userId})
        .then((user: any) => {
            if(!user.length) {
                res.status(500).json({message: {
                    msgBody: 'Sorry! no user detail found.',
                    msgError: true
                }})
            } else {
                Posts.find({title})
                    .then((post: any) => {
                        if(post.length) {
                            res.status(500).json({message: {
                                msgBody: 'Sorry! Post with this title is already created.',
                                msgError: true
                            }})
                        } else {
                            addNewPost.save()
                                .then(() => res.status(200).json({message: {
                                    msgBody: 'Post created',
                                    msgError: false
                                }}))
                                .catch(err => res.status(400).json({message: {
                                    msgBody: 'Unable to save post',
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

// Get users all post using userId
const getUserPost = (req: Request, res: PaginatedResponse, next: NextFunction) => {
    const userId = req.params.userId
    
    return Posts.find({userId})
        .then((post: any) => {
            res.status(200).json(res.paginatedResults)
        })
        .catch((err: any) => res.status(400).json({message: {
            msgBody: 'Something went wrong',
            msgErrorDesc: `${err}`,
            msgError: true
        }}))
}

// Get post using postId
const getUserPostWitdId = async (req: Request, res: Response, next: NextFunction) => {
    let postId = req.params.postId

    return Posts.findById({_id: postId})
        .then((post: any) => {
            if(post) {
                res.status(200).json({message: {
                    msgBody: 'Post fetched successfully!',
                    msgError: false,
                    post
                }})
            } else {
                res.status(404).json({message: {
                    msgBody: 'Post not found',
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

// Edit Post
const editPost = async (req: Request, res: Response, next: NextFunction) => {
    let postId = req.params.postId

    return Posts.findById({_id: postId})
        .then((post: any) => {
            if(post) {
                post.set(req.body);

                return post
                    .save()
                    .then((post: any) => {
                        res.status(200).json({message: {
                            msgBody: 'Post updated successfully!',
                            msgError: false,
                            post
                        }})
                    })
                    .catch((err: any) => res.status(400).json({message: {
                        msgBody: 'Something went wrong',
                        msgErrorDesc: `${err}`,
                        msgError: true
                    }}))
            } else {
                res.status(404).json({message: {
                    msgBody: 'Post not found',
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

// Add a comment to post using postId
const addComment = (req: UserRequest, res: Response, next: NextFunction) => {
    let postId = req.params.postId;
    const { body } = req.body;
    const userId = req?.user?.userId;

    return Posts.findById({_id: postId})
        .then((post: any) => {
            if(post) {
                const comment: IComment = new Comments({body: body});
                if (userId) {
                    comment.user = userId;
                }
              
                post.comments.push(comment);
                return post
                    .save()
                    .then((post: any) => {
                        res.status(200).json({message: {
                            msgBody: 'Comment added successfully!',
                            msgError: false,
                            post
                        }})
                    })
                    .catch((err: any) => res.status(400).json({message: {
                        msgBody: 'Something went wrong',
                        msgErrorDesc: `${err}`,
                        msgError: true
                    }}))
            } else {
                res.status(404).json({message: {
                    msgBody: 'Post not found',
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

// Delete post
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    let postId = req.params.postId

    return Posts.findByIdAndDelete({_id: postId})
        .then((post: any) => {
            if(post) {
                res.status(200).json({message: {
                    msgBody: 'Post deleted successfully!',
                    msgError: false,
                }})
            } else {
                res.status(404).json({message: {
                    msgBody: 'Post not found',
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

export default { addPost, getUserPost, getUserPostWitdId, editPost, deletePost, addComment };