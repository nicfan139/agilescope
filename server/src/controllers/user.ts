import { Request, Response } from "express";
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { User } from "../models";
import { omit, sendEmail } from "../utils";

dotenv.config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;

const UserController = {
  createUser: async (req: Request, res: Response) => {
    const hashedPassword = await bcrypt.hash(req.body.password, JWT_SECRET_KEY);
    const hashedEmailVerifyToken = await bcrypt.hash(
      req.body.email,
      Number(process.env.BCRYPT_SALT_ROUNDS)
    );

    if (hashedPassword && hashedEmailVerifyToken) {
      const payload = {
        ...req.body,
        password: hashedPassword,
        emailVerifyToken: hashedEmailVerifyToken
      };
      const user = await User.create(payload);
      
      if (user) {        
        await sendEmail({
          to: user.email,
          type: 'verifyEmail',
          payload: hashedEmailVerifyToken
        })

        res.json(201).json(omit(user, ['password']));
      } else {
        res.status(500).json({
          errorMessage: 'Unable to create user'
        });
      }
    } else {
      res.status(500).json({
        errorMessage: 'Unable to create user'
      });
    }
  },

  getUser: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });

    if (user) {
      res.status(200).json(omit(user, ['password']));
    } else {
      res.status(400).json({
        errorMessage: 'User does not exist'
      });
    }
  },

  updateUser: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, req.body, { returnDocument: 'after' });

    if (user) {
      res.status(200).json(omit(user, ['password']));
    } else {
      res.status(500).json({
        errorMessage: 'Unable to update user'
      });
    }
  }
}

export default UserController