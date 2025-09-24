import React, { useState } from "react";
import type { LoginData } from "../common/types";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const Login: React.FC = () => {
  const [loginData, setLoginData] = useState<LoginData>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const { username, password } = loginData;
    if (!username || !password) {
      toast.error("All fields are required!");
      return false;
    }
    return true;
  };

  const handleLoginData = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!validateForm()) return;

      const user = await axios.post(
        "http://localhost:3000/users/login",
        loginData,
        {
          withCredentials: true,
        }
      );

      if (!user) {
        toast.error("user not found!!!");
        return;
      }

      toast.success("Login Sucessfully!");
      await refreshAuth();
      navigate("/dashboard");
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
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <form onSubmit={handleLoginData}>
        <h2>Login</h2>
        <label>Username </label>
        <input
          type="text"
          name="username"
          value={loginData.username}
          onChange={handleChange}
        />
        <br />
        <br />
        <label>Password </label>
        <input
          type="password"
          name="password"
          value={loginData.password}
          onChange={handleChange}
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </>
  );
};

export default Login;
