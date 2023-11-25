import React from "react";
import {Route, Routes, BrowserRouter as Router}  from 'react-router-dom'

import ForgetPassword from "./pages/ForgetPassword";
import LoginRegister from "./pages/LoginRegister"
import Home from "./pages/Home";
import Footer from "./components/Footer";
import ProductPage from "./pages/ProductPage";
import MyCart from "./pages/MyCart";
import MyOrders from "./pages/MyOrders";
import AdminPanel from "./pages/AdminPanel";
import VendorPanel from "./pages/VendorPanel";
import ProfilePage from "./pages/ProfilePage";

const App = ()=> {
  return (
    <React.Fragment>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login-register" element={<LoginRegister/>}/>
        <Route path="/reset-password" element={<ForgetPassword/>}/>
        <Route path="/product/:id" element={<ProductPage/>}/>
        <Route path="/my-cart" element={<MyCart/>}/>
        <Route path="/my-orders" element={<MyOrders/>}/>
        <Route path="/admin-panel" element={<AdminPanel/>}/>
        <Route path="/vendor-panel" element={<VendorPanel/>}/>
        <Route path="/profile" element={<ProfilePage />}/>
      </Routes>
    </Router>
    <Footer/>
    </React.Fragment>
  );
}

export default App;
