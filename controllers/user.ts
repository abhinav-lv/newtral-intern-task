import { Request, Response } from "express";

export const getUser = (req: Request, res: Response) => {
    res.json(req.session.user);
};
