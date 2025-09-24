const { Sequelize } = require("sequelize");

export const sequelize = new Sequelize(
  process.env.PGDATABASE,
  process.env.PGUSER,
  process.env.PGPASSWORD,
  {
    host: process.env.PGHOST,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 7,
      acquire: 2000,
      idle: 10000,
    },
  }
);

console.log("in connection file");
