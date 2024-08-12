import { useState } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginAccount } from "../Redux/Reducer";
import updateImage from "./update.jpg"; 

function Loginpage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);  
  const toggleShowPassword = () => {    
    setShowPassword(!showPassword); 
  };

  const [LoginData, setLoginData] = useState({
    email: "",
    password: ""
  });
  

  const handleUserInput = (e) => {
    const { name, value } = e.target;
    setLoginData({
      ...LoginData,
      [name]: value,
    });
  };

  async function logintoAccount(e) {
    e.preventDefault();
    // Basic form validation
    if ([LoginData.email, LoginData.password].some((field) => field.trim() === "")) {
      toast.error("Please fill all details.");
      return;
    }
   
    // Dispatch action to Redux store
    const response = await dispatch(loginAccount(LoginData));
    console.log(response);
    if (response?.payload?.statusCode === 200)
      navigate('/');
    
    setLoginData({
      email: "",
      password: ""
    });
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-100 " style={{ backgroundImage: `url(${updateImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <form
        noValidate
        onSubmit={logintoAccount}
        className="flex flex-col bg-white text-blue-500 justify-center gap-3 rounded-lg p-4 w-96 shadow-lg"
      >
        <h1 className="text-center text-2xl font-bold">Login Page</h1>
        
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold">
            Email
          </label>
          <input
            type="email"
            required
            value={LoginData.email}
            name="email"
            id="email"
            placeholder="Enter your Email..."
            className="bg-transparent px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleUserInput}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-semibold">
            Password
          </label>
          <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={LoginData.password}
            name="password"
            id="password"
            placeholder="Enter your Password..."
            className="bg-transparent px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:border-blue-500"
            onChange={handleUserInput}
          />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-blue-500 focus:outline-none"
            >
              {showPassword ? "Hide" : "Show"}
            </button>

          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-blue-50 py-2 rounded-md hover:bg-blue-600 transition-all ease-in-out duration-300"
        >
          Login Account
        </button>
        <p className="text-center text-gray-700">
          Do not have an account?{" "}
          <Link to="/signup" className="text-blue-500 hover:underline">
            Signup
          </Link>
        </p>
      </form>
    </div>
  );
}

export default Loginpage;
