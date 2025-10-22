import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import "./AuthModal.css"; // create some basic styles

const AuthModal = ({ type, closeModal }) => {
  const { login, signup } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (type === "login") {
        await login(email, password);
      } else {
        await signup(name, email, password);
      }
      closeModal(); // close modal on success
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={closeModal}>
          &times;
        </button>
        <h2>{type === "login" ? "Login" : "Signup"}</h2>

        <form onSubmit={handleSubmit}>
          {type === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Please wait..." : type === "login" ? "Login" : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
