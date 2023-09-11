import mongoose from "mongoose";
const { Schema } = mongoose;

const TaskSchema = new Schema({
    userId: {
        type: String,
        required: true,
    },
    title: String,
    description: String,
    due: String,
    priority: String,
    isCompleted: Boolean,
});

export const TaskModel = mongoose.model("Task", TaskSchema);
