import { sequelize } from "../config/db.connnection";
import { Transaction } from "./transaction.model";
import { User } from "./user.model";

User.hasMany(Transaction, { foreignKey: "user_id" });
Transaction.belongsTo(User, { foreignKey: "user_id" });

export { User, Transaction };

export const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("DB connected sucessfully");

    await sequelize.sync();
    console.log("All models were synchronized successfully");
  } catch (error) {
    console.log("[Error syncDataBase]", error);
  }
};



console.log("in association table");
