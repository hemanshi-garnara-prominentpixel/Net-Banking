import React, { useState } from "react";
import type { TransactionData } from "../common/types";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../context/AuthProvider";

const TransactionForm = () => {
  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0,
    remark: "",
  });

  const { refreshAuth } = useAuth();

  const handleTransaction = async (type: "credit" | "debit") => {
    if (transactionData.amount <= 0) {
      toast.error("Add positive amount!!!");
      return;
    }
    try {
      const transaction = await axios.post(
        `http://localhost:3000/transactions/${type}`,
        transactionData,
        { withCredentials: true }
      );

      toast.success(transaction.data.message);
      setTransactionData({ amount: 0, remark: "" });
      refreshAuth();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data?.error) {
          toast.error(error.response.data.error);
          return;
        } else {
          toast.error(error.message);
        }
      } else {
        toast.error("Something went wrong!");
      }
    }
  };
  return (
    <>
      <div className="max-w-md mx-auto mt-5 p-6 bg-gray-200 rounded-lg shadow-sm font-sans">
        <form
          className="flex flex-col mt-3"
          onSubmit={(e) => e.preventDefault()}
        >
          <h3 className="text-2xl font-semibold text-center ">Transaction</h3>

          <label className="mb-1">Amount:</label>
          <input
            type="number"
            value={transactionData.amount}
            onChange={(e) =>
              setTransactionData((prev) => ({
                ...prev,
                amount: Number(e.target.value),
              }))
            }
            className="w-full p-2 border rounded mb-3"
          />

          <label className="mb-1">Remark:</label>
          <input
            type="text"
            value={transactionData.remark}
            onChange={(e) =>
              setTransactionData((prev) => ({
                ...prev,
                remark: e.target.value,
              }))
            }
            className="w-full p-2 border rounded mb-3"
          />

          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleTransaction("credit")}
              className="flex-1 py-2 border rounded bg-gray-800 text-white hover:bg-gray-900"
            >
              Credit
            </button>
            <button
              type="button"
              onClick={() => handleTransaction("debit")}
              className="flex-1 py-2 border rounded bg-red-600 text-white hover:bg-red-700"
            >
              Debit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default TransactionForm;
