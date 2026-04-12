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
import WhyEV from "./pages/whyev";
import Parts from "./pages/parts";
import Cart from "./pages/Cart";
import Thank from "./pages/Thank";
import AutoSpace from "./pages/autospace";
import Scrap from "./pages/scrap";
import About from "./pages/about";
import Header from "./components/header";
import Footer from "./components/footer";
import "./App.css";


const appRoutes = [
  ["/", Home],
  ["/suvs", SUVs],
  ["/esuv", ESUV],
  ["/recommendation", Recommendation],
  ["/whyev", WhyEV],
  ["/curve", Curve],
  ["/harrier", Harrier],
  ["/harrier.jsx", Harrier],
  ["/punch", Punch],
  ["/tiago", Tiago],
  ["/tigor", Tigor],
  ["/nexon", Nexon],
  ["/carcircle", CarCircle],
  ["/parts", Parts],
  ["/cart", Cart],
  ["/thank", Thank],
  ["/login", Login],
  ["/signup", Signup],
  ["/bookings", Bookings],
  ["/about", About],
  ["/testdrive", TestDrive],
  ["/autospace", AutoSpace],
  ["/scrap", Scrap],
];

function App() {
  const initAuth = useAuthStore((state) => state.init);

  useEffect(() => {
    initAuth();
  }, [initAuth]);

  return (
    <>
      <Header />
      <Routes>
        {appRoutes.map(([path, Component]) => (
          <Route key={path} path={path} element={<Component />} />
        ))}
      </Routes>
      <Footer />
    </>
  );
}

export default App;
