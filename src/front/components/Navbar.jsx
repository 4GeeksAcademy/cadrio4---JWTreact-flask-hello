import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../assets/img/Logo.png";

export const Navbar = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState(sessionStorage.getItem("jwt-token"));

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api";

  
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

  // 🚪 LOGOUT
  const handleLogout = () => {
    sessionStorage.removeItem("jwt-token");
    setToken(null);
    navigate("/");
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
              <Link to="/signup" className="btn btn-primary">
                Regístrate
              </Link>

              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Iniciar sesión
                </button>

                <div
                  className="dropdown-menu dropdown-menu-end p-4"
                  style={{ minWidth: "320px" }}
                >
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="alert alert-danger">{error}</div>
                    )}

                    <div className="mb-3">
                      <label className="form-label">Correo electrónico</label>
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Contraseña</label>
                      <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      Ingresar
                    </button>
                  </form>

                  <div className="dropdown-divider"></div>
                  <Link className="dropdown-item" to="/signup">
                    ¿No tienes cuenta? Regístrate
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/private" className="btn btn-outline-success">
                Área privada
              </Link>
              <button className="btn btn-danger" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};



{/* 
            <div className="mb-3">
              <label className="form-label">Correo electrónico</label>
              <input
                type="email"
                className="form-control"
                placeholder="Introduce tu correo electrónico"
                value={email}
                onChange={({ target }) => setEmail(target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={({ target }) => setPassword(target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-success w-100"
              disabled={loading}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          

          <div className="text-center mt-4">
            <p>
              ¿No tienes cuenta?{" "}
              <Link to="/signup" className="text-success fw-bold text-decoration-none">
                Regístrate
              </Link>
            </p>
          </div> */}


