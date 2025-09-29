import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900/90 border-t border-gray-800 text-gray-400 text-sm py-8 ">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6">
        <p>© {new Date().getFullYear()} BingeCult. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-red-400">Privacy</a>
          <a href="#" className="hover:text-red-400">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
