import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { ROUTES } from "../shared/routes";

const NotFoundPage = () => {
  const error = useRouteError() as { statusText?: string; message?: string };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-slate-900 p-4">
      <h1 className="text-6xl font-bold text-slate-300 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-2">Oops! Page not found.</h2>
      <p className="text-slate-600 mb-6 text-center max-w-md">
        {error?.statusText || error?.message || "The page you are looking for does not exist or has been moved."}
      </p>
      <Link
        to={ROUTES.HOME}
        className="px-6 py-2 bg-red-600 text-white rounded-full font-medium hover:bg-red-700 transition-colors"
      >
        Go back home
      </Link>
    </div>
  );
};

export default NotFoundPage;
