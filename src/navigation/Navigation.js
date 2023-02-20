import React from "react";
import { Routes, Route } from "react-router-dom";
import * as Pages from "../pages";


const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Pages.Dashboard />} />
    </Routes>
  );
};

export default Navigation;
