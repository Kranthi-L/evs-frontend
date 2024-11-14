import React from "react";
import Home from "./Home";
import NotFound from "./NotFound";
import CreateEventForm from "./CreateEventForm";
import { BrowserRouter, Routes, Route, Link, Outlet } from "react-router-dom";
import DisplayEvent from "./DisplayEvent";
import Events from "./Events";
import ScoringPageComponent from "./ScoringPageComponent";
import LoginForm from "./JudgeLoginForm";
import AdminLoginForm from "./AdminLoginForm";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="events" element={<Events />} />
          <Route path="event/:id" element={<DisplayEvent />} />
          <Route path="form" element={<CreateEventForm />} />
          <Route path="judge/:id" element={<ScoringPageComponent />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="admin" element={<AdminLoginForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

function Layout() {
  return (
    <div className="container">
      <h1>EVS</h1>
      <nav className="nav navbar-expand-sm bg-danger">
        <Link className="nav-link text-white" to="/events">
          Events
        </Link>
        <Link className="nav-link text-white" to="/login">
          Judge
        </Link>
        <Link className="nav-link text-white" to="/admin">
          Admin
        </Link>
      </nav>
      <p></p>
      <Outlet />
    </div>
  );
}
