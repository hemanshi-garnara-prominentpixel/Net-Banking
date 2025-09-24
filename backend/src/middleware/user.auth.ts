import axios from "axios";
import { Request, Response, NextFunction } from "express";

export interface IAuthUser extends Request {
  user?: { id: number; email: string; username: string };
}
export const authenticateUser = async (
  req: IAuthUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies.accessToken;

    if (!token) return res.status(401).json({ error: "No token provided" });

    const authUser = await axios.get("https://dummyjson.com/user/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userData = authUser.data;
    if (!userData)
      return res.status(404).json({ error: "authUser not get from Url" });
    req.user = {
      id: userData.id,
      email: userData.email,
      username: userData.username,
    };

    next();
  } catch (error) {
    console.log("[Error in authenticateUser]", error);
    res.status(401).json({ error: "Unauthorized or invalid token" });
  }
};
