import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const API_URL = "https://bug-free-space-memory-pj6w6rrwx6wq36947-3001.app.github.dev/api";

  const {store, dispatch} = useGlobalReducer();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const resp = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      sessionStorage.setItem("jwt-token", data.access_token);
      dispatch({type:"setToken", payload:data.access_token})
      navigate("/private");

    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="mb-4">Iniciar sesión</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/>
        </div>
        <div className="mb-3">
          <label>Contraseña</label>
          <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <button className="btn btn-primary w-100" type="submit">Ingresar</button>
      </form>
    </div>
  );
};
