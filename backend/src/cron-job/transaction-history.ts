import { CronJob } from "cron";
import { User } from "../model/user.model";
import PDFDocument from "pdfkit";
import fs from "fs";
import { Transaction } from "../model/transaction.model";
import path from "path";

const reportsDir = path.join(__dirname, "../../transaction-history");
if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true });

export const cronJob = new CronJob(
  "*/10 * * * *",
  async () => {
    console.log("[CRON-job start!!!]");
    try {
      const users = await User.findAll();
      if (users.length === 0) return;

      const pdf = new PDFDocument({ margin: 30 });
      const filename = path.join(reportsDir, `transactions-${Date.now()}.pdf`);
      pdf.pipe(fs.createWriteStream(filename));

      pdf
        .fontSize(22)
        .text("All Users Transaction History", { align: "center" });
      pdf.moveDown(2);

      for (const user of users) {
        const transactions = await Transaction.findAll({
          where: { user_id: user.user_id },
          include: [
            {
              model: User,
              as: "relatedUser",
              attributes: ["username", "email"],
            },
          ],
          order: [["timestamp", "DESC"]],
        });

        if (transactions.length === 0) continue;

        pdf.fontSize(16).text(`User: ${user.username}`, { underline: true });
        pdf.moveDown(0.5);

        transactions.forEach((ts) => {
          let text = `${ts.timestamp.toISOString()} || ${ts.transaction_type.toUpperCase()} || Amount: ${
            ts.amount
          } || Balance: ${ts.balance_after_transaction}`;

          if (ts.relatedUser)
            text += ` || ${
              ts.transaction_type === "transfer" ? "To" : "From"
            }: ${ts.relatedUser.username}`;

          if (ts.remark) text += ` || Remark: ${ts.remark}`;

          pdf.fontSize(12).text(text);
          pdf.moveDown(0.4);
        });

        pdf.moveDown(1);
      }

      pdf.end();

      console.log("[PDF completed!!!]");
    } catch (err) {
      console.error("[CRON-job error]", err);
    }
  },
  null,
  true
);
