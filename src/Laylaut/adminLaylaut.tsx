import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideBar/SideBar";
import Header from "../components/header";
// import { Header } from "antd/es/layout/layout";
// import { useAuthStore } from "../store/authStore";

const AdminLayout: React.FC = () => {
  const role = sessionStorage.getItem('role')
  // const { firstname } = useAuthStore()
  // console.log(firstname);
  
  return (
    <div className="flex min-h-screen flex-col">
      <header className="w-full bg-white flex flex-end">
        {/* <Header>
          <div className="flex justify-end p-3">
            <img className="" src="" alt="ram yuq" />
          </div>
          {firstname && firstname.length > 0 && (
            <div>
              <h1 className="text-white">{firstname}</h1>
            </div>
          )}
          <h1>
          </h1>
        </Header> */}
        <Header/> 
      </header>
      <div className="flex flex-1">
        {(role === "ROLE_SUPER_ADMIN" || role === "ROLE_CLIENT" || role === "ROLE_ADMIN" || role === "ROLE_TESTER") && (
          <div className="lg:block w-64 bg-white hidden lg:flex">
            <Sidebar />
          </div>
        )}
        <main className="flex-1 p-4 bg-gray-200 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
