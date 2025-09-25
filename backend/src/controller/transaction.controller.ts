import { Request, Response } from "express";
import { IAuthUser } from "../middleware/user.auth";
import { sequelize } from "../config/db.connnection";
import { User } from "../model/user.model";
import { Transaction } from "../model/transaction.model";

export const creditAmount = async (req: IAuthUser, res: Response) => {
  const { amount, remark } = req.body;
  const email = req.user?.email;

  if (!email) return res.status(401).json({ error: "Unauthorized" });
  if (!amount) return res.status(400).json({ error: "Amount is required!!!" });

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("User not found!!!");

    const newBalance = Number(user.balance) + Number(amount);

    user.balance = newBalance;
    await user.save({ transaction });

    const newTransaction = await Transaction.create(
      {
        user_id: user.user_id,
        transaction_type: "credit",
        amount,
        remark: remark || "",
        balance_after_transaction: newBalance,
      },
      { transaction }
    );

    user.transaction_ids = [
      ...user.transaction_ids,
      newTransaction.transaction_id,
    ];

    await user.save({ transaction });
    await transaction.commit();

    res
      .status(200)
      .json({ message: "Amount credited successfully", balance: newBalance });
  } catch (error) {
    await transaction.rollback();
    console.log("[Error debitAmount]", error);

    let message = "Something went wrong";
    if (error instanceof Error) message = error.message;

    res.status(400).json({ error: message });
  }
};

export const debitAmount = async (req: IAuthUser, res: Response) => {
  const { amount, remark } = req.body;

  const email = req.user?.email;

  if (!email) return res.status(401).json({ error: "Unauthorized" });
  if (!amount) return res.status(400).json({ error: "Amount is required!!!" });

  const transaction = await sequelize.transaction();

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) throw new Error("User not found!!!");

    if (Number(amount) > Number(user.balance))
      throw new Error("Amount is greter than your balance");

    const newBalance = Number(user.balance) - Number(amount);

    user.balance = newBalance;
    await user.save({ transaction });

    const newTransaction = await Transaction.create(
      {
        user_id: user.user_id,
        transaction_type: "debit",
        amount,
        remark: remark || "",
        balance_after_transaction: newBalance,
      },
      { transaction }
    );

    user.transaction_ids = [
      ...user.transaction_ids,
      newTransaction.transaction_id,
    ];

    await user.save({ transaction });
    await transaction.commit();

    res
      .status(200)
      .json({ message: "Amount debited successfully", balance: newBalance });
  } catch (error) {
    await transaction.rollback();

    console.log("[Error debitAmount]", error);
    let message = "Something went wrong";
    if (error instanceof Error) message = error.message;
    res.status(400).json({ error: message });
  }
};
