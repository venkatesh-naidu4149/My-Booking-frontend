import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import UserDashboard from "./UserDashboard";
import Update from "./Update";
import Delete from "./Delete";
import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/log" element={<Login />} />
        <Route path="/reg" element={<Register />} />
        <Route path="/dboard" element={<UserDashboard />} />
        <Route path="/update" element={<Update />} />
        <Route path="/del" element={<Delete />} />
      </Routes>
    </BrowserRouter>
  );
}
