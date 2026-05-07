import { Navigate } from "react-router-dom";

export default function Redirect() {
  const token = localStorage.getItem("authToken");

  return token ? (
    <Navigate to="/projects" replace />
  ) : (
    <Navigate to="/login" replace />
  );
}