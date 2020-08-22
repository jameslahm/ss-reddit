import React, { useContext } from "react";
import { Redirect, useLocation } from "@reach/router";
import { AuthContext } from "../utils";

function PrivateRoute({ component: Component, path, ...props }) {
  const { authState } = useContext(AuthContext);
  const location = useLocation();
  return authState ? (
    <Component {...props}></Component>
  ) : (
    <Redirect
      to={"/login"}
      noThrow
      state={{ from: location.pathname }}
    ></Redirect>
  );
}

export default PrivateRoute;
