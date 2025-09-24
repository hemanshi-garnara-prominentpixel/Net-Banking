import axios from "axios";
import { Request, Response } from "express";
import https from "https";
import { IAuthUser } from "../middleware/user.auth";

const agent = new https.Agent({ family: 4 });

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "username and password required" });
    }

    const getLoginData = await axios.post(
      "https://dummyjson.com/user/login",
      {
        username,
        password,
        expiresInMins: 60,
      },
      { httpsAgent: agent }
    );

    const Logindata = getLoginData.data;
    const accessToken = Logindata.accessToken;

    if (!Logindata || !accessToken)
      return res.status(400).json({ error: "Invalid username and password" });

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login Sucessfully!!!",
      user: {
        username: Logindata.username,
        email: Logindata.email,
        firstName: Logindata.firstName,
        lastName: Logindata.lastName,
        gender: Logindata.gender,
        image: Logindata.image,
      },
    });
  } catch (error) {
    console.log("[Errror in UserLogin]", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req: IAuthUser, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const { id, email, username } = req.user;
    res.status(200).json({ id, email, username });
  } catch (error) {
    console.error("Error in currentUser:", error);
    return res.status(500).json({ error: "Server error" });
  }
};
export const dashboard = (req: IAuthUser, res: Response) => {
  const email = req.user?.email;
  res.status(200).json({ message: `Welcome ${email}` });
};
