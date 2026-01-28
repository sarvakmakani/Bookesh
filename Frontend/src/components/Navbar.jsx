import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logoref.png";
const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-slate-200 text-white px-6 h-20 flex justify-between items-center shadow-lg">
      <Link to="/" className="flex items-center gap-3">
        <img
          src={logo}
          alt="Bookesh Logo"
          className="h-16 w-auto object-contain"
        />
        {/* <span className="text-2xl font-bold">Bookesh</span> */}
      </Link>

      <div className="flex gap-4">
        {token ? (
          <>
            <Link to="/books/create">
              <button className="bg-sky-900 hover:bg-sky-700 px-4 py-2 rounded">
                Add Book
              </button>
            </Link>

            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/login">
            <button className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded">
              Login
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
