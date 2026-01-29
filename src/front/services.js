const API_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (newUser) => {
    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || response.statusText);
        }

        return data;
    } catch (error) {
        throw new Error(error.message || 'Registration failed. Please try again.');
    }
};

export const loginUser = async (user) => {
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || response.statusText);
        }

        // Guardar el token JWT en sessionStorage
        sessionStorage.setItem("token", data.access_token);

        return data;
    } catch (error) {
        throw new Error(error.message || 'Login failed. Please try again.');
    }
};

export const askProtectedRoute = async () => {
    try {
        const token = sessionStorage.getItem("token");
        if (!token) throw new Error("No token found, please login.");

        const response = await fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 401) {
                sessionStorage.removeItem("token"); // Token inválido
                throw new Error('Unauthorized. Please login again.');
            } else {
                throw new Error(data.message || response.statusText);
            }
        }

        return data;
    } catch (error) {
        throw new Error(error.message || 'Protected route access failed.');
    }
};

// Logout solo borra token, no se necesita endpoint
export const logoutUser = () => {
    sessionStorage.removeItem("token");
};
