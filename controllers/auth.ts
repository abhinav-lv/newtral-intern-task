import { Request, Response, NextFunction } from "express";
import { UserModel } from "../models/User";

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (req.session.user) next();
    else res.status(403).json("Unauthorized");
};

interface User {
    userId: String;
    name: String;
    picture: String;
    email: String;
}

export const authenticate = async (req: Request, res: Response) => {
    try {
        const obj = req.body;
        const access_token = obj.access_token;

        const rezz = await fetch(
            `https://www.googleapis.com/oauth2/v3/userinfo`,
            {
                headers: {
                    Authorization: `Bearer ${access_token}`,
                },
            }
        );
        const gUser = await rezz.json();
        const user: User = {
            userId: gUser.sub,
            name: gUser.name,
            picture: gUser.picture,
            email: gUser.email,
        };

        req.session.regenerate(async (err) => {
            if (err) {
                console.error(err);
                return;
            }
            req.session.user = user;
            try {
                let userExists = await UserModel.findOne({
                    userId: user.userId,
                });
                if (!userExists) {
                    const dbUser = new UserModel(user);
                    await dbUser.save();
                }
                res.status(200).json(user);
            } catch (err: any) {
                console.error(err.message);
                res.status(401).send("An error occurred during authentication");
            }
        });
    } catch (err: any) {
        console.error(err.message);
        res.status(401).send("An error occurred during authentication");
    }
};

export const authorize = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            res.status(200).json(req.session.user);
            console.log(req.session.user);
            return;
        }
        res.status(403).json("Unauthorized");
    } catch (err) {
        console.error(err);
        res.status(401).send("An error occurred during authorization");
    }
};

export const logout = async (req: Request, res: Response) => {
    try {
        if (req.session.user) {
            req.session.destroy((err: any) => {
                if (err) {
                    console.error(
                        err?.message || "There was an error while logging out."
                    );
                    res.status(500).json("Could not logout on server.");
                }
            });
        }
        res.status(200).json("Logged out successfully");
    } catch (err: any) {
        console.error(err?.message || "There was an error while logging out.");
        res.status(500).json("Could not logout on server.");
    }
};
