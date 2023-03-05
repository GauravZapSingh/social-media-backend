import mongoose, { Document, Schema } from "mongoose";

export interface IPost {
    title: string;
    body: string;
    userId: string;
    comments: any[];
}

export interface IComment {
    user: string;
    body: string;
}

export interface IPostModel extends IPost, Document {}
export interface ICommentModel extends IComment, Document {}

const CommentSchema: Schema = new Schema({
    user: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    body: { 
        type: String, 
        required: true 
    }
  });

const PostSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    body: {
        type: String,
        required: [true, "Body is required"]
    },
    userId: {
        type: String,
        required: true
    },
    comments: [CommentSchema]
},
{
    timestamps: true,
    versionKey: false
})

export const Posts = mongoose.model<IPostModel>('Post', PostSchema);
export const Comments = mongoose.model<ICommentModel>('Comment', CommentSchema);