import { DataTypes, UUIDV4 } from "sequelize";
import { sequelize } from "../config/db.connnection";

export const User = sequelize.define("User", {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
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
    defaultValue: 0,
    allowNull: false,
  },
  transaction_ids: {
    type: DataTypes.ARRAY(DataTypes.UUID),
    defaultValue: [],
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: "user",
    allowNull: false,
  },
});

console.log("in user table");
