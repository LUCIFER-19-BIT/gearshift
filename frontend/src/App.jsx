import React, { useEffect } from "react";
import {
  Routes,
  Route,
} from "react-router-dom";
import useAuthStore from "./utils/authStore";

import ESUV from "./pages/esuv";
import Curve from "./pages/curve";
import Harrier from "./pages/harrier";
import Punch from "./pages/punch";
import Tiago from "./pages/tiago";
import Tigor from "./pages/tigor";
import Nexon from "./pages/nexon";
import CarCircle from "./pages/carcircle";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/Home";
import SUVs from "./pages/SUVs";
import Bookings from "./pages/Bookings";
import TestDrive from "./pages/TestDrive";
import Recommendation from "./pages/Recommendation";
import Parts from "./pages/parts";
import Cart from "./pages/Cart";
import Thank from "./pages/Thank";
import AutoSpace from "./pages/autospace";
import Header from "./components/header";
import Footer from "./components/footer";
import "./App.css";





function App() {
  const initAuth = useAuthStore((state) => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/suvs" element={<SUVs />} />
        <Route path="/esuv" element={<ESUV />} />
        <Route path="/recommendation" element={<Recommendation />} />
        <Route path="/curve" element={<Curve />} />
        <Route path="/harrier" element={<Harrier />} />
        <Route path="/punch" element={<Punch />} />
        <Route path="/tiago" element={<Tiago />} />
        <Route path="/tigor" element={<Tigor />} />
        <Route path="/nexon" element={<Nexon />} />
        <Route path="/carcircle" element={<CarCircle />} />
        <Route path="/parts" element={<Parts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/thank" element={<Thank />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/testdrive" element={<TestDrive />} />
        <Route path="/autospace" element={<AutoSpace />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
