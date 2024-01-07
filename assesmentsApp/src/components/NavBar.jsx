import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
function NavBar() {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const logout = () => {
    navigate("/Login", { replace: true });
    setToken();
  };

  return (
    <div style={{ position: "absolute", top: 0, right: 0, padding: "10px" }}>
      <button
        onClick={logout}
        style={{
          backgroundColor: "red",
          color: "white",
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default NavBar;
