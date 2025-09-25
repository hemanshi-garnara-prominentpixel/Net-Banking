import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../config/db.connnection";

export const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    unique: true,
    validate: { isEmail: true },
    allowNull: false,
  },
  account_number: {
    type: DataTypes.UUID,
    defaultValue: UUIDV4,
    unique: true,
    allowNull: false,
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 1000,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
    allowNull: false,
  },
});

console.log("in user table");
