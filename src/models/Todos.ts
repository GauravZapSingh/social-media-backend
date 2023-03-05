import mongoose, { Document, Schema } from "mongoose";

export interface ITodo {
    title: string,
    isCompleted: boolean,
    userId: string
}

export interface ITodoModel extends ITodo, Document {}

const TodoSchema: Schema = new Schema({
    title: {
        type: String,
        required: [true, "Title is required"]
    },
    isCompleted: {
        type: Boolean,
        required: false
    },
    userId: {
        type: String,
        required: true
    }
},
{
    versionKey: false
})

export default mongoose.model<ITodoModel>('Todo', TodoSchema);