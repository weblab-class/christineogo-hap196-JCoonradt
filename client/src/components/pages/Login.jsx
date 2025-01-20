import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Login.css";

const Login = () => {
  const { handleLogin } = useContext(UserContext);

  return (
    <div className="Login-container">
      {/* <Navbar /> */}
      <img src="/loginBackground.png" alt="Background" className="login-background" />

      <div className="information-sign">
        <img src="/woodenSign.png" alt="Info Sign" className="information-sign" />
        <h1>Welcome to Skills Tree!</h1>
        <h2>
          Grow your potential, branch by branch. Discover opportunities, nurture your talents, and
          watch your skills flourish. With our Skills Tree, every goal is a seed, and every
          achievement a leaf in your journey to success.
        </h2>
      </div>
      <div className="Login-googleButton">
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      </div>
    </div>
  );
};

export default Login;
