import { Router } from "express";
import {
  creditAmount,
  debitAmount,
  transferAmount,
} from "../controller/transaction.controller";
import { authenticateUser } from "../middleware/user.auth";

export const transactionRouter = Router();

transactionRouter.post("/credit", authenticateUser, creditAmount);
transactionRouter.post("/debit", authenticateUser, debitAmount);
transactionRouter.post("/transfer", authenticateUser, transferAmount);
