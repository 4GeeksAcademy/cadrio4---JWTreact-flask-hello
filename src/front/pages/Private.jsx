import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Private = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);

  const API_URL = "https://bug-free-space-memory-pj6w6rrwx6wq36947-3001.app.github.dev/api";

  useEffect(() => {
    const token = sessionStorage.getItem("jwt-token");

    if (!token) {
      navigate("/login");
      return;
    }

    const validateToken = async () => {
      try {
        const resp = await fetch(`${API_URL}/hello/private`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resp.ok) {
          sessionStorage.removeItem("jwt-token");
          navigate("/login");
          return;
        }

        const data = await resp.json();
        setUser(data.user);
        setLoading(false);

      } catch (err) {
        console.error(err);
        setError("Error de conexión con el servidor");
        setLoading(false);
      }
    };

    validateToken();
  }, [navigate]);

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status" />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center mb-4">
            Área privada 🔒 </h2>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}

          {user && (
            <div className="alert alert-success">
              <h4>¡Bienvenido!</h4>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>ID:</strong> {user.id}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
