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
      <Route path="/loginAsVendor" element={<Pages.LoginAsVendor />} />
      <Route path="/orders" element={<Pages.Orders />} />
      {/* <Route path="/viewOrder" element={<Pages.ViewOrder />} /> */}
      <Route path="/templetedetail" element={<Pages.TempleteDetail />} />
      <Route path="/billingAddress" element={<Pages.BillingAddress />} />
      <Route path="/payment" element={<Pages.Payment />} />
      <Route path="/:vendor" element={<Pages.Dashboard />} />
    </Routes>
  );
};

export default Navigation;
