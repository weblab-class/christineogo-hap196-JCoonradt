import React, { useContext } from "react";
import { GoogleLogin, googleLogout } from "@react-oauth/google";

import "../../utilities.css";
import "./Home.css";
import { UserContext } from "../App";
import background from "/background.png";
import nobranch from "/nobranch.png";

const Home = () => {
  const { userId, handleLogin, handleLogout } = useContext(UserContext);
  return (
    <>
      {userId ? (
        <button
          onClick={() => {
            googleLogout();
            handleLogout();
          }}
        >
          Logout
        </button>
      ) : (
        <GoogleLogin onSuccess={handleLogin} onError={(err) => console.log(err)} />
      )}
      <img className="background-image" src={background} alt="Background" />
      <img className="tree-image" src={nobranch} alt="Tree with no branches" />
    </>
  );
};

export default Home;
