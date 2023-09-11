import { Request, Response } from "express";
import { TaskModel } from "../models/Task";
import { Types } from "mongoose";

export const addTask = async (req: Request, res: Response) => {
    try {
        const task = req.body;
        const dbTask = new TaskModel(task);
        await dbTask.save();
        res.status(200).json("Task added!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json("Couldn't add task to database");
    }
};

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.session.user.userId;
        const tasks = (await TaskModel.find({ userId: userId })) || [];
        const tasksObjs = tasks.map((task: any) => ({
            taskId: task._id.toString(),
            title: task.title,
            description: task.description,
            due: task.due,
            priority: task.priority,
            isCompleted: task.isCompleted,
        }));
        res.status(200).json(tasksObjs);
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json("Couldn't get tasks from database");
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const task = req.body;
        await TaskModel.updateOne(
            {
                _id: new Types.ObjectId(task.taskId),
            },
            task
        );
        res.status(200).json("Edited!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json("Couldn't get tasks from database");
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const task = req.body;
        await TaskModel.deleteOne({
            _id: new Types.ObjectId(task.taskId),
        });
        res.status(200).json("Deleted task successfully!");
    } catch (err: any) {
        console.error(err.message);
        res.status(500).json("Couldn't delete task in database");
    }
};
