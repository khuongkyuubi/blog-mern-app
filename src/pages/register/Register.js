import React, { useEffect, useState } from "react";
import "./register.css";
import axios from "axios";
import { Link } from "react-router-dom";
function Register() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    email: "",
  });
  const [error, setError] = useState(false);

  const handleChange = (event) => {
    setError(false);
    setUser({
      ...user,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(false);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_ENDPOINT}/auth/register`,
        user
      );
      res.data && window.location.replace("/login");

      console.log(res);
    } catch (error) {
      setError(true);
      console.log(error);
    }
  };

  useEffect(() => {
    document.title = "Register Page";
  });

  return (
    <div className="register">
      <span className="registerTitle">Register</span>
     

      <form className="registerForm" onSubmit={handleSubmit}>
      {error && (
        <div className="errorMessage">
        <i className="close fa-solid fa-circle-xmark"
            onClick={setError.bind(this, false)}
        />
          <p>Something wrong here! </p>
        </div>
      )}
        <label>Username</label>
        <input
          className="registerInput"
          type="text"
          placeholder="Enter your Username..."
          name="username"
          value={user.username}
          onChange={handleChange}
        />
        <label>Email</label>
        <input
          className="registerInput"
          type="text"
          placeholder="Enter your Email..."
          name="email"
          value={user.email}
          onChange={handleChange}
        />

        <label>Password</label>
        <input
          className="registerInput"
          type="Password"
          placeholder="Enter your password..."
          name="password"
          value={user.password}
          onChange={handleChange}
        />
        <button className="registerButton">Register</button>
      </form>
      <Link className="link" to="/login">
        <button type="submit" className="registerLoginButton">
          Login
        </button>
      </Link>
     
    </div>
  );
}

export default Register;
