import React, { useContext } from "react";
import { Redirect, useLocation } from "@reach/router";
import { PUBLIC_ROUTES, AuthContext } from "../utils";

function PrivateRoute({ component:Component, path, ...props }) {
  const { authState } = useContext(AuthContext);
  const location = useLocation();
  return authState ? (
    <Component {...props}></Component>
  ) : (
    <Redirect to={"/login"} noThrow state={{ from: path }}></Redirect>
  );
}

export default PrivateRoute;
