import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar">
      <div className="navbar-inner" >
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/register">Register</Link>
        <Link className="nav-link" to="/login">Login</Link>
        <Link className="nav-link" to="/dashboard">Dashboard</Link>
      </div>
    </div>
  );
}

export default Navbar;



