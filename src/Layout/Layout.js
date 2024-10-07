import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";

const Layout = () => {
  return (
    <div className="h-screen flex overflow-hidden flex-col">
      <div className="sticky top-0 z-10">
        <Navbar />
      </div>
      <div className="flex flex-grow h-screen">
        <Sidebar />
        <div className="flex-1 pl-16 pr-4 pt-3 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
