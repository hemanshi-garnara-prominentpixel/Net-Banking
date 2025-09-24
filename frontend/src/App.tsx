import React from "react";
import NetBankingRoutes from "./routes/NetBankingRoutes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthProvider from "./context/AuthProvider";
const App = () => {
  return (
    <>
      <AuthProvider>
        <NetBankingRoutes />
      </AuthProvider>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </>
  );
};

export default App;
