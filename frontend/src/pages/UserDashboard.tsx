import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import TransactionForm from "../components/TransactionForm";
import TransferForm from "../components/TransferForm";

const UserDashboard = () => {
  const { userData } = useAuth();

  // const [transactionData, setTransactionData] = useState<TransactionData>({
  //   amount: 0,
  //   remark: "",
  // });

  const navigate = useNavigate();

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
      <div className=" mx-20 mt-10 p-6 bg-gray-900 rounded-lg shadow-sm ">
        <div className="flex flex-row items-center p-3 w-full mx-auto relative">
          <h2 className="text-2xl text-white font-semibold  left-0">
            Welcome, {userData?.username}
          </h2>
          <button
            onClick={handleLogout}
            className="py-1.5 px-4 right-1 m-2 border rounded bg-red-600 text-white hover:bg-red-700 absolute"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-6 bg-gray-200 rounded-lg mx-40 mt-6 shadow-sm">
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
      <div className="flex flex-col md:flex-row gap-4 max-w-5xl mx-auto mt-5 mb-10">
        <div className="flex-1">
          <TransactionForm />
        </div>
        <div className="flex-1">
          <TransferForm />
        </div>
      </div>
    </>
  );
};

export default UserDashboard;
