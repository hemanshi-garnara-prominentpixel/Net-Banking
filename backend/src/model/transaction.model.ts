import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.connnection";

export const Transaction = sequelize.define("Transaction", {
  transaction_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  related_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  transaction_type: {
    type: DataTypes.ENUM("credit", "debit", "transfer", "received"),
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  remark: {
    type: DataTypes.STRING,
  },
  balance_after_transaction: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

console.log("in transaction table");
