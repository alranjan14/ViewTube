import { Coffee, Search } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../shared/routes";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: React.ElementType;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({ title, description, icon: Icon = Coffee }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center px-4">
      <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
        <Icon size={40} className="text-slate-400" />
      </div>
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">{title}</h1>
      <p className="text-slate-500 max-w-md mx-auto mb-8 text-sm sm:text-base">
        {description}
      </p>
      <Link 
        to={ROUTES.HOME}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-full transition-colors flex items-center gap-2 shadow-md shadow-red-600/20"
      >
        <Search size={18} />
        Go back to Home
      </Link>
    </div>
  );
};

export default PlaceholderPage;
