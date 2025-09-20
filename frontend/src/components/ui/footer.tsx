import React from "react";
import {Link} from "react-router-dom";
import AlertSubscription from "../AlertSubscription";
const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full  p-6 flex items-center">
      <Link
          to="/subscribe"
          className="px-6 py-4 rounded-xl bg-primary text-white text-xl transition no-underline hover:no-underline hover:bg-danger  "
        >
          Subscribe for Alert
      </Link>
    </footer>
  );
};

export default Footer;
