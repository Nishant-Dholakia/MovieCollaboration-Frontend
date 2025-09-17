import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Film } from "lucide-react";
import { AuthContext } from "../context/AuthContext";

const Header: React.FC = () => {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  if (!authContext) {
    throw new Error("Navbar must be used within an AuthProvider");
  }

  const { user, logout } = authContext;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900/90 backdrop-blur-md border-b border-gray-800 px-6 py-3 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left - Logo */}
        <div
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-white cursor-pointer"
        >
          <Film className="w-6 h-6 text-red-500" />
          <span className="font-bold text-xl">MovieHub</span>
        </div>

        {/* Right - Links */}
        <div className="flex items-center gap-6 text-gray-300 font-medium">
          <Link to="/" className="hover:text-red-400 transition-colors">Home</Link>
          {user && (
            <>
              <Link to="/groups" className="hover:text-red-400 transition-colors">Groups</Link>
              <Link to="/watchlist" className="hover:text-red-400 transition-colors">Watchlist</Link>
            </>
          )}

          {!user ? (
            <>
              <Link to="/login" className="hover:text-red-400 transition-colors">Login</Link>
              <Link to="/signup" className="hover:text-red-400 transition-colors">Signup</Link>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate("/profile")}
                className="text-white font-semibold hover:text-red-400 transition-colors"
              >
                {user.username}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded-lg text-white text-sm transition-colors"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;
