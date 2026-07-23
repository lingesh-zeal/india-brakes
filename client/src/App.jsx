import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Events from "./pages/Events";
import Dashboard from "./pages/Dashboard";

import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import EventDetail from "./pages/EventDetail";
import EventRegistrations from "./pages/EventRegistrations";
import Sponsors from "./pages/Sponsors";
import WelcomeCMS from "./pages/WelcomeCMS";
import HeroBanner from "./pages/HeroBanner";


function App() {
  return (
    <BrowserRouter>
        <Routes>
          {/* Public route  */}
          <Route path="/" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/events" element={<Events />} />
              {/* <Route path="/events/create" element={<CreateEvent />} /> */}
              {/* <Route path="/events/edit/:id" element={<EditEvent />} /> */}
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="sponsors" element={<Sponsors/>} />
              <Route path="/events/:id/registrations" element={<EventRegistrations />} />
              <Route path={"/welcome"} element={<WelcomeCMS/>}/>
              <Route path={"hero-banner"} element={<HeroBanner/>}/>
            </Route>
          </Route>
        </Routes>
    </BrowserRouter>
  );
}

export default App;
