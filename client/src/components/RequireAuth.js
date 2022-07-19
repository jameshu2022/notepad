import React from "react";
import { useAuth } from "../Auth.js";
import { useLocation, Navigate } from "react-router-dom";

function RequireAuth(props) {
  const { authed } = useAuth();
  const location = useLocation();

  return authed === true ? (
    props.children
  ) : (
    <Navigate to="/login" replace state={{ path: location.pathname }} />
  );
}

export default RequireAuth;
