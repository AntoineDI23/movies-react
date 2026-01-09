import { Outlet } from "react-router";
import Navbar from "./Navbar/Navbar";

const Layout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default Layout;
