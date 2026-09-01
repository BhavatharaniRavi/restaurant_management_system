import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, adminOnly = false, customerOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <Loader />;

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (adminOnly && user.role !== "admin") return <Navigate to="/" replace />;

  if (customerOnly && user.role !== "customer") return <Navigate to="/" replace />;

  return children;
}
