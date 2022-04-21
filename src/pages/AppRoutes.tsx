import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./Home";
import { Login } from "./Login";
import { NotFound } from "./NotFound";
import { Register } from "./Register";

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/cadastrar" element={<Register />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};
