import React, { useState } from "react";
import Header from "./Components/Header";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="container">
      <Header />
      <Outlet />
    </div>
  );
}
