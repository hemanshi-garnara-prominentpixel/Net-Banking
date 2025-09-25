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

    await Transaction.create(
      {
        user_id: user.user_id,
        transaction_type: "credit",
        amount,
        remark: remark || "",
        balance_after_transaction: newBalance,
      },
      { transaction }
    );

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

    await Transaction.create(
      {
        user_id: user.user_id,
        transaction_type: "debit",
        amount,
        remark: remark || "",
        balance_after_transaction: newBalance,
      },
      { transaction }
    );

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

export const transferAmount = async (req: IAuthUser, res: Response) => {
  const { account_number, amount, remark } = req.body;

  const email = req.user?.email;

  if (!email) return res.status(401).json({ error: "Unauthorized" });
  if (!account_number || !amount)
    return res
      .status(400)
      .json({ error: " Account_number and amount are required!!!" });

  const transaction = await sequelize.transaction();
  try {
    const sender = await User.findOne({ where: { email }, transaction });

    if (account_number === sender.account_number)
      return res
        .status(401)
        .json({ error: "Don't enter your account number!!" });
    if (!sender) throw new Error("User not found!!!");

    if (Number(amount) > Number(sender.balance))
      throw new Error("Amount is greter than your balance");

    const receiver = await User.findOne({
      where: { account_number },
      transaction,
    });

    if (!receiver) throw new Error("receiver not found!!!");

    const senderBalance = Number(sender.balance) - Number(amount);
    sender.balance = senderBalance;
    await sender.save({ transaction });

    const receiverBalance = Number(receiver.balance) + Number(amount);
    receiver.balance = receiverBalance;
    await receiver.save({ transaction });

    await Transaction.create(
      {
        user_id: sender.user_id,
        related_user_id: receiver.user_id,
        transaction_type: "transfer",
        amount,
        remark: remark || "",
        balance_after_transaction: senderBalance,
      },
      { transaction }
    );

    await Transaction.create(
      {
        user_id: receiver.user_id,
        related_user_id: sender.user_id,
        transaction_type: "received",
        amount,
        remark: remark || "",
        balance_after_transaction: receiverBalance,
      },
      { transaction }
    );

    await transaction.commit();

    res.status(200).json({
      message: "Transfer successful",
      sender_balance: senderBalance,
      receiver_balance: receiverBalance,
    });
  } catch (error) {
    await transaction.rollback();

    console.log("[Error transferAmount]", error);
    let message = "Something went wrong";
    if (error instanceof Error) message = error.message;
    res.status(400).json({ error: message });
  }
};
