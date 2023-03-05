import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    password: string;
    role: string;
}

export interface IUserModel extends IUser, Document {}

const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const validateEmail = function(email: string) {
    return regex.test(email)
};

const UsersSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
        lowercase: true, 
        unique: true,
        validate: [validateEmail, 'Please fill a valid email address'],
        match: [regex, 'Please fill a valid email address']
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        default: 'user'
    }
},
{
    timestamps: true,
    versionKey: false
})

export default mongoose.model<IUserModel>('User', UsersSchema);