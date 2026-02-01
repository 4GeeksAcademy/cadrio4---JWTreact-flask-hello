import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo.png";
import useGlobalReducer from "../hooks/useGlobalReducer"


export const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(null);
  const { store, dispatch } = useGlobalReducer();


  const navigate = useNavigate();
  // const API_URL = "https://bug-free-space-memory-pj6w6rrwx6wq36947-3001.app.github.dev/api";


  const handleSubmit = async (e) => {
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
      setToken(data.access_token);
      setEmail("");
      setPassword("");
      navigate("/private");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  useEffect(() => {
    if (store.token) {
      setToken(store.token)
    }
    else {
      setToken(null)
    }
  }, [store.token])


  const handleLogout = () => {
    dispatch({ type: "logout" });
    sessionStorage.removeItem("jwt-token")
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-light bg-light">
      <div className="container">
        <Link to="/" className="navbar-brand">
          <img src={Logo} alt="Logo" className="logo" />
        </Link>

        <div className="d-flex align-items-center gap-3">
          {!token ? (
            <>
              <Link to="/signup" className="btn btn-primary">Regístrate</Link>
              <div className="dropdown">
                <button className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">Iniciar sesión</button>
                <div className="dropdown-menu dropdown-menu-end p-4" style={{ minWidth: "320px" }}>
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger">{error}</div>
                    )}
                    <div className="mb-3">
                      <label className="form-label">Correo electrónico</label>
                      <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input type="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)}required/>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Ingresar</button>
                  </form>
                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/signup">¿No tienes cuenta? Regístrate</Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/private" className="btn btn-outline-success">Área privada</Link>
              <button className="btn btn-danger" onClick={handleLogout}>Cerrar sesión</button>
              </>
          )}
        </div>
      </div>
    </nav>
  );
};