import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const API_URL = "http://localhost:3001/api"; // Cambia si tu backend corre en otro puerto

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validación mínima
    if (!email || !password) {
      setError("Debes ingresar email y contraseña");
      setLoading(false);
      return;
    }

    try {
      const resp = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          username,
          name,
          last_name: lastName,
        }),
      });

      const data = await resp.json();

      if (!resp.ok) {
        setError(data.message || "Error al registrarse");
        setLoading(false);
        return;
      }

      // ✅ Guardar token para login automático
      sessionStorage.setItem("jwt-token", data.access_token);

      // Limpiar campos
      setEmail("");
      setPassword("");
      setUsername("");
      setName("");
      setLastName("");

      // ✅ Redirigir a área privada
      navigate("/private");

    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center mt-5">
      <h1 className="mb-4">Registrarse</h1>

      <form onSubmit={handleSignUp} style={{ maxWidth: "420px", width: "100%" }}>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-3">
          <label className="form-label">Correo electrónico</label>
          <input
            type="email"
            className="form-control"
            placeholder="email@example.com"
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
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre de usuario</label>
          <input
            type="text"
            className="form-control"
            placeholder="Tu username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Apellido</label>
          <input
            type="text"
            className="form-control"
            placeholder="Tu apellido"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};
