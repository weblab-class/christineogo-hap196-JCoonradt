import React, { useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from "../App";
import "./Login.css";
import loginBackground from "../../assets/loginBackground.png";
import logInTree from "../../assets/logInTree.png";
import racoon from "../../assets/racoon.gif";
import owl from "../../assets/owl.gif";
import WoodenSign from "../../assets/woodenSign.png";

const Login = () => {
  const { handleLogin } = useContext(UserContext);

  return (
    <div className="Login-container">
      {/* <Navbar /> */}

      <img src={loginBackground} alt="Background" className="login-background" />
      <img src={logInTree} alt="Background" className="login-tree" />
      <img src={racoon} alt="Cute racoon" className="login-racoon" />
      <img src={owl} alt="Cute owl" className="login-owl" />
      <div className="information-signL">
        <img src={WoodenSign} alt="Info Sign" className="information-signL" />
        <h1>Welcome to Skills Tree!</h1>
        <h2>
          With our Skills Tree, every goal is a seed, and every achievement a leaf in your journey
          to success
        </h2>
      </div>

      <div
        style={{
          position: "fixed",
          bottom: "200px",
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      </div>
    </div>
  );
};

export default Login;
