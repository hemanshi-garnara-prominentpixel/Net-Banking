import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import type { TransferData } from "../common/types";
import { useAuth } from "../context/AuthProvider";

const TransferForm: React.FC = () => {
  const [transferData, setTransferData] = useState<TransferData>({
    account_number: "",
    amount: 0,
    remark: "",
  });

  const { refreshAuth } = useAuth();
  const handleTransfer = async () => {
    if (transferData.amount <= 0 || !transferData.account_number) {
      toast.error("Fill account number and positive amount!!!");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:3000/transactions/transfer",
        transferData,
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setTransferData({ account_number: "", amount: 0, remark: "" });
      refreshAuth();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.error || error.message);
      } else {
        toast.error("Something went wrong!");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-5 p-6 bg-gray-200 rounded-lg shadow-sm font-sans">
      <form className="flex flex-col mt-3" onSubmit={(e) => e.preventDefault()}>
        <h3 className="text-2xl font-semibold text-center">Transfer</h3>

        <label className="mb-1">Account Number:</label>
        <input
          type="text"
          value={transferData.account_number}
          onChange={(e) =>
            setTransferData((prev) => ({
              ...prev,
              account_number: e.target.value,
            }))
          }
          className="w-full p-2 border rounded mb-3"
        />

        <label className="mb-1">Amount:</label>
        <input
          type="number"
          value={transferData.amount}
          onChange={(e) =>
            setTransferData((prev) => ({
              ...prev,
              amount: Number(e.target.value),
            }))
          }
          className="w-full p-2 border rounded mb-3"
        />

        <label className="mb-1">Remark:</label>
        <input
          type="text"
          value={transferData.remark}
          onChange={(e) =>
            setTransferData((prev) => ({
              ...prev,
              remark: e.target.value,
            }))
          }
          className="w-full p-2 border rounded mb-3"
        />

        <button
          type="button"
          onClick={handleTransfer}
          className="w-full py-2 border rounded bg-red-600 text-white hover:bg-red-700"
        >
          Transfer
        </button>
      </form>
    </div>
  );
};

export default TransferForm;
