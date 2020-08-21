import React, { useContext } from "react";
import { Redirect } from "@reach/router";
import { AuthContext } from "../utils";

function PrivateRoute({ component: Component, path, ...props }) {
  const { authState } = useContext(AuthContext);
  return authState ? (
    <Component {...props}></Component>
  ) : (
    <Redirect to={"/login"} noThrow state={{ from: path }}></Redirect>
  );
}

export default PrivateRoute;
