import { Layout } from "./pages/Layout";
import { Home } from "./pages/Home";
import { Demo } from "./pages/Demo";
import { SignUpPage } from "./pages/SignUpPage";
import { Private } from "./pages/Private";
import { Login } from "./pages/Login";
import { createBrowserRouter, createRoutesFromElements, Route } from "react-router-dom";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />} errorElement={<h1>Not found!</h1>}>
      <Route path="/" element={<Home />} />
      <Route path="/demo" element={<Demo />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/login" element={<Login />} /> {/* NUEVA */}
      <Route path="/private" element={<Private />} />
    </Route>
  )
);
