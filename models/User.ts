import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
    userId: {
        type: String,
        required: true,
        index: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    picture: String,
    email: String,
});
export const UserModel = mongoose.model("User", userSchema);
