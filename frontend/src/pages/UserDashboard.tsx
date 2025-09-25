import React, { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import type { TransactionData } from "../common/types";

const UserDashboard = () => {
  const { userData, refreshAuth } = useAuth();

  const [transactionData, setTransactionData] = useState<TransactionData>({
    amount: 0,
    remark: "",
  });

  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:3000/users/logout",
        {},
        { withCredentials: true }
      );
      navigate("/");
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
      <div className=" mx-40 mt-10 p-6 bg-gray-50 rounded-lg shadow-sm font-sans">
        <div className="flex flex-row items-center p-3 w-full mx-auto relative">
          <h2 className="text-2xl font-semibold  left-0">
            Welcome, {userData?.username}
          </h2>
          <button
            onClick={handleLogout}
            className="py-1.5 px-4 right-1 m-2 border rounded bg-gray-800 text-white hover:bg-gray-900 absolute"
          >
            Logout
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4 bg-gray-200 rounded-lg">
          <p>
            <strong>Email:</strong> {userData?.email}
          </p>
          <p>
            <strong>Username:</strong> {userData?.username}
          </p>
          <p>
            <strong>Account_number:</strong> {userData?.account_number}
          </p>
          <p>
            <strong>Balance:</strong> {userData?.balance}
          </p>
        </div>
      </div>
      <div className="max-w-md mx-auto mt-5 p-6 bg-gray-100 rounded-lg shadow-sm font-sans">
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
              className="flex-1 py-2 border rounded bg-green-600 text-white hover:bg-green-700"
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

export default UserDashboard;
