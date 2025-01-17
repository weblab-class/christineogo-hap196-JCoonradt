import React, { useContext } from 'react'
import { GoogleLogin } from "@react-oauth/google";
import { UserContext } from '../App'
import "./Login.css";

const Login = () => {
  const { handleLogin } = useContext(UserContext);

  return (
    <div className="Login-container">
      {/* <Navbar /> */}
      <img src="/loginBackground.png" alt="Background" className="login-background" />
      <div className="Login-googleButton">
        <GoogleLogin 
          onSuccess={handleLogin} 
          onError={(err) => console.log(err)} 
        />
      </div>
    </div>
  )
}

export default Login