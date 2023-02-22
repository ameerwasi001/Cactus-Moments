import React from "react";
import { Routes, Route } from "react-router-dom";
import * as Pages from "../pages";


const Navigation = () => {
  return (
    <Routes>
      <Route path="/" element={<Pages.Dashboard />} />
      <Route path="/aboutus" element={<Pages.AboutUs />} />
      <Route path="/contactus" element={<Pages.ContactUs />} />
      <Route path="/poster" element={<Pages.Poster />} />
      <Route path="/searchpage" element={<Pages.SearchPage />} />
      <Route path="/privacypolicy" element={<Pages.Privacypolicy />} />
      <Route path="/terms" element={<Pages.Terms />} />
    </Routes>
  );
};

export default Navigation;
