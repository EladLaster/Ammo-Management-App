import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {authProvider} from "../AuthProvider/AuthProvider"

export function ProtectedRoute({ children }) {
//   const { user, loadingUser } = useContext(UserContext);
    const activeUser = authProvider.getActiveUser();

  if (loadingUser) {
    return <p>Loading...</p>;
  }

  if (!activeUser) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
