import React from "react";
import { Outlet } from "react-router-dom";
import Head from "./Head";
import Sidebar from "./Sidebar";

const Body = () => {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Head />
      <div className="flex">
        <Sidebar />
        <main id="main-content" className="min-w-0 flex-1">
          <React.Suspense fallback={
            <div className="flex items-center justify-center w-full h-[50vh]">
              <div className="w-8 h-8 border-4 border-slate-200 border-t-red-600 rounded-full animate-spin"></div>
            </div>
          }>
            <Outlet />
          </React.Suspense>
        </main>
      </div>
    </div>
  );
};

export default Body;
